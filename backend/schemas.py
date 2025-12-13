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
