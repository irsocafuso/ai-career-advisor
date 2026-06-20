Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Iniciando o AI Career Advisor..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Inicia o Backend em uma nova janela
Write-Host "[1/2] Iniciando o servidor Backend (Python/FastAPI)..." -ForegroundColor Green
$backendCmd = @"
cd backend
Write-Host 'Configurando ambiente virtual do Python...' -ForegroundColor Yellow
if (-not (Test-Path venv)) { python -m venv venv }
.\venv\Scripts\activate
Write-Host 'Instalando dependencias (isso pode demorar na primeira vez)...' -ForegroundColor Yellow
pip install -r requirements.txt
Write-Host 'Iniciando a API...' -ForegroundColor Green
python -m uvicorn main:app --reload
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# 2. Inicia o Frontend em uma nova janela
Write-Host "[2/2] Iniciando o servidor Frontend (React/Vite)..." -ForegroundColor Green
$frontendCmd = @"
cd frontend
Write-Host 'Instalando dependencias do Node (isso pode demorar na primeira vez)...' -ForegroundColor Yellow
npm install
Write-Host 'Iniciando o React...' -ForegroundColor Green
npm run dev
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host ""
Write-Host "Tudo pronto! Duas novas janelas foram abertas:" -ForegroundColor Magenta
Write-Host "1. A janela do Backend vai rodar a API no http://localhost:8000" -ForegroundColor White
Write-Host "2. A janela do Frontend vai abrir o React no http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Pode fechar esta janela." -ForegroundColor Gray
