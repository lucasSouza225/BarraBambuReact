@echo off
echo 🚀 Iniciando Barra Bambu Restaurante...

REM Iniciar backend
start cmd /k "cd backend && npm run dev"

REM Aguardar
timeout /t 3

REM Iniciar frontend
start cmd /k "cd frontend && npm run dev"

REM Aguardar e abrir navegador
timeout /t 5
start http://localhost:5173

echo ✅ Sistema iniciado!
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:5000
pause