import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes.health import router as health_router
from app.routes.analyze import router as analyze_router
from app.routes.reports import router as reports_router

load_dotenv()

app = FastAPI(
    title="AI Career Advisor API",
    description="API para análise de carreira com Gemini AI",
    version="1.0.0",
)

# CORS — permite chamadas do frontend React
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:4173",
        "https://irsocafuso.github.io",  # GitHub Pages
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra as rotas
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(analyze_router, prefix="/api", tags=["analyze"])
app.include_router(reports_router, prefix="/api", tags=["reports"])


@app.get("/")
def root():
    return {"message": "AI Career Advisor API v1.0.0", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
