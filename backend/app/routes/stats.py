from fastapi import APIRouter
from sqlalchemy import text
from app.database import SessionLocal

router = APIRouter()

@router.get("/stats")
def stats():
    db = SessionLocal()

    total = db.execute(
        text("SELECT COUNT(*) FROM resumes")
    ).scalar()

    highest = db.execute(
        text("SELECT MAX(ats_score) FROM resumes")
    ).scalar()

    average = db.execute(
        text("SELECT AVG(ats_score) FROM resumes")
    ).scalar()

    db.close()

    return {
        "total_uploads": total,
        "highest_score": highest or 0,
        "average_score": round(float(average or 0), 2)
    }