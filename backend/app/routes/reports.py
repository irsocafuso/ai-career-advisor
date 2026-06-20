from fastapi import APIRouter, Depends, HTTPException
from app.services.auth_service import verify_firebase_token
from app.services.firebase_service import get_user_reports, get_report_by_id, get_user_profiles

router = APIRouter()


@router.get("/reports")
def list_reports(user: dict = Depends(verify_firebase_token)):
    """Retorna todos os relatórios do usuário autenticado."""
    try:
        reports = get_user_reports(user["uid"])
        return {"success": True, "reports": reports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar relatórios: {str(e)}")


@router.get("/reports/{report_id}")
def get_report(report_id: str, user: dict = Depends(verify_firebase_token)):
    """Retorna um relatório específico do usuário autenticado."""
    try:
        report = get_report_by_id(report_id, user["uid"])
        if not report:
            raise HTTPException(status_code=404, detail="Relatório não encontrado.")
        return {"success": True, "report": report}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar relatório: {str(e)}")


@router.get("/profiles")
def list_profiles(user: dict = Depends(verify_firebase_token)):
    """Retorna todos os perfis do usuário autenticado."""
    try:
        profiles = get_user_profiles(user["uid"])
        return {"success": True, "profiles": profiles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar perfis: {str(e)}")
