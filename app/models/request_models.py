from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    code: str
    language: str
    project_context: str | None = None


class Reference(BaseModel):
    title: str
    url: str


class Issue(BaseModel):
    title: str
    severity: str
    explanation: str
    why_it_matters: str
    skill_to_learn: str
    recommended_improvement: str
    reference: Reference
    verification_question: str


class AnalyzeResponse(BaseModel):
    language: str
    overall_score: int
    summary: str
    skills_demonstrated: list[str]
    skills_to_improve: list[str]
    issues: list[Issue]
class VerifyRequest(BaseModel):
    question: str
    answer: str


class VerifyResponse(BaseModel):
    correct: bool
    score: int
    feedback: str