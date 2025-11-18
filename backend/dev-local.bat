@echo off
echo ════════════════════════════════════════
echo 🚀 INICIANDO SERVIDOR LOCAL
echo ════════════════════════════════════════
echo.
echo ✅ Usando configurações locais (.env.local)
echo ✅ Banco: WAMP (localhost)
echo ✅ Servidor: http://127.0.0.1:8000
echo.
copy /Y .env .env.production.safe > nul 2>&1
copy /Y .env.local .env > nul
php artisan config:clear
echo ✅ Cache limpo
echo.
echo Pressione Ctrl+C para parar o servidor
echo ════════════════════════════════════════
echo.
php artisan serve
copy /Y .env.production.safe .env > nul 2>&1
del .env.production.safe > nul 2>&1
