#!/usr/bin/env bash
set -euo pipefail

# Script de deploy (Linux) — execute a partir de raiz do projeto
# Atenção: este script NÃO executa migrations automaticamente.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "1) Verificando pré-condições: pastas backend-laravel e frontend"
[ -d backend-laravel ] && [ -d frontend ] || { echo "ERRO: diretórios faltando"; exit 1; }

echo "2) Build do frontend"
cd frontend
npm ci
npm run build
cd ..

echo "3) Copiando build para backend-laravel/public (espelhando)"
rm -rf backend-laravel/public/* || true
cp -r frontend/dist/* backend-laravel/public/

echo "4) Verificando .env.docker"
if ! grep -q "LETSENCRYPT_EMAIL" backend-laravel/.env.docker; then
  echo "ERRO: LETSENCRYPT_EMAIL não definido em backend-laravel/.env.docker"; exit 2
fi

echo "5) Subir containers (docker compose)"
cd backend-laravel
# preferível usar plugin moderno
if docker compose version >/dev/null 2>&1; then
  DC="docker compose -f docker-compose.prod.yml"
elif docker-compose version >/dev/null 2>&1; then
  DC="docker-compose -f docker-compose.prod.yml"
else
  echo "ERRO: docker compose não disponível. Instale o plugin docker-compose-plugin ou docker-compose."; exit 3
fi

$DC down -v || true
$DC build --no-cache
$DC up -d --remove-orphans

sleep 5

echo "Containers ativos:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

echo "6) Obter certificados (certbot webroot) — REQUER LETSENCRYPT_EMAIL válido e DNS apontando para este servidor"
read -p "Deseja executar certbot agora? (s/N) " CH
if [[ "$CH" =~ ^[sS]$ ]]; then
  # usa serviço certbot do compose se existir
  if grep -q "certbot" docker-compose.prod.yml; then
    echo "Executando certbot via docker compose..."
    $DC run --rm certbot certonly --webroot -w /var/www/certbot --agree-tos --no-eff-email --email "$(grep LETSENCRYPT_EMAIL .env.docker | cut -d'=' -f2)" -d suporteatostech.com -d www.suporteatostech.com || true
    echo "Recarregando nginx"
    $DC exec nginx nginx -s reload || true
  else
    echo "Aviso: serviço certbot não encontrado no compose. Use comando docker run certbot/certbot conforme README.";
  fi
else
  echo "Pulei execução do certbot. Execute manualmente quando pronto.";
fi

echo "SCRIPT DE DEPLOY (Linux) FINALIZADO - revisar saídas acima para erros."
