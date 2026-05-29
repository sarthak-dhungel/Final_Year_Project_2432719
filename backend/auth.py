from fastapi import APIRouter, HTTPException
from database import db
from schemas import RegisterSchema, LoginSchema
from argon2 import PasswordHasher
from bson import ObjectId
from schemas import OAuthLoginSchema
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()
ph = PasswordHasher()

@router.post("/register")
async def register(user: RegisterSchema):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_pass = ph.hash(user.password)

    new_user = {
        "fullname": user.fullname,
        "email": user.email,
        "password": hashed_pass,
        "role": user.role or "farmer"
    }

    result = await db.users.insert_one(new_user)

    return {
        "message": "User registered successfully",
        "id": str(result.inserted_id),
        "role": new_user["role"]
    }


@router.post("/login")
async def login(credentials: LoginSchema):
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email")

    try:
        ph.verify(user["password"], credentials.password)
    except:
        raise HTTPException(status_code=400, detail="Invalid password")

    return {
        "message": "Login successful",
        "userId": str(user["_id"]),
        "fullname": user["fullname"],
        "role": user["role"]
    }

@router.post("/oauth-login")
async def oauth_login(user: OAuthLoginSchema):
    existing = await db.users.find_one({"email": user.email})

    if not existing:
        new_user = {
            "fullname": user.fullname,
            "email": user.email,
            "password": None,
            "provider": user.provider,
            "role": "farmer",
            "created_at": datetime.utcnow()
        }

        result = await db.users.insert_one(new_user)

        return {
            "message": "OAuth user created",
            "userId": str(result.inserted_id),
            "fullname": new_user["fullname"],
            "role": new_user["role"]
        }

    return {
        "message": "OAuth login successful",
        "userId": str(existing["_id"]),
        "fullname": existing["fullname"],
        "role": existing["role"]
    }


class ChangePasswordSchema(BaseModel):
    userId: str
    currentPassword: str
    newPassword: str

@router.post("/change-password")
async def change_password(data: ChangePasswordSchema):
    if not ObjectId.is_valid(data.userId):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await db.users.find_one({"_id": ObjectId(data.userId)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.get("password"):
        raise HTTPException(status_code=400, detail="Google OAuth accounts cannot change password here")

    try:
        ph.verify(user["password"], data.currentPassword)
    except:
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if len(data.newPassword) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    if not any(c.isupper() for c in data.newPassword):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")

    if not any(c.islower() for c in data.newPassword):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter")

    if not any(c.isdigit() for c in data.newPassword):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")

    if not any(c in "!@#$%^&*()_+-=[]{}|;:',.<>?/" for c in data.newPassword):
        raise HTTPException(status_code=400, detail="Password must contain at least one special character (!@#$%^&*)")

    hashed = ph.hash(data.newPassword)
    await db.users.update_one({"_id": ObjectId(data.userId)}, {"$set": {"password": hashed}})

    return {"message": "Password changed successfully"}