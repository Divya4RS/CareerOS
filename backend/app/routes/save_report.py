from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from app.database import SessionLocal

router = APIRouter()


class SaveReportRequest(BaseModel):
    filename: str
    ats_score: int
    user_email: str


@router.post("/save-report")
def save_report(data: SaveReportRequest):

    db = SessionLocal()

    db.execute(
        text(
            """
            INSERT INTO resumes
            (filename, ats_score, user_email)
            VALUES
            (:filename, :ats_score, :user_email)
            """
        ),
        {
            "filename": data.filename,
            "ats_score": data.ats_score,
            "user_email": data.user_email
        }
    )

    db.commit()
    db.close()

    return {
        "message": "Report Saved"
    }