**Visão Geral**
- Este guia resume como preparar backend (Laravel), banco de dados e frontend (Vite/React) para produção e como resolver divergências de migrações quando o banco vem de dump.

**Pré‑Requisitos**
- PHP e Composer instalados.
- MySQL/MariaDB disponíveis e credenciais válidas.
- Node.js LTS e npm/yarn para build do frontend.

**Configurar Backend (Laravel)**
- Copiar e configurar env:
  - `backend-laravel/.env`
  - Ajuste: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://seu-dominio`.
  - Ajuste DB: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
- Gerar chave de app (primeira vez):
  - `cd backend-laravel`
  - `composer install --no-dev -o`
  - `php artisan key:generate`
- Permissões (necessário para cache/logs):
  - Diretorios graváveis: `backend-laravel/storage`, `backend-laravel/bootstrap/cache`.
  - Windows: garantir que o usuário do serviço do PHP/Apache/IIS tenha escrita.
  - Linux: `chown -R www-data:www-data storage bootstrap/cache && chmod -R ug+rw storage bootstrap/cache`.

**Banco de Dados**
- Se o banco for criado via dump (tabelas já existem):
  - Restaure o dump no banco de destino (ex.: `local_aevolua`).
  - Rode o healthcheck: `GET /api/health` para validar conexão.
- Se usar migrations “do zero” (sem dump):
  - `php artisan migrate --force`.
- Tabela de tokens (Sanctum):
  - Garante `personal_access_tokens` existente (migration padrão já “Ran”).

**Normalizar Migrações (Drift por Dump)**
- Objetivo: marcar como “executadas” migrations cujas tabelas/colunas já existem, evitando conflitos.
- Dry‑run:
  - `php artisan schema:sync`
- Aplicar marcação segura:
  - `php artisan schema:sync --apply`
- Observações:
  - O comando só marca migrations reconhecidas e com schema presente.
  - Para `orders.label_status`, se for usar a feature de etiquetas/histórico, crie a coluna:
    - `php artisan orders:add-label-status`
    - Depois: `php artisan schema:sync --apply`

**Criar Tabelas Faltantes (Exemplo: notifications)**
- Se aparecer erro 500 com `notifications` ausente:
  - Criar a tabela via migration específica ou SQL (seguro e aditivo).
  - Migration única (se existir o arquivo):
    - `php artisan migrate --path=database/migrations/2025_10_11_000000_create_notifications_table.php --force`
  - Alternativa SQL (MySQL/MariaDB): criar `notifications` com colunas: `id, user_id, type, title, body, data (json), read_at, created_at, updated_at`.

**Subir Backend**
- Produção (exemplos):
  - Apache/Nginx apontando para `backend-laravel/public`.
  - PHP‑FPM ou mod_php conforme o ambiente.
- Healthcheck:
  - `GET https://seu-dominio/api/health` deve responder `{ app: ok, db: ok }`.

**Configurar Frontend (Vite/React)**
- Defina a base da API em produção:
  - `frontend/.env.production`
  - Exemplo: `VITE_API_URL=https://api.seu-dominio/api`
- Build de produção:
  - `cd frontend`
  - `npm ci` ou `yarn install --frozen-lockfile`
  - `npm run build` ou `yarn build`
  - Saída em: `frontend/dist`
- Publicação do frontend:
  - Sirva `frontend/dist` como estático (Nginx/Apache/S3/CloudFront etc.).

**Ambiente de Desenvolvimento (Local)**
- Proxy do Vite para backend local já configurado em `frontend/vite.config.js` (`/api` -> `http://localhost:8000`).
- Iniciar backend local:
  - `cd backend-laravel && php artisan serve --host=localhost --port=8000`
- Iniciar frontend local:
  - `cd frontend && npm run dev`

**Credenciais/Admin**
- Usuário admin deve ter `adm=1` na tabela `users` e senha em hash (bcrypt).
- Verificar/ajustar via Tinker (exemplo):
  - `php artisan tinker`
  - `App\Models\User::updateOrCreate(['email'=>'aevoluateste@aevolua.com'], ['name'=>'admin Teste','password'=>bcrypt('evolua123'),'adm'=>1]);`

**Verificação e Logs**
- Healthcheck: `GET /api/health`.
- Logs do Laravel: `backend-laravel/storage/logs/laravel.log`.
- Para acompanhar em tempo real (Windows/PowerShell):
  - `Get-Content backend-laravel/storage/logs/laravel.log -Wait`

**Resolução de Problemas**
- 500 ao logar por cache/manifest:
  - Verifique existência/permissão de `backend-laravel/bootstrap/cache`.
  - `php artisan optimize:clear`.
- 500 por tabela ausente (ex.: `notifications`):
  - Criar a tabela (migration específica ou SQL) e re‑tentar.
- `php artisan migrate` falha por “table exists” com dump:
  - Use `php artisan schema:sync --apply` para marcar como executadas as migrations já refletidas no schema.
- CORS/Connection refused no dev:
  - Use o proxy do Vite e garanta backend em `http://localhost:8000`.

**Arquivos Relevantes**
- Proxy dev: `frontend/vite.config.js:1`
- Cliente HTTP único: `frontend/src/services/api.ts:1`
- Auth e rotas protegidas: `frontend/src/components/ProtectedRoute.jsx:1`, `frontend/src/context/AuthProvider.jsx:1`
- Healthcheck backend: `backend-laravel/routes/api.php:1`
- Comandos artisan adicionados:
  - `backend-laravel/app/Console/Commands/SchemaSyncCommand.php:1`
  - `backend-laravel/app/Console/Commands/AddLabelStatusColumn.php:1`

