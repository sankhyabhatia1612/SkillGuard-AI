from fastapi import APIRouter

from app.models.request_models import (
    AnalyzeRequest,
    AnalyzeResponse
)

from app.services.llm_service import analyze_code_with_llm


router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_code(request: AnalyzeRequest):

    print("ANALYZE ENDPOINT CALLED")

    result = analyze_code_with_llm(
        code=request.code,
        language=request.language,
        project_context=request.project_context
    )

    print("LLM RESULT:", result)

    return result