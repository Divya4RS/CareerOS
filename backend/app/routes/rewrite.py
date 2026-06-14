from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")

router = APIRouter()

class RewriteRequest(BaseModel):
    text: str

@router.post("/rewrite")
def rewrite_resume(data: RewriteRequest):

    prompt = f"""
You are an expert resume writer.

Rewrite the following resume content:

- Make it ATS friendly
- Improve grammar
- Use strong action verbs
- Keep it professional
- Return only the improved resume text

Resume:
{data.text}
"""

    response = model.generate_content(prompt)

    return {
        "rewritten_text": response.text
    }