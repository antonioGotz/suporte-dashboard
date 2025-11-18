@echo off
echo ════════════════════════════════════════
echo 🚀 AMBIENTE LOCAL - AEVOLUA
echo ════════════════════════════════════════
echo.
echo Este script vai abrir 2 terminais:
echo 1️⃣ Backend (Laravel) - http://localhost:8000
echo 2️⃣ Frontend (React) - http://localhost:5173
echo.
echo Aguarde...
echo.
echo.
start cmd /k "cd backend && dev-local.bat"
timeout /t 3 > nul
start cmd /k "cd frontend && dev-local.bat"
echo.
echo ✅ Servidores iniciados!
echo.
echo 🌐 Acesse: http://localhost:5173
echo.
pause
