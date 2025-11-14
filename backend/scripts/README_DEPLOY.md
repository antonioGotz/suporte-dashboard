# Instruções de Deploy Automatizado (Resumo)

Arquivos criados:
- `scripts/deploy_linux.sh` — script bash para executar build do frontend, copiar arquivos para `public`, subir containers e opcionalmente executar certbot (webroot). Execute no servidor Linux.
- `scripts/deploy_windows.cmd` — script para Windows (cmd.exe): build do frontend e cópia usando `robocopy`. A parte de docker/docker-compose deve ser executada no servidor Linux.

Pré-requisitos que você deve confirmar ANTES de rodar qualquer script:
1. DNS: `A record` de `suporteatostech.com` e `www.suporteatostech.com` apontando para o IP público da VPS.
2. Portas: 80 e 443 liberadas no firewall do servidor.
3. `LETSENCRYPT_EMAIL` atualizado em `backend-laravel/.env.docker` com um e-mail real.
4. Fazer backup do banco e diretórios importantes (não automatizamos backup neste script).
5. Ter Docker + Docker Compose (plugin) instalados no servidor.

O que os scripts NÃO fazem automaticamente (por segurança):
- `php artisan migrate --force` não é executado; faça manualmente após confirmar backups.
- Não alteram o `.env.docker` (exceto leitura) — ajuste manualmente valores sensíveis.

Comandos principais (Linux):
```
# a partir da raiz do projeto
cd backend-laravel
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d --remove-orphans
```

Comandos certbot (exemplo):
```
# usando docker run
docker run --rm -it \
  -v certbot-etc:/etc/letsencrypt \
  -v certbot-var:/var/www/certbot \
  certbot/certbot certonly --webroot --webroot-path /var/www/certbot \
  --agree-tos --no-eff-email --email "seu-email@exemplo.com" -d suporteatostech.com -d www.suporteatostech.com
```

Se preferir, posso tentar executar os passos no seu ambiente — mas preciso de acesso ao host onde Docker e Node estão instalados. Caso queira que eu apenas gere os logs automaticamente após você rodar os scripts, me diga que eu forneço os comandos de coleta de logs e o formato final do relatório.
