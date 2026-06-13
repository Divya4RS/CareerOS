from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class CoverLetterRequest(BaseModel):
    role: str

@router.post("/cover-letter")
def generate_cover_letter(
    data: CoverLetterRequest
):

    letter = f"""
Dear Hiring Manager,

I am excited to apply for the {data.role} position.

My background includes Python,
Machine Learning, SQL, and software development.

I am eager to contribute my skills
and continue learning while delivering
high-quality solutions.

Thank you for your consideration.

Sincerely,
Candidate
"""

    return {
        "cover_letter": letter
    }