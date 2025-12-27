import os
from fastapi import APIRouter, UploadFile, File, Form
from database import db

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image")
async def upload_image(
    userId: str = Form(...),
    image: UploadFile = File(...)
):
    file_path = os.path.join(UPLOAD_DIR, image.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await image.read())

    saved = await db.images.insert_one({
        "userId": userId,
        "imageUrl": file_path,
        "disease": "Pending",
        "confidence": 0.0
    })

    return {
        "message": "Image uploaded successfully ",
        "filename": image.filename,
        "id": str(saved.inserted_id)
    }

