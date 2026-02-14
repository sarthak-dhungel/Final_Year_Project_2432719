from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router
from upload import router as upload_router
from password_reset import router as password_reset_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Krishi AI Backend Running "}

app.include_router(auth_router, prefix="/auth")
app.include_router(upload_router, prefix="/image")
app.include_router(password_reset_router, prefix="/auth") 