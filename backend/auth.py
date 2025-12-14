from fastapi import APIRouter, HTTPException
from .database import db
from .schemas import RegisterSchema, LoginSchema
from argon2 import PasswordHasher
from bson import ObjectId

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
        "role": user.role or "farmer"     #  FIXED ROLE
    }

    result = await db.users.insert_one(new_user)

    return {
        "message": "User registered successfully",
        "id": str(result.inserted_id),
        "role": new_user["role"]          #  returned properly
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
        "role": user["role"]              #  now visible
    }
