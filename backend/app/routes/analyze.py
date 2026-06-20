from fastapi import APIRouter, Depends, HTTPException
from app.models.profile import AnalyzeRequest
from app.services.auth_service import verify_firebase_token
from app.services.gemini_service import analyze_career_profile, MODEL_NAME
from app.services.firebase_service import (
    save_career_profile,
    save_career_report,
    ensure_user_exists,
)
from app.utils.prompt_builder import build_career_prompt

router = APIRouter()


@router.post("/analyze")
async def analyze_profile(
    request: AnalyzeRequest,
    user: dict = Depends(verify_firebase_token),
):
    """
    Recebe o perfil do usuário, analisa via Gemini e salva o relatório no Firestore.
    """
    try:
        # 1. Garante que o usuário existe no Firestore
        ensure_user_exists(
            user_id=user["uid"],
            email=user["email"],
            display_name=user["name"],
        )

        # 2. Salva o perfil
        sections_dict = request.sections.model_dump()
        profile_id = save_career_profile(
            user_id=user["uid"],
            sections=sections_dict,
        )

        # 3. Constrói e envia o prompt ao Gemini
        prompt = build_career_prompt(sections_dict)
        report_data = analyze_career_profile(prompt)

        # 4. Salva o relatório no Firestore
        report_id = save_career_report(
            user_id=user["uid"],
            profile_id=profile_id,
            report_data=report_data,
            model_used=MODEL_NAME,
        )

        return {
            "success": True,
            "reportId": report_id,
            "profileId": profile_id,
            "message": "Análise concluída com sucesso",
        }

    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
