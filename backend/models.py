import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
import enum

class DifficultyEnum(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class RoleEnum(str, enum.Enum):
    content_admin = "content_admin"

class Guardian(Base):
    __tablename__ = "guardians"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    students = relationship("Student", back_populates="guardian")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    guardian_id = Column(Integer, ForeignKey("guardians.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    student_class = Column(Integer, nullable=False) # e.g., 6, 7, 8, 9, 10
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    guardian = relationship("Guardian", back_populates="students")
    quiz_attempts = relationship("QuizAttempt", back_populates="student")

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.content_admin)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    questions_created = relationship("Question", back_populates="creator")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subject_class = Column(Integer, nullable=False)

    chapters = relationship("Chapter", back_populates="subject")

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    order_index = Column(Integer, default=0)

    subject = relationship("Subject", back_populates="chapters")
    questions = relationship("Question", back_populates="chapter")
    quiz_attempts = relationship("QuizAttempt", back_populates="chapter")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False, index=True)
    question_text = Column(String, nullable=False)
    option_a = Column(String, nullable=False)
    option_b = Column(String, nullable=False)
    option_c = Column(String, nullable=False)
    option_d = Column(String, nullable=False)
    correct_option = Column(String, nullable=False) # e.g. "A", "B", "C", "D"
    difficulty = Column(SQLEnum(DifficultyEnum), default=DifficultyEnum.medium)
    created_by = Column(Integer, ForeignKey("admins.id"), nullable=True)

    chapter = relationship("Chapter", back_populates="questions")
    creator = relationship("Admin", back_populates="questions_created")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False, index=True)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    score = Column(Float, default=0.0)
    total_questions = Column(Integer, default=0)

    student = relationship("Student", back_populates="quiz_attempts")
    chapter = relationship("Chapter", back_populates="quiz_attempts")
    answers = relationship("AttemptAnswer", back_populates="attempt")

class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_option = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)

    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("Question")
