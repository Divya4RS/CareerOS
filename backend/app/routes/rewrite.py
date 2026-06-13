from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RewriteRequest(BaseModel):
    text: str


@router.post("/rewrite")
def rewrite_resume(data: RewriteRequest):

    rewritten = f"""
AI Engineering student with strong interest in Artificial Intelligence,
Machine Learning and Software Development.

Original Summary:
{data.text[:300]}
"""

    return {
        "rewritten_text": rewritten
}