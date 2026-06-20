from pydantic import BaseModel
from typing import Optional


class ProfileSections(BaseModel):
    interests: str
    skills: str
    personality: str
    goals: str
    hobbies: Optional[str] = ""
    experiences: Optional[str] = ""
    additionalInfo: Optional[str] = ""


class AnalyzeRequest(BaseModel):
    sections: ProfileSections
