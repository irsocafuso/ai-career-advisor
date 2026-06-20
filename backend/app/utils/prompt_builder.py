import os
import pathlib
from dotenv import load_dotenv

load_dotenv()

PROMPT_VERSION = "v1"
PROMPT_PATH = pathlib.Path(__file__).parent.parent / "prompts" / "career_analysis_v1.txt"


def build_career_prompt(sections: dict) -> str:
    """Monta o prompt completo para análise de carreira."""
    template = PROMPT_PATH.read_text(encoding="utf-8")

    return template.format(
        interests=sections.get("interests") or "Não informado",
        skills=sections.get("skills") or "Não informado",
        personality=sections.get("personality") or "Não informado",
        goals=sections.get("goals") or "Não informado",
        hobbies=sections.get("hobbies") or "Não informado",
        experiences=sections.get("experiences") or "Não informado",
        additionalInfo=sections.get("additionalInfo") or "Não informado",
    )
