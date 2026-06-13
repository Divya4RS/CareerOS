from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RoadmapRequest(BaseModel):
    missing_skills: list[str]

@router.post("/roadmap")
def roadmap(data: RoadmapRequest):

    roadmap_steps = []

    for skill in data.missing_skills:
        roadmap_steps.append(
            f"Learn {skill}"
        )

    return {
        "roadmap": roadmap_steps
    }