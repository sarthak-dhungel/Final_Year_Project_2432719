from fastapi import APIRouter, HTTPException, Header
from database import db
from bson import ObjectId
from pydantic import BaseModel, EmailStr
from typing import Optional
from argon2 import PasswordHasher
from datetime import datetime

router = APIRouter()
ph = PasswordHasher()

# Simple admin key auth — matches frontend ADMIN_SECRET_KEY
ADMIN_KEY = "KRISHI_ADMIN_2025"


def verify_admin(admin_key: str):
    if admin_key != ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")


# ============ SCHEMAS ============

class AdminUserUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    password: Optional[str] = None


class AdminUserCreate(BaseModel):
    fullname: str
    email: EmailStr
    password: str
    role: Optional[str] = "farmer"


# ============ USER CRUD ============

@router.get("/users")
async def list_users(admin_key: str = Header(alias="X-Admin-Key")):
    """List all users"""
    verify_admin(admin_key)

    users = []
    cursor = db.users.find({})
    async for user in cursor:
        users.append({
            "id": str(user["_id"]),
            "fullname": user.get("fullname", ""),
            "email": user.get("email", ""),
            "role": user.get("role", "farmer"),
            "provider": user.get("provider", "credentials"),
            "created_at": user.get("created_at", "").isoformat() if isinstance(user.get("created_at"), datetime) else str(user.get("created_at", ""))
        })

    return {"users": users, "total": len(users)}


@router.get("/users/{user_id}")
async def get_user(user_id: str, admin_key: str = Header(alias="X-Admin-Key")):
    """Get a single user by ID"""
    verify_admin(admin_key)

    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "fullname": user.get("fullname", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "farmer"),
        "provider": user.get("provider", "credentials"),
        "created_at": user.get("created_at", "").isoformat() if isinstance(user.get("created_at"), datetime) else str(user.get("created_at", ""))
    }


@router.post("/users")
async def create_user(data: AdminUserCreate, admin_key: str = Header(alias="X-Admin-Key")):
    """Create a new user (admin)"""
    verify_admin(admin_key)

    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "fullname": data.fullname,
        "email": data.email,
        "password": ph.hash(data.password),
        "role": data.role or "farmer",
        "created_at": datetime.utcnow()
    }

    result = await db.users.insert_one(new_user)

    return {
        "message": "User created",
        "id": str(result.inserted_id)
    }


@router.put("/users/{user_id}")
async def update_user(user_id: str, data: AdminUserUpdate, admin_key: str = Header(alias="X-Admin-Key")):
    """Update a user"""
    verify_admin(admin_key)

    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    update_fields = {}

    if data.fullname is not None:
        update_fields["fullname"] = data.fullname
    if data.email is not None:
        # Check email not taken by another user
        existing = await db.users.find_one({"email": data.email, "_id": {"$ne": ObjectId(user_id)}})
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        update_fields["email"] = data.email
    if data.role is not None:
        update_fields["role"] = data.role
    if data.password is not None:
        update_fields["password"] = ph.hash(data.password)

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated"}


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin_key: str = Header(alias="X-Admin-Key")):
    """Delete a user"""
    verify_admin(admin_key)

    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = await db.users.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted"}


# ============ STATS ============

@router.get("/stats")
async def get_stats(admin_key: str = Header(alias="X-Admin-Key")):
    """Get dashboard stats"""
    verify_admin(admin_key)

    total_users = await db.users.count_documents({})
    total_diagnoses = await db.diagnoses.count_documents({}) if "diagnoses" in await db.list_collection_names() else 0
    total_soil = await db.soil_reports.count_documents({}) if "soil_reports" in await db.list_collection_names() else 0

    return {
        "total_users": total_users,
        "total_diagnoses": total_diagnoses,
        "total_soil_reports": total_soil
    }
