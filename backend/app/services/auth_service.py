import firebase_admin
from firebase_admin import auth
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    Middleware de autenticação: verifica o Bearer token do Firebase.
    Retorna o payload decodificado com uid, email, name.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email", ""),
            "name": decoded_token.get("name", ""),
        }
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expirado. Faça login novamente.")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Token inválido.")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Erro de autenticação: {str(e)}")
