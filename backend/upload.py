import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from database import db
from datetime import datetime

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image")
async def upload_image(
    userId: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        # Generate unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(image.filename)[1]
        unique_filename = f"{timestamp}_{image.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # Save file
        with open(file_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)

        # Store relative path (not absolute) for portability
        relative_path = f"uploads/{unique_filename}"

        # Insert into database with proper field types
        saved = await db.images.insert_one({
            "userId": userId,
            "imageUrl": relative_path,
            "disease": "Pending",
            "confidence": 0.0,
            "uploadedAt": datetime.now(),
            "status": "uploaded"
        })

        return {
            "message": "Image uploaded successfully",
            "filename": unique_filename,
            "id": str(saved.inserted_id),
            "imageUrl": relative_path
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")