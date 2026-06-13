from fastapi import APIRouter
from sqlalchemy import text

from app.database import SessionLocal

router = APIRouter()


@router.get("/history/{email}")
def history(email: str):

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT *
            FROM resumes
            WHERE user_email = :email
            ORDER BY id DESC
            """
        ),
        {
            "email": email
        }
    )

    rows = result.fetchall()

    db.close()

    return {
        "history": [
            {
                "id": row[0],
                "filename": row[1],
                "ats_score": row[2],
                "user_email": row[3]
            }
            for row in rows
        ]
    }