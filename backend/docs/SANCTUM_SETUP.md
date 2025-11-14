# Configuração rápida do Sanctum (SPA) — guia seguro

Este arquivo descreve passos seguros para garantir que o SPA (Vite / localhost:5173) autentique com o backend Laravel usando Sanctum via cookies.

Resumo das ações já aplicadas neste projeto
- `config/cors.php` foi atualizado para incluir `127.0.0.1:5173`/`5174` nas origens permitidas.
- `.env` recebeu ajustes para desenvolvimento local: variáveis `SESSION_SECURE_COOKIE=false`, `SESSION_SAME_SITE=lax` e `SESSION_DOMAIN` vazio (para evitar mismatch local).

Passos recomendados e comandos

1) Reiniciar servidores e limpar cache de configuração

No diretório `backend-laravel`, rode (PowerShell):

```powershell
cd 'c:\projeto programação\aevolua\meu-projeto\backend-laravel'
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan config:cache
```

2) Fluxo de autenticação no SPA (ordem correta)

- Primeiro obtenha o cookie CSRF do Sanctum:

```js
// fetch (frontend) - deve usar credentials: 'include'
await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
```
 Se ainda não funcionar
 Verifique se o domínio do cookie (Set-Cookie Domain) corresponde ao domínio que o browser utiliza para as requisições. Por exemplo, se o cookie for criado para um domínio diferente (ex.: `.paineladmaevolua.test`) enquanto você acessa via `localhost`, o browser não enviará o cookie. Para testes locais prefira usar `http://localhost:8000` ou o proxy do Vite.

- Em seguida faça POST para `/login` (ou rota de autenticação), enviando credenciais e `credentials: 'include'`.

Invoke-WebRequest -Uri 'http://localhost:8000/sanctum/csrf-cookie' -WebSession $session -UseBasicParsing
Invoke-RestMethod -Uri 'http://localhost:8000/login' -Method Post -WebSession $session -ContentType 'application/json' -Body (ConvertTo-Json @{ email='teste@exemplo.com'; password='senha' })
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/users/search?q=ana' -WebSession $session

3) Debug no navegador

- Abra DevTools → Network e verifique:
  - Requisição a `sanctum/csrf-cookie` retorna 204/200 e set-cookie aparece.
  - Requisição de login retorna 200 e cookie de sessão aparece (ou domínio/atributos apareçam corretos).
  - Requisições subsequentes a `/api/*` incluem cookies e retornam 200.

4) Recomendações de produção (respeitar segurança)

- Para produção em HTTPS, ajuste `.env`:
  - `SESSION_SECURE_COOKIE=true`
  - `SESSION_SAME_SITE=none`
  - `SESSION_DOMAIN=.seudominio.com`
  - `SANCTUM_STATEFUL_DOMAINS=seudominio.com,app.seudominio.com`

- Garanta `config/cors.php` permite o origin do seu SPA em produção e `supports_credentials => true`.

5) Se ainda não funcionar

- Verifique se o domínio do cookie (Set-Cookie Domain) corresponde ao domínio que o browser utiliza para as requisições. Por exemplo, se o cookie for criado para um domínio diferente (ex.: `.paineladmaevolua.test`) enquanto você acessa via `localhost`, o browser não enviará o cookie. Para testes locais prefira usar `http://localhost:8000` ou o proxy do Vite.
- Como alternativa para testes locais, use o proxy do Vite (já configurado em `frontend/vite.config.proxy.js`) e faça requisições relativas a `/api/...` — o cookie ainda precisa ser válido para o domínio da API.

Exemplos concretos (PowerShell / Fetch) — sequência completa (substitua credenciais):

PowerShell (testar sem browser):

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
Invoke-WebRequest -Uri 'http://localhost:8000/sanctum/csrf-cookie' -WebSession $session -UseBasicParsing
Invoke-RestMethod -Uri 'http://localhost:8000/login' -Method Post -WebSession $session -ContentType 'application/json' -Body (ConvertTo-Json @{ email='teste@exemplo.com'; password='senha' })
Invoke-RestMethod -Uri 'http://localhost:8000/api/admin/users/search?q=ana' -WebSession $session
```

Fetch (browser console):

```js
// 1) CSRF cookie
await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

// 2) login (ajuste payload)
await fetch('/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ email: 'seu@exemplo.com', password: 'senha' })
});

// 3) chamada protegida
await fetch('/api/admin/users/search?q=ana', { credentials: 'include', headers: { 'Accept': 'application/json' } })
  .then(r => r.json()).then(console.log).catch(console.error);
```

Se quiser, eu aplico uma rota pública temporária `/api/public/users/search` para testes sem auth (não recomendado em produção). Ou posso caminhar com você passo-a-passo no seu ambiente local (teste de requests, ver Network e ajustar variáveis). Diga qual prefere.
