<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Rotas Web Específicas
|--------------------------------------------------------------------------
|
| Rotas tratadas pelo Laravel ANTES de entregar ao React.
|
*/

// 1. Rota pública do Sanctum para o SPA obter o cookie CSRF
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// 2. Pré-visualização de etiqueta (Protegida para admin)
Route::middleware(['auth:sanctum', 'can:admin', 'throttle:api'])->get('/labels/preview', function (Request $request) {
  $tracking = (string) $request->query('tracking', 'TRK-EXEMPLO');
  $name = (string) $request->query('name', 'Destinatário Exemplo');
  $zip = (string) $request->query('zip', '00000-000');
  $street = (string) $request->query('street', 'Rua Exemplo');
  $number = (string) $request->query('number', 'S/N');
  $city = (string) $request->query('city', 'Cidade');
  $state = (string) $request->query('state', 'UF');
  $addressLine = (string) $request->query('address_line', '');
  $appName = config('app.name', 'App');
  $now = now()->format('d/m/Y H:i');
  $html = <<<HTML
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Etiqueta {$tracking}</title>
<style>
body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 24px; color: #0f172a; }
.label { border: 2px dashed #334155; padding: 20px; border-radius: 8px; max-width: 520px; }
.h { margin: 0 0 8px; font-size: 20px; }
.meta { color: #475569; margin: 0 0 16px; font-size: 12px; }
.tracking { font-size: 28px; font-weight: 800; letter-spacing: .08em; }
.dest { margin-top: 10px; font-size: 14px; }
.addr { margin-top: 4px; white-space: pre-line; }
.hint { margin-top: 16px; color: #64748b; font-size: 12px; }
.print { margin-top: 16px; }
button { background: #111827; color: #e5e7eb; border: 1px solid #374151; border-radius: 6px; padding: 8px 12px; cursor: pointer; }
@media print { .print { display: none; } body { margin: 0; } .label { border: none; } }
</style>
<script>window.addEventListener('load',() => { /* window.print(); */ });</script>
</head>
<body>
<div class="label">
<h1 class="h">{$appName} — Etiqueta de Envio</h1>
<p class="meta">Gerada em {$now}</p>
<div class="tracking">{$tracking}</div>
<div class="dest"><strong>Destinatário:</strong> {$name}</div>
<div class="addr">
" . ($addressLine !== ''
    ? htmlspecialchars($addressLine, ENT_QUOTES, 'UTF-8') . "\nCEP: {$zip}"
    : "{$street}, {$number}\n{$city} - {$state}\nCEP: {$zip}") . "
</div>
<p class="hint">Pré-visualização (fake). Configure o provedor real para gerar PDF.</p>
<div class="print"><button onclick="window.print()">Imprimir</button></div>
</div>
</body>
</html>
HTML;
  return response($html)->header('Content-Type', 'text/html; charset=utf-8');
})->name('labels.preview');


// 3. Rota Secreta de Deploy (com correção de permissões)
Route::get('/run-deploy/{token}', function ($token) {
  if ($token !== env('DEPLOY_SECRET_TOKEN')) {
    abort(403, 'Acesso negado.');
  }

  Artisan::call('down'); // Modo de manutenção
  try {
    // --- CORREÇÃO DE PERMISSÕES ---
    $storagePath = realpath(storage_path());
    $bootstrapCachePath = realpath(base_path('bootstrap/cache'));

    // Define permissões 775 (dono e grupo podem ler/escrever/executar)
    if ($storagePath) {
      system("chmod -R 775 $storagePath");
    }
    if ($bootstrapCachePath) {
      system("chmod -R 775 $bootstrapCachePath");
    }
    // Garante que o link simbólico esteja correto
    Artisan::call('storage:link');
    // ------------------------------

    // Limpa caches antigos
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');

    // Roda as migrações do banco
    Artisan::call('migrate', ['--force' => true]);

    // Cria novos caches otimizados
    Artisan::call('config:cache');
    Artisan::call('route:cache');
    Artisan::call('view:cache');

    Artisan::call('up'); // Tira do modo de manutenção
    return 'Deploy finalizado com sucesso (e permissões corrigidas)!';
  } catch (\Exception $e) {
    Artisan::call('up'); // Tira do modo de manutenção em caso de erro
    return response($e->getMessage(), 500);
  }
});


/*
|--------------------------------------------------------------------------
| Rota "Catch-All" do SPA (React)
|--------------------------------------------------------------------------
|
| Esta DEVE SER a última rota do arquivo.
| Captura todas as URLs de navegação (ex: /login, /dashboard)
| e ignora os arquivos (ex: .js, .css) e rotas de API.
|
*/
Route::get('/{any?}', function () {
  // Retorna o 'index.html' que copiamos para a pasta 'public'
  return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api|sanctum)[^.]*$'); // Ignora 'api/', 'sanctum/' e arquivos com '.'