from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
import random, string
from typing import List

router = APIRouter(prefix="/guardian", tags=["guardian"])

def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

def generate_username(name: str, db: Session):
    base_username = name.lower().replace(" ", "")
    while True:
        username = base_username + str(random.randint(100, 999))
        existing = db.query(models.Student).filter(models.Student.username == username).first()
        if not existing:
            return username

@router.post("/students", response_model=schemas.StudentCreatedResponse)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db), current_guardian: models.Guardian = Depends(auth.get_current_guardian)):
    username = generate_username(student.name, db)
    temp_password = generate_random_password()
    hashed_password = auth.get_password_hash(temp_password)

    new_student = models.Student(
        guardian_id=current_guardian.id,
        name=student.name,
        student_class=student.student_class,
        username=username,
        password_hash=hashed_password
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {**new_student.__dict__, "temp_password": temp_password}

@router.post("/students/{student_id}/reset-password")
def reset_student_password(student_id: int, db: Session = Depends(get_db), current_guardian: models.Guardian = Depends(auth.get_current_guardian)):
    student = db.query(models.Student).filter(models.Student.id == student_id, models.Student.guardian_id == current_guardian.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    temp_password = generate_random_password()
    student.password_hash = auth.get_password_hash(temp_password)
    db.commit()
    return {"message": "Password reset successful", "temp_password": temp_password}

@router.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db), current_guardian: models.Guardian = Depends(auth.get_current_guardian)):
    student = db.query(models.Student).filter(models.Student.id == student_id, models.Student.guardian_id == current_guardian.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}

@router.get("/students", response_model=List[schemas.StudentResponse])
def list_students(db: Session = Depends(get_db), current_guardian: models.Guardian = Depends(auth.get_current_guardian)):
    students = db.query(models.Student).filter(models.Student.guardian_id == current_guardian.id).all()
    # Basic analytics logic goes here (can be expanded later)
    return students
