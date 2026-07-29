from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
from typing import List
from datetime import datetime

router = APIRouter(prefix="/student", tags=["student"])

@router.get("/subjects", response_model=List[schemas.SubjectResponse])
def get_my_subjects(db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    return db.query(models.Subject).filter(models.Subject.subject_class == current_student.student_class).all()

@router.get("/subjects/{subject_id}/chapters", response_model=List[schemas.ChapterResponse])
def get_subject_chapters(subject_id: int, db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    # Verify the subject belongs to the student's class
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id, models.Subject.subject_class == current_student.student_class).first()
    if not subject:
        raise HTTPException(status_code=403, detail="Not allowed to access this subject")
        
    return db.query(models.Chapter).filter(models.Chapter.subject_id == subject_id).all()

@router.get("/quiz/{chapter_id}/start", response_model=List[schemas.QuestionResponse])
def start_quiz(chapter_id: int, db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    # Verify chapter belongs to student's class
    chapter = db.query(models.Chapter).join(models.Subject).filter(
        models.Chapter.id == chapter_id, 
        models.Subject.subject_class == current_student.student_class
    ).first()
    
    if not chapter:
        raise HTTPException(status_code=403, detail="Not allowed to access this chapter")
        
    # Fetch random questions (for now just all questions for simplicity, can be randomized later)
    # Using python's random.sample could work, but querying directly is fine for this boilerplate
    import random
    questions = db.query(models.Question).filter(models.Question.chapter_id == chapter_id).all()
    
    if len(questions) > 10:
        questions = random.sample(questions, 10)
    else:
        random.shuffle(questions)
        
    return questions

@router.post("/quiz/submit", response_model=schemas.QuizResultResponse)
def submit_quiz(submission: schemas.QuizSubmission, db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    # Create attempt
    attempt = models.QuizAttempt(
        student_id=current_student.id,
        chapter_id=submission.chapter_id,
        total_questions=len(submission.answers)
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    correct_count = 0
    for ans in submission.answers:
        question = db.query(models.Question).filter(models.Question.id == ans.question_id).first()
        is_correct = False
        if question and question.correct_option == ans.selected_option:
            is_correct = True
            correct_count += 1
            
        attempt_ans = models.AttemptAnswer(
            attempt_id=attempt.id,
            question_id=ans.question_id,
            selected_option=ans.selected_option,
            is_correct=is_correct
        )
        db.add(attempt_ans)
        
    attempt.completed_at = datetime.utcnow()
    attempt.score = correct_count
    db.commit()
    db.refresh(attempt)
    
    return attempt

@router.get("/history", response_model=List[schemas.QuizResultResponse])
def get_history(db: Session = Depends(get_db), current_student: models.Student = Depends(auth.get_current_student)):
    return db.query(models.QuizAttempt).filter(models.QuizAttempt.student_id == current_student.id).order_by(models.QuizAttempt.completed_at.desc()).all()
