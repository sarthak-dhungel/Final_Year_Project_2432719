from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router
from upload import router as upload_router
<<<<<<< Updated upstream
from disease import router as disease_router
=======
from password_reset import router as password_reset_router
from soil_analysis import router as soil_router
from ai_predict import router as ai_router
>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
app.include_router(disease_router, prefix="/disease")
=======
app.include_router(password_reset_router, prefix="/auth")
app.include_router(soil_router, prefix="/soil")
app.include_router(ai_router)  
>>>>>>> Stashed changes
