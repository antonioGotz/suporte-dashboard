# Manual de Deploy – AEvolua

> Guia oficial para publicar o frontend (Vite/React) e o backend (Laravel) nos subdomínios `central.aevolua.com.br` (SPA) e `apicentral.aevolua.com.br` (API).

## 1. Visão Geral
- Frontend: build Vite/React servida como site estático.
- Backend: API Laravel com Sanctum, autenticação via cookies de sessão.
- Comunicação: SPA consome endpoints `https://apicentral.aevolua.com.br/api/*`.
- Variáveis customizadas: `DEPLOY_SECRET_TOKEN`, `SUBSCRIBER_DEFAULT_PRODUCT_ID`, `SUBSCRIBER_DEFAULT_AMOUNT`, `NOTIFY_SEPARATION_DUE_SOON_HOURS`, `NOTIFY_SEPARATION_OVERDUE_HOURS`.

## 2. Pré-requisitos
1. Acesso ao cPanel/SSH do HostGator para os dois subdomínios.
2. Node 18+ e Yarn instalados localmente.
3. PHP 8.2+ e Composer disponíveis (local ou no servidor).
4. Banco de dados criado com credenciais testadas.
5. Certificados SSL válidos para ambos os domínios.

## 3. Configuração de Ambiente Local
### 3.1 Frontend (`frontend/.env.production`)
- Definir `VITE_API_URL` **com o sufixo `/api`**:
  ```
  VITE_API_URL=https://apicentral.aevolua.com.br/api
  ```
- Incluir outras variáveis `VITE_*` necessárias antes de rodar o build.

### 3.2 Backend (`backend-laravel/.env` – produção)
- Copiar os valores padrão do Laravel (APP_*, DB_*, MAIL_*, QUEUE_* etc.).
- Garantir os itens abaixo:
  ```
  APP_ENV=production
  APP_DEBUG=false
  APP_URL=https://apicentral.aevolua.com.br
  FRONTEND_URL=https://central.aevolua.com.br
  SESSION_DOMAIN=.aevolua.com.br
  SESSION_SECURE_COOKIE=true
  SESSION_SAME_SITE=lax
  SANCTUM_STATEFUL_DOMAINS=central.aevolua.com.br
  DEPLOY_SECRET_TOKEN=valor-seguro
  SUBSCRIBER_DEFAULT_PRODUCT_ID=...
  SUBSCRIBER_DEFAULT_AMOUNT=...
  NOTIFY_SEPARATION_DUE_SOON_HOURS=24
  NOTIFY_SEPARATION_OVERDUE_HOURS=48
  ```
- Ajustar `SUBSCRIBER_*` e notificações segundo as regras de negócio.
- Proteger o token de deploy (`DEPLOY_SECRET_TOKEN`).

## 4. Build e Upload do Frontend
1. `cd frontend`
2. `yarn install`
3. `yarn build`
4. Validar a pasta `dist/` (opcional: `yarn preview`).
5. Enviar o conteúdo de `dist/` para o diretório do subdomínio `central.aevolua.com.br` (ex.: `public_html/central/`).
6. Limpar cache do navegador e confirmar carregamento da home.

## 5. Preparação do Backend
1. `cd backend-laravel`
2. `composer install --no-dev --optimize-autoloader`
3. (Opcional) `php artisan config:cache`, `route:cache`, `view:cache` **apenas após copiar o `.env` definitivo**.
4. Compactar e enviar todo o projeto (incluindo `vendor/`) para o subdomínio `apicentral.aevolua.com.br` ou usar deploy automático/rsync.

### 5.1 Estrutura esperada no servidor
```
apicentral.aevolua.com.br/
  app/
  bootstrap/
  config/
  database/
  public/
  resources/
  routes/
  storage/
  vendor/
  artisan
  .env
```

