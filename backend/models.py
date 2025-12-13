from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    fullname: str
    email: str
    password: str
    role: str = "farmer"

class SoilReport(BaseModel):
    userId: str
    ph: float
    moisture: float
    temperature: float
    recommendation: Optional[str] = None

class ImageUpload(BaseModel):
    userId: str
    imageUrl: str
    disease: Optional[str] = "Pending"
    confidence: Optional[float] = 0.0
