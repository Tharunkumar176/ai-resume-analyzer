from pydantic import BaseModel
from typing import List, Optional

class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = ""

class SkillMatch(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    skill_match_percentage: float

class ScoreBreakdown(BaseModel):
    ats_score: float
    keyword_score: float
    experience_score: float
    education_score: float
    skills_score: float

class ResumeAnalysisResponse(BaseModel):
    overall_score: float
    ats_score: float
    keyword_score: float
    skill_match_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]
    experience_score: float
    suggestions: List[str]
    extracted_keywords: List[str]
    score_breakdown: ScoreBreakdown
