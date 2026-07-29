from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
from typing import List

router = APIRouter(prefix="/admin", tags=["admin"])

# --- Subjects ---
@router.post("/subjects", response_model=schemas.SubjectResponse)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    new_subject = models.Subject(**subject.model_dump())
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject

@router.get("/subjects", response_model=List[schemas.SubjectResponse])
def get_subjects(db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    return db.query(models.Subject).all()

# --- Chapters ---
@router.post("/subjects/{subject_id}/chapters", response_model=schemas.ChapterResponse)
def create_chapter(subject_id: int, chapter: schemas.ChapterCreate, db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    new_chapter = models.Chapter(**chapter.model_dump(), subject_id=subject_id)
    db.add(new_chapter)
    db.commit()
    db.refresh(new_chapter)
    return new_chapter

@router.get("/subjects/{subject_id}/chapters", response_model=List[schemas.ChapterResponse])
def get_chapters(subject_id: int, db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    return db.query(models.Chapter).filter(models.Chapter.subject_id == subject_id).all()

# --- Questions ---
@router.post("/chapters/{chapter_id}/questions", response_model=schemas.QuestionResponse)
def create_question(chapter_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
        
    new_question = models.Question(
        **question.model_dump(),
        chapter_id=chapter_id,
        created_by=current_admin.id
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

@router.get("/chapters/{chapter_id}/questions", response_model=List[schemas.QuestionResponse])
def get_questions(chapter_id: int, db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    return db.query(models.Question).filter(models.Question.chapter_id == chapter_id).all()

@router.put("/questions/{question_id}", response_model=schemas.QuestionResponse)
def update_question(question_id: int, question_update: schemas.QuestionUpdate, db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    update_data = question_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(question, key, value)
        
    db.commit()
    db.refresh(question)
    return question

@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db), current_admin: models.Admin = Depends(auth.get_current_admin)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    db.delete(question)
    db.commit()
    return {"message": "Question deleted successfully"}

