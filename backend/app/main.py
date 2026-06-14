from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models.user import Base as UserBase
from app.models.resume import Base as ResumeBase

from app.routes.upload import router as upload_router
from app.routes.ats import router as ats_router
from app.routes.rewrite import router as rewrite_router
from app.routes.interview import router as interview_router
from app.routes.cover_letter import router as cover_letter_router
from app.routes.auth import router as auth_router
from app.routes.history import router as history_router
from app.routes.save_report import router as save_report_router
from app.routes.stats import router as stats_router
from app.routes.job_matcher import router as job_match_router
from app.routes.roadmap import router as roadmap_router

app = FastAPI(
    title="CareerOS API",
    version="1.0.0"
)

# Create database tables automatically
UserBase.metadata.create_all(bind=engine)
ResumeBase.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(upload_router)
app.include_router(ats_router)
app.include_router(rewrite_router)
app.include_router(interview_router)
app.include_router(cover_letter_router)
app.include_router(auth_router)
app.include_router(history_router)
app.include_router(save_report_router)
app.include_router(stats_router)
app.include_router(roadmap_router)
app.include_router(job_match_router)

# Home Route
@app.get("/")
def home():
    return {
        "message": "CareerOS Backend Running"
    }

# Health Check
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }