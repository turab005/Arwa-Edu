from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class GuardianCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class GuardianResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    
    class Config:
        from_attributes = True

class StudentCreate(BaseModel):
    name: str
    student_class: int

class StudentResponse(BaseModel):
    id: int
    name: str
    username: str
    student_class: int
    guardian_id: int
    
    class Config:
        from_attributes = True

class StudentCreatedResponse(StudentResponse):
    temp_password: str

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class SubjectCreate(BaseModel):
    name: str
    subject_class: int

class SubjectResponse(BaseModel):
    id: int
    name: str
    subject_class: int

    class Config:
        from_attributes = True

class ChapterCreate(BaseModel):
    name: str
    order_index: Optional[int] = 0

class ChapterResponse(BaseModel):
    id: int
    subject_id: int
    name: str
    order_index: int

    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    difficulty: str

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    correct_option: Optional[str] = None
    difficulty: Optional[str] = None


class QuestionResponse(BaseModel):
    id: int
    chapter_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    difficulty: str
    # Do not expose correct_option directly to students in a real app, but this is the general response.

    class Config:
        from_attributes = True

class AnswerSubmission(BaseModel):
    question_id: int
    selected_option: str

class QuizSubmission(BaseModel):
    chapter_id: int
    answers: List[AnswerSubmission]

class QuizResultResponse(BaseModel):
    attempt_id: int
    score: float
    total_questions: int
    
    class Config:
        from_attributes = True
