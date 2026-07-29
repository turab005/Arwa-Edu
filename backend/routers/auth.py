from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/guardian/register", response_model=schemas.GuardianResponse)
def register_guardian(guardian: schemas.GuardianCreate, db: Session = Depends(get_db)):
    db_guardian = db.query(models.Guardian).filter(models.Guardian.email == guardian.email).first()
    if db_guardian:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(guardian.password)
    new_guardian = models.Guardian(
        name=guardian.name,
        email=guardian.email,
        phone=guardian.phone,
        password_hash=hashed_password
    )
    db.add(new_guardian)
    db.commit()
    db.refresh(new_guardian)
    return new_guardian

@router.post("/guardian/login", response_model=schemas.Token)
def login_guardian(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form_data.username will be the email for guardians
    guardian = db.query(models.Guardian).filter(models.Guardian.email == form_data.username).first()
    if not guardian or not auth.verify_password(form_data.password, guardian.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": str(guardian.id), "role": "guardian"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/student/login", response_model=schemas.Token)
def login_student(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form_data.username is actual username for students
    student = db.query(models.Student).filter(models.Student.username == form_data.username).first()
    if not student or not auth.verify_password(form_data.password, student.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = auth.create_access_token(data={"sub": str(student.id), "role": "student"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/admin/login", response_model=schemas.Token)
def login_admin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"DEBUG: Hit login_admin with username: {form_data.username}")
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    if not admin or not auth.verify_password(form_data.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": str(admin.id), "role": "content_admin"})
    return {"access_token": access_token, "token_type": "bearer"}