## 6. Ajustes pós-upload no cPanel
1. Definir o document root do subdomínio `apicentral.aevolua.com.br` para a pasta `public` do Laravel.
2. Confirmar permissões de escrita (775/755) em `storage/` e `bootstrap/cache/`.
3. Criar ou editar o `.env` de produção no servidor.
4. Executar `php artisan key:generate --force`.
5. Executar `php artisan migrate --force`.
6. Rodar caches: `php artisan config:cache`, `route:cache`, `view:cache`.
7. Criar o link simbólico: `php artisan storage:link` (ou chamar `/run-deploy/{token}`).

### 6.1 .htaccess do Frontend
- Criar `central.aevolua.com.br/.htaccess` para o fallback do SPA:
  ```
  <IfModule mod_rewrite.c>
    Options -MultiViews
    RewriteEngine On
    RewriteBase /

    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d

    RewriteRule . /index.html [L]
  </IfModule>
  ```

## 7. Configurações Específicas
### 7.1 CORS (`config/cors.php`)
- Paths permitidos: `['api/*', 'sanctum/csrf-cookie']`.
- `supports_credentials` deve permanecer `true`.
- Adicionar `https://central.aevolua.com.br` em `allowed_origins` (junto aos hosts locais de desenvolvimento).

### 7.2 Sanctum e sessão
- `SANCTUM_STATEFUL_DOMAINS=central.aevolua.com.br` (sem protocolo).
- `SESSION_DOMAIN=.aevolua.com.br` para compartilhar cookies entre subdomínios.
- Certificar-se de que o site usa HTTPS (cookies `secure`).

### 7.3 Rota de Deploy
- `routes/web.php` contém `/run-deploy/{token}` que executa permissões, clear/cache, migrates e storage:link.
- Chamar via HTTPS: `https://apicentral.aevolua.com.br/run-deploy/<DEPLOY_SECRET_TOKEN>`.

## 8. Validações Finais
1. Acessar `https://central.aevolua.com.br/login` e efetuar login.
2. Confirmar via DevTools que as requisições vão para `https://apicentral.aevolua.com.br/api/*`.
3. Verificar cookies `XSRF-TOKEN` e sessão presentes.
4. Checar `https://apicentral.aevolua.com.br/api/health` e garantir resposta `{"app":"ok","db":"ok"}`.
5. Exercitar os fluxos principais (dashboard, CRUDs, uploads, geração de etiquetas).
6. Analisar `storage/logs/laravel.log` em busca de erros.

## 9. Troubleshooting Rápido
- Erro de conexão no login: revisar `VITE_API_URL` (precisa de `/api`) e CORS.
- 401 após login: validar `SESSION_DOMAIN`, `SANCTUM_STATEFUL_DOMAINS` e HTTPS.
- Erro 500 ao migrar: conferir permissões de pasta e credenciais do banco.
- SPA exibindo 404 em rotas internas: garantir `.htaccess` do frontend.
- Uploads falhando: checar permissões de `storage/app/public` e link simbólico.

## 10. Atualizações Futuras
1. Repetir as seções 3 a 8 para cada nova versão.
2. Refazer `yarn build` sempre que qualquer `VITE_*` mudar.
3. Avaliar automação (GitHub Actions, script de deploy) utilizando o endpoint `/run-deploy/{token}`.

## 11. Checklist Final
- Banco de dados configurado (`DB_*`) e testado.
- Variáveis de Sanctum e sessão (`SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, `SESSION_SECURE_COOKIE`, `SESSION_SAME_SITE`).
- Políticas/Gates revisadas (perfis admin possuem `can:admin`).
- Prefixo `/api` ativo no backend e `VITE_API_URL` apontando para ele.
- `.env.production` atualizado e build do SPA recompilado.
- `.htaccess` presente no subdomínio do frontend.
- Variáveis customizadas (`DEPLOY_SECRET_TOKEN`, `SUBSCRIBER_DEFAULT_PRODUCT_ID`, `SUBSCRIBER_DEFAULT_AMOUNT`, `NOTIFY_*`) definidas.

---
Documentação mantida em `docs/oficiais/MANUAL_DEPLOY.md`. Atualize este arquivo sempre que o processo sofrer mudanças.
