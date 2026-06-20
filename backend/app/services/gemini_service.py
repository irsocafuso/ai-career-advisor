import os
import json
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Instancia o cliente do Groq
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Usaremos um modelo muito inteligente da Groq compatível com JSON mode
MODEL_NAME = "llama-3.3-70b-versatile"
MAX_RETRIES = 3
RETRY_DELAY = 2  # segundos


def analyze_career_profile(prompt: str) -> dict:
    """
    Envia o prompt para a API do Groq e retorna o JSON parseado.
    Realiza até 3 tentativas.
    """
    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Você é um assistente JSON. Responda apenas com JSON válido."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=MODEL_NAME,
                temperature=0.7,
                max_tokens=4096,
                response_format={"type": "json_object"}
            )
            
            raw_text = chat_completion.choices[0].message.content.strip()

            parsed = json.loads(raw_text)

            # Validação mínima da estrutura
            if "summary" not in parsed or "careers" not in parsed:
                raise ValueError("Resposta do Groq com estrutura inválida (faltam chaves)")

            if len(parsed["careers"]) != 5:
                raise ValueError(f"Esperado 5 carreiras, recebido {len(parsed['careers'])}")

            return parsed

        except (json.JSONDecodeError, ValueError) as e:
            last_error = e
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)
                continue
            raise RuntimeError(f"Groq retornou resposta inválida após {MAX_RETRIES} tentativas: {e}")

        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY * attempt)
                continue
            raise RuntimeError(f"Erro ao chamar a API do Groq: {e}")
