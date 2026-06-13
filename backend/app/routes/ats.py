from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ats import analyze_resume

router = APIRouter()

class ATSRequest(BaseModel):
    text: str
    job_description: str

@router.post("/ats")
def ats(data: ATSRequest):

    result = analyze_resume(
        data.text,
        data.job_description
    )

    return result