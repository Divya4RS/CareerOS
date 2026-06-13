from app.database import engine
from app.models.resume import Base as ResumeBase
from app.models.user import Base as UserBase

ResumeBase.metadata.create_all(bind=engine)
UserBase.metadata.create_all(bind=engine)

print("Tables Created")