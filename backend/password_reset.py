from fastapi import APIRouter, HTTPException
from database import db
from schemas import ForgotPasswordSchema, VerifyOTPSchema, ResetPasswordSchema
from argon2 import PasswordHasher
from datetime import datetime, timedelta
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
ph = PasswordHasher()

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")  # Your email
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")  # App password for Gmail

def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))

def send_otp_email(recipient_email: str, otp: str):
    """Send OTP via email"""
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = "Krishi AI - Password Reset OTP"
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email

        # Create HTML email
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #2d5016; margin-bottom: 20px;">Krishi AI - Password Reset</h2>
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        You requested to reset your password. Use the OTP below to continue:
                    </p>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                        <h1 style="color: #2d5016; font-size: 36px; letter-spacing: 8px; margin: 0;">
                            {otp}
                        </h1>
                    </div>
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                        This OTP will expire in 10 minutes.<br>
                        If you didn't request this, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2024 Krishi AI. All rights reserved.
                    </p>
                </div>
            </body>
        </html>
        """

        part = MIMEText(html, "html")
        message.attach(part)

        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordSchema):
    """Step 1: Send OTP to user's email"""
    # Check if user exists
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    # Generate OTP
    otp = generate_otp()
    expiry_time = datetime.utcnow() + timedelta(minutes=10)

    # Store OTP in database
    await db.otp_codes.update_one(
        {"email": data.email},
        {
            "$set": {
                "email": data.email,
                "otp": otp,
                "expires_at": expiry_time,
                "verified": False
            }
        },
        upsert=True
    )

    # Send OTP via email
    email_sent = send_otp_email(data.email, otp)
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send OTP email")

    return {
        "message": "OTP sent to your email",
        "email": data.email
    }

@router.post("/verify-otp")
async def verify_otp(data: VerifyOTPSchema):
    """Step 2: Verify the OTP"""
    # Find OTP record
    otp_record = await db.otp_codes.find_one({"email": data.email})
    
    if not otp_record:
        raise HTTPException(status_code=404, detail="OTP not found")

    # Check if OTP expired
    if datetime.utcnow() > otp_record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP expired")

    # Check if OTP matches
    if otp_record["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Mark OTP as verified
    await db.otp_codes.update_one(
        {"email": data.email},
        {"$set": {"verified": True}}
    )

    return {
        "message": "OTP verified successfully",
        "email": data.email
    }

@router.post("/reset-password")
async def reset_password(data: ResetPasswordSchema):
    """Step 3: Reset the password"""
    # Find and verify OTP record
    otp_record = await db.otp_codes.find_one({"email": data.email})
    
    if not otp_record:
        raise HTTPException(status_code=404, detail="OTP not found")

    # Check if OTP was verified
    if not otp_record.get("verified", False):
        raise HTTPException(status_code=400, detail="OTP not verified")

    # Check if OTP expired
    if datetime.utcnow() > otp_record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP expired")

    # Check if OTP matches (extra security)
    if otp_record["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Hash new password
    hashed_password = ph.hash(data.new_password)

    # Update user password
    result = await db.users.update_one(
        {"email": data.email},
        {"$set": {"password": hashed_password}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete OTP record (cleanup)
    await db.otp_codes.delete_one({"email": data.email})

    return {
        "message": "Password reset successfully",
        "email": data.email
    }