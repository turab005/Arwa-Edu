from database import SessionLocal
import models
from auth import get_password_hash

db = SessionLocal()

# 1. Create Default Admin
admin = db.query(models.Admin).filter_by(email="admin@arwaedu.com").first()
if not admin:
    admin = models.Admin(name="System Admin", email="admin@arwaedu.com", password_hash=get_password_hash("admin123"))
    db.add(admin)
    db.commit()
    print("Admin created: admin@arwaedu.com / admin123")

# 2. Create Sample Subject for Class 6
subject = db.query(models.Subject).filter_by(name="General Science", subject_class=6).first()
if not subject:
    subject = models.Subject(name="General Science", subject_class=6)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    print("Subject created: General Science (Class 6)")

# 3. Create Sample Chapter
chapter = db.query(models.Chapter).filter_by(subject_id=subject.id, order_index=1).first()
if not chapter:
    chapter = models.Chapter(subject_id=subject.id, name="Chapter 1: Plants & Ecosystems", order_index=1)
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    print("Chapter created: Chapter 1: Plants & Ecosystems")

# 4. Create Sample Questions
if db.query(models.Question).filter_by(chapter_id=chapter.id).count() == 0:
    q1 = models.Question(
        chapter_id=chapter.id,
        question_text="What process do plants use to make their food?",
        option_a="Respiration",
        option_b="Photosynthesis",
        option_c="Digestion",
        option_d="Transpiration",
        correct_option="B",
        difficulty="easy"
    )
    q2 = models.Question(
        chapter_id=chapter.id,
        question_text="Which gas do plants absorb during photosynthesis?",
        option_a="Oxygen",
        option_b="Nitrogen",
        option_c="Carbon Dioxide",
        option_d="Hydrogen",
        correct_option="C",
        difficulty="easy"
    )
    db.add_all([q1, q2])
    db.commit()
    print("Sample questions created!")

db.close()
