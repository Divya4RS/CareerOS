from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class JobMatchRequest(BaseModel):
    skills: list[str]

@router.post("/job-match")
def job_match(data: JobMatchRequest):

    jobs = [
        {
            "title": "AI Engineer",
            "skills": [
                "Python",
                "Machine Learning",
                "SQL",
                "FastAPI",
                "React"
            ]
        },
        {
            "title": "Data Scientist",
            "skills": [
                "Python",
                "Machine Learning",
                "SQL",
                "Pandas"
            ]
        },
        {
            "title": "Backend Developer",
            "skills": [
                "Python",
                "FastAPI",
                "PostgreSQL",
                "REST APIs"
            ]
        }
    ]

    matches = []

    for job in jobs:

        matched = len(
            set(data.skills).intersection(
                set(job["skills"])
            )
        )

        score = int(
            (matched / len(job["skills"])) * 100
        )

        matches.append({
            "title": job["title"],
            "score": score
        })

    matches.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "jobs": matches
    }