from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterSchema(BaseModel):
    fullname: str
    email: EmailStr
    password: str
    role: Optional[str] = "farmer"

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    fullname: str
    email: str
    role: str

class ImageResponse(BaseModel):
    id: str
    userId: str
    imageUrl: str
    disease: Optional[str] = "Pending"
    confidence: Optional[float] = 0.0
    
class SoilReportSchema(BaseModel):
    userId: str
    ph: float
    moisture: float
    temperature: float
    recommendation: Optional[str] = None

class OAuthLoginSchema(BaseModel):
    email: EmailStr
    fullname: str
    provider: str   # "google"

# NEW: Password Reset Schemas
class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class VerifyOTPSchema(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    otp: str
    new_password: str