from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class InterviewRequest(BaseModel):
    skills: list[str]

@router.post("/interview")
def generate_questions(data: InterviewRequest):

    questions = []

    for skill in data.skills:
        questions.append(
            f"Explain your experience with {skill}."
        )

        questions.append(
            f"What projects have you built using {skill}?"
        )

    return {
        "questions": questions
    }