from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from auth import hash_password, verify_password, create_token

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Krishi AI Backend")

# Database Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# REGISTER
@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)

    new_user = models.User(
        email=user.email,
        password=hashed,
        role=user.role   
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# LOGIN

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Token le email ra role store hancha 
    token = create_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "role": db_user.role
    }


# ADMIN-ONLY ENDPOINT
@app.get("/admin-only")
def admin_data(role: str = Header(...)):

    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")

    return {"message": "Welcome Admin! You have full access."}


# FARMER-ONLY ENDPOINT

@app.get("/farmer-only")
def farmer_data(role: str = Header(...)):

    if role != "farmer":
        raise HTTPException(status_code=403, detail="Farmer access only")

    return {"message": "Welcome Farmer! You have farmer access."}
