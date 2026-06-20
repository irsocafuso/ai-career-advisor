import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# Inicializa o Firebase Admin SDK (singleton)
if not firebase_admin._apps:
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "./firebase-adminsdk.json")
    if os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
    else:
        print(f"\n[AVISO CRITICO] Arquivo de credenciais não encontrado: {service_account_path}")
        print("Por favor, baixe a chave privada no Firebase Console (Configurações > Contas de serviço) e salve-a na pasta 'backend' como 'firebase-adminsdk.json'.")
        print("Tentando inicializar com credenciais padrão do ambiente...\n")
        try:
            firebase_admin.initialize_app()
        except ValueError as e:
            print(f"[ERRO] Não foi possível inicializar o Firebase: {e}\n")

try:
    db = firestore.client()
except Exception as e:
    print(f"[ERRO CRÍTICO] Falha ao conectar ao Firestore. Verifique suas credenciais: {e}\n")
    db = None


def save_career_profile(user_id: str, sections: dict) -> str:
    """Salva o perfil do usuário no Firestore e retorna o profileId."""
    full_text = " | ".join(
        f"{k}: {v}" for k, v in sections.items() if v
    )

    profile_ref = db.collection("career_profiles").document()
    profile_ref.set({
        "userId": user_id,
        "sections": sections,
        "fullText": full_text,
        "language": "pt-BR",
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    })
    return profile_ref.id


def save_career_report(user_id: str, profile_id: str, report_data: dict, model_used: str) -> str:
    """Salva o relatório gerado pelo Gemini no Firestore e retorna o reportId."""
    report_ref = db.collection("career_reports").document()
    report_ref.set({
        "userId": user_id,
        "profileId": profile_id,
        "status": "completed",
        "summary": report_data.get("summary", ""),
        "extractedData": report_data.get("extractedData", {}),
        "careers": report_data.get("careers", []),
        "promptVersion": "v1",
        "modelUsed": model_used,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    })
    return report_ref.id


def get_user_reports(user_id: str) -> list:
    """Retorna todos os relatórios de um usuário, ordenados por data."""
    reports = (
        db.collection("career_reports")
        .where("userId", "==", user_id)
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .stream()
    )
    result = []
    for doc in reports:
        data = doc.to_dict()
        data["id"] = doc.id
        # Converte Timestamp para ISO string
        if "createdAt" in data and hasattr(data["createdAt"], "isoformat"):
            data["createdAt"] = data["createdAt"].isoformat()
        if "updatedAt" in data and hasattr(data["updatedAt"], "isoformat"):
            data["updatedAt"] = data["updatedAt"].isoformat()
        result.append(data)
    return result


def get_report_by_id(report_id: str, user_id: str) -> dict | None:
    """Retorna um relatório específico, verificando que pertence ao usuário."""
    doc = db.collection("career_reports").document(report_id).get()
    if not doc.exists:
        return None
    data = doc.to_dict()
    if data.get("userId") != user_id:
        return None
    data["id"] = doc.id
    if "createdAt" in data and hasattr(data["createdAt"], "isoformat"):
        data["createdAt"] = data["createdAt"].isoformat()
    if "updatedAt" in data and hasattr(data["updatedAt"], "isoformat"):
        data["updatedAt"] = data["updatedAt"].isoformat()
    return data


def get_user_profiles(user_id: str) -> list:
    """Retorna todos os perfis de um usuário."""
    profiles = (
        db.collection("career_profiles")
        .where("userId", "==", user_id)
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .stream()
    )
    result = []
    for doc in profiles:
        data = doc.to_dict()
        data["id"] = doc.id
        if "createdAt" in data and hasattr(data["createdAt"], "isoformat"):
            data["createdAt"] = data["createdAt"].isoformat()
        result.append(data)
    return result


def ensure_user_exists(user_id: str, email: str, display_name: str):
    """Cria ou atualiza o documento do usuário no Firestore."""
    from datetime import datetime, timezone
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()
    if not user_doc.exists:
        user_ref.set({
            "email": email,
            "displayName": display_name,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc),
        })
    else:
        user_ref.update({"updatedAt": datetime.now(timezone.utc)})
