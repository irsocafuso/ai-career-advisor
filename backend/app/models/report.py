from pydantic import BaseModel
from typing import List, Optional


class LearningResource(BaseModel):
    title: str
    type: str  # "curso", "livro", "certificação"
    url: Optional[str] = ""


class CareerRecommendation(BaseModel):
    name: str
    description: str
    whyItMatches: str
    confidenceScore: int
    skillsToDevelop: List[str]
    learningPath: List[LearningResource]


class ExtractedData(BaseModel):
    interests: List[str]
    skills: List[str]
    personalityTraits: List[str]
    careerGoals: List[str]
    strengths: List[str]
    weaknesses: List[str]
    missingInfo: List[str]


class CareerReport(BaseModel):
    summary: str
    extractedData: ExtractedData
    careers: List[CareerRecommendation]
