import os
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-1.5-flash"
MAX_RETRIES = 3
RETRY_DELAY = 2  # segundos


def analyze_career_profile(prompt: str) -> dict:
    """
    Envia o prompt ao Gemini e retorna o JSON parseado.
    Realiza até 3 tentativas com backoff exponencial.
    """
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=4096,
            response_mime_type="application/json",
        ),
    )

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = model.generate_content(prompt)
            raw_text = response.text.strip()

            # Remove possíveis blocos de markdown caso existam
            if raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1]
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]

            parsed = json.loads(raw_text)

            # Validação mínima da estrutura
            if "summary" not in parsed or "careers" not in parsed:
                raise ValueError("Resposta do Gemini com estrutura inválida")

            if len(parsed["careers"]) != 5:
                raise ValueError(f"Esperado 5 carreiras, recebido {len(parsed['careers'])}")

            return parsed

        except (json.JSONDecodeError, ValueError) as e:
            last_error = e
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)
                continue
            raise RuntimeError(f"Gemini retornou resposta inválida após {MAX_RETRIES} tentativas: {e}")

        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)
                continue
            raise RuntimeError(f"Erro ao chamar a API do Gemini: {e}")
