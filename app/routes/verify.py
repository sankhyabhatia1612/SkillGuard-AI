from fastapi import APIRouter

from app.models.request_models import (
    VerifyRequest,
    VerifyResponse
)

from app.services.llm_service import verify_answer


router = APIRouter()


@router.post("/verify", response_model=VerifyResponse)
def verify_code_answer(request: VerifyRequest):

    result = verify_answer(
        question=request.question,
        answer=request.answer
    )

    return result