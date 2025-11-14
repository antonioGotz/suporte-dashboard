@echo off
REM Script de deploy (Windows cmd.exe). Execute na raiz do projeto.

REM 1) Build frontend
cd frontend
npm ci
npm run build
cd ..

REM 2) Copiar build para backend-laravel/public (robocopy espelha)
robocopy frontend\dist backend-laravel\public /MIR /NFL /NDL /NP /MT:8





necho "Script Windows finalizado."echo cd backend-laravel && echo docker compose -f docker-compose.prod.yml down -v && echo docker compose -f docker-compose.prod.yml build --no-cache && echo docker compose -f docker-compose.prod.yml up -d --remove-orphansecho "No Windows, execute a parte de docker-compose no servidor Linux. Comandos:"nREM 3) Subir containers (no servidor Linux execute os comandos Linux; aqui apenas exibimos instruções)