from fastapi import FastAPI

from app.routes.analyze import router as analyze_router
from app.routes.verify import router as verify_router


app = FastAPI(
    title="SkillGuard AI",
    description="AI-powered code review and skill verification backend",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "SkillGuard AI Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(analyze_router)
app.include_router(verify_router)