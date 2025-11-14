# Módulo de Separações — Documentação Oficial

Este documento descreve, de forma operacional e reconstruível, o módulo de Separações: o que ele faz, como filtra assinaturas ativas, como calcula a próxima remessa, como resolve endereço, como gera etiquetas e como registra/consulta o histórico — incluindo decisões, fluxos, endpoints, estruturas esperadas e pontos de falha comuns.

Última revisão: atual com o código em backend-laravel/ (SeparationController, SubscriberResource, Order, User, rotas) e frontend/ (api.ts, Auth).


## Objetivo do Módulo

- Selecionar assinaturas ativas elegíveis para separação (próximas remessas em janela de tempo definida).
- Calcular a próxima data de envio mensal por assinatura.
- Vincular idade do bebê na data de envio para sugerir o brinquedo apropriado.
- Resolver e validar o endereço de entrega (pedido > fallback perfil do usuário).
- Gerar etiqueta de envio (provider fake) e avançar o fluxo de separação.
- Manter histórico de ações e de etiquetas geradas.


## Conceitos e Entidades

- `Order` (assinatura/pedido)
  - Campos relevantes: `id`, `users_id`, `products_id`, `status` ('active' | 'canceled'), `separation_status` (labels normalizados: `Aguardando Separação`, `Em Separação`, `Pendente de Envio`, `Enviado/Coletado`).
  - Constantes utilitárias e normalização de status de separação em `backend-laravel/app/Models/Order.php`.
- `User` (assinante)
  - Campos de perfil e endereço: `cep`, `address`, `number`, `neighborhood`, `complete`, `city`, `state`, além de `name`, `email`, `phone`, `document`.
  - Relações: `orders()`, `children()`.
- `Child` (filho)
  - Utilizado para calcular idade do bebê na data de envio. A separação usa o filho mais recente com `birth` definido.
- `ActionLog`
  - Registra ações (ex.: `generate_label`, mudanças de `separation_status_*`). Usado para idempotência de etiquetas e listagens de histórico.
- `Product`
  - Usado para identificar o plano e mapear brinquedo pelo método `Product::matchByAge($months)`.


## Fluxo Funcional (História)

Imagine a Maria, assinante do plano Evolua Bebê. Ela assinou no dia 2025-01-10. No cadastro, informou o nascimento do filho (2024-12-05) e seu endereço no perfil.

1) Seleção de pendências: Na tela de separações (kanban/lista), o backend busca `orders.status = active`, cruza com `children.birth` do assinante e calcula a próxima data de remessa (mensal) baseada na data de criação do pedido. Se a próxima remessa cair nos próximos 15 dias, o card da Maria aparece.
2) Brinquedo sugerido: Com a próxima remessa calculada, o sistema calcula a idade do bebê na data de envio e procura via `Product::matchByAge` o brinquedo adequado. Isso aparece no card.
3) Endereço: Ao gerar a etiqueta, o sistema tenta usar `shipping_*` do pedido. Se faltar algo essencial (CEP/rua/número/cidade/UF), ele faz fallback para os campos do perfil da Maria (`User`). Se ainda faltar, bloqueia com erro de validação amigável.
4) Geração da etiqueta: Ao confirmar, o sistema chama o provider fake e gera um `tracking_code` e uma `label_url` de prévia. Se o pedido ainda não foi enviado/coletado, o status de separação avança para `Pendente de Envio` e são registrados logs (`separation_status_*` e `generate_label`).
5) Histórico: A geração de etiquetas fica registrada em `ActionLog`. Você pode listar as últimas etiquetas com filtros de data e busca por assinante.


## Cálculos e Regras Principais

- Janela de seleção: padrão “próximos 15 dias”. Pode ser alterada no controller.
- Próxima remessa mensal: parte da `created_at` do pedido, soma meses completos até a `referenceDate`; se cair no passado, empurra para +1 mês.
- Idade do bebê: diferença em meses entre `children.birth` (filho mais recente do usuário) e a data da próxima remessa. Limite: 0–24 meses.
- Endereço para envio:
  - Preferência: campos `shipping_*` do pedido (se completos)
  - Fallback: perfil do usuário (`User`)
  - Validação obrigatória: `zip` (CEP com 8 dígitos), `street`, `number`, `city`, `state`.
- Idempotência de etiqueta: só considera “já gerada” se existir log `generate_label` posterior ao último reset para "Aguardando Separação"; isso permite re-gerar etiqueta ao reiniciar o fluxo.
- Bloqueio de re-generate: se já gerada e não houve reset e não está no primeiro estágio, retorna 409 com mensagem explicativa.
- Integração de pagamento: o recurso do assinante já contempla `order_status` e `status_label`/`status_code`; `gateway_status` existe no shape, mas vem `null` até haver integração real.


## Endpoints (Admin)

Prefixo: `/api/admin` com middlewares `auth:sanctum`, `throttle:api`, `can:admin`.

- Listagem principal de separações (kanban/lista)
  - `GET /api/admin/separation`
  - Query params comuns: `plan` (ex.: `evolua-petit`|`evolua-bebe`), `date` (`proximos-15-dias`), `per_page`, `page`, `q` (busca unificada por mãe/criança/plano/brinquedo), `order`, `product`, `baby`, `mother`, `recent_actions=1`.
  - Resposta: coleção com atributos calculados `next_shipment_date`, `baby_age_months`, e relações úteis (`user`, `product`, `latest_child`).
  - Implementação: `backend-laravel/app/Http/Controllers/Api/Admin/SeparationController.php::index()`.

- Lista de pendências (variante de janela)
  - `GET /api/admin/separation/pending` (se exposto)
  - Implementação: `SeparationController::pending()`.

- Atualizar status de separação
  - `PUT|PATCH /api/admin/separation/{order}`
  - Implementação: `SeparationController::updateStatus()` (no arquivo, acompanhar normalização de rótulos).

- Gerar etiqueta de envio
  - `POST /api/admin/orders/{order}/shipping/label`
  - Valida status, resolve e valida endereço, chama provider fake, registra logs, avança para `Pendente de Envio` (salvo quando já está `Enviado/Coletado`).
  - Implementação: `SeparationController::generateLabel()`.

- Histórico de etiquetas
  - `GET /api/admin/shipping/labels/recent`
  - Query params: `per_page`, `page`, `start_date`, `end_date`, `q` (nome/email do assinante)
  - Implementação: `SeparationController::labelHistory()`.

- Dados do assinante (perfil admin)
  - `GET /api/admin/subscribers/{id}`
  - Retorno padronizado por `SubscriberResource` com: `status_code`, `status_label`, dados pessoais e de endereço, histórico de `orders` do assinante e `children`.
  - Implementação: `SubscriberController::show()` + `SubscriberResource`.


## Estrutura de Resposta — Exemplos

- Exemplo resumido de item em `/api/admin/separation` (lista/kanban):
  - `id`: número do pedido
  - `users_id`: id do assinante
  - `products_id`: id do plano
  - `user`: `{ id, name, email }`
  - `latest_child`: `{ id, name, birth }` (calculado/associado)
  - `product`: `{ id, name, plan_vindi }`
  - `next_shipment_date`: "YYYY-MM-DD"
  - `baby_age_months`: número inteiro (0–24)

- Exemplo resumido de `POST /api/admin/orders/{order}/shipping/label`:
  - `tracking_code`: string
  - `label_url`: URL de prévia com QS (`tracking,name,zip,street,number,city,state`)

- Exemplo resumido de `/api/admin/shipping/labels/recent`:
  - `data`: lista de logs com `order`, `order.user`, timestamp da última geração, e última data de reset por pedido.

- Exemplo resumido de `GET /api/admin/subscribers/{id}` (via `SubscriberResource`):
  - `order_id`, `user_id`, `plan_id`, `plan_name`, `subscription_date`
  - `status_code`/`status_label` e `order_status`
  - Dados pessoais: `email`, `phone`, `document`
  - Endereço: `address`, `number`, `city`, `state`
  - `orders`: histórico (com `product`)
  - `children`: filhos do usuário


## Validações e Erros Comuns

- Endereço incompleto ao gerar etiqueta: retorna 422 com mensagem indicando o campo faltante.
- CEP inválido: 422 se não possuir 8 dígitos numéricos.
- Etiqueta já gerada (sem reset): 409 com instrução para retornar ao primeiro estágio.
- Pedido já `Enviado/Coletado`: gera etiqueta e loga, porém não altera status.
- Acesso não autorizado: 401/403 conforme falha de autenticação/permits admin.


## Pontos de Extensão (melhorias)

- `gateway_status` real: persistir eventos do gateway no `orders` e retornar no `SubscriberResource`.
- `is_active` no recurso do assinante para contrato claro de ativo/inativo.
- Endpoint para atualizar endereço do usuário (perfil) e clarificar regra de override pedido vs. perfil.
- Filtros adicionais no histórico (transportadora, plano, etc.).


## Reconstrução da Página/Fluxo (Checklist)

Se houver perda de UI ou necessidade de reimplementar telas, siga este roteiro para voltar ao comportamento atual, sem perder dados ou regras:

1) Autenticação/Admin
   - Front usa `localStorage.authToken` e `api.ts` aplica `Authorization: Bearer <token>`.
   - Backend expõe `POST /api/login` e `POST /api/admin/logout` e `GET /api/user` para validar sessão.

2) Listagem de separações (kanban/lista)
   - Consome `GET /api/admin/separation` com filtros opcionais.
   - Exibe cards com: nome da mãe (user.name), plano (product.name), próxima remessa (`next_shipment_date`), idade do bebê (`baby_age_months`) e brinquedo sugerido (client-side opcional ou via nome aproximado vindo de `Product::matchByAge`).

3) Geração de etiqueta
   - Ao solicitar etiqueta, chama `POST /api/admin/orders/{order}/shipping/label`.
   - Tratar respostas 409/422 com mensagens do backend.
   - Mostrar `label_url` e `tracking_code` retornados.

4) Histórico de etiquetas
   - Consome `GET /api/admin/shipping/labels/recent` com paginação e filtros.
   - Exibe lista com assinante, pedido, data/hora.

5) Endereço
   - Para exibição/edição do endereço em perfil, até haver endpoint dedicado, ler via `GET /api/admin/subscribers/{id}` e editar por meios administrativos (ou criar endpoint `PUT /api/admin/users/{id}/address`).

6) Status de separação
   - Atualização via `PUT|PATCH /api/admin/separation/{order}` (se a UI tiver esses botões/etapas).
   - Normalização de rótulos é feita no backend; sempre enviar rótulos/keys compatíveis.

7) Condições de aparecimento
   - Um pedido só aparece se: `Order.status = active`, existe `children.birth` e a `next_shipment_date` cai na janela alvo.
   - Limite de idade do bebê: 0–24 meses na data de envio.


## Referências de Código

- Controller principal: `backend-laravel/app/Http/Controllers/Api/Admin/SeparationController.php`
- Modelo de pedido: `backend-laravel/app/Models/Order.php`
- Perfil/usuário: `backend-laravel/app/Models/User.php`
- Recurso de assinante: `backend-laravel/app/Http/Resources/SubscriberResource.php`
- Rotas: `backend-laravel/routes/api.php`
- Cliente HTTP frontend (axios): `frontend/src/services/api.ts`
- Contexto de autenticação (front): `frontend/src/context/AuthProvider.jsx`


## Notas Operacionais

- Logs (`ActionLog`) são críticos para auditar mudanças e regenerações de etiqueta.
- A coluna `separation_status` aceita valores legados; a normalização em `Order::normalizeSeparationStatus` absorve variações e evita inconsistência visual.
- O provider de frete atual é "fake"; ao integrar um real, preservar a semântica: validar endereço, criar remessa, manter `tracking_code` e registrar logs.


## Backups & Rollback Rápido

- Export das tabelas-chave: `orders`, `users`, `children`, `action_logs`, `products`.
- Em caso de inconsistências de status, rodar script de normalização baseado em `Order::normalizeSeparationStatus`.
- Para reprocessar etiquetas: registrar um `reset` para `Aguardando Separação` e acionar novamente `generate_label`.


## Alterações Recentes (Before/After)

Esta seção registra mudanças incrementais no comportamento do módulo, sem substituir a versão anterior. Use como referência rápida para entender o que mudou e por quê.

1) Separação respeita última ação (cancelado/suspenso) — Listagem
- Antes: a listagem considerava apenas `orders.status = active`. Se a última ação (`ActionLog`) fosse `cancelado`/`suspenso`, mas `orders.status` ainda estivesse `active`, o pedido aparecia.
- Agora: além do filtro por `orders.status = active`, a lista exclui pedidos cuja última ação seja `cancelado` ou `suspenso`.
- Arquivo: `backend-laravel/app/Http/Controllers/Api/Admin/SeparationController.php`
- Motivação: alinhar a experiência da Separação com o Perfil do assinante, que já exibia o status baseado na última ação.

2) Bloqueio extra na geração de etiqueta por última ação
- Antes: gerava etiqueta se `orders.status` fosse `active` e o endereço fosse válido.
- Agora: continua exigindo `orders.status = active`, e também bloqueia quando a última ação seja `cancelado` ou `suspenso` (422).
- Arquivo: `backend-laravel/app/Http/Controllers/Api/Admin/SeparationController.php`
- Motivação: evitar geração de etiqueta em assinaturas efetivamente canceladas/suspensas, mesmo com atraso de sincronização do status.

3) SubscriberResource com campos auxiliares
- Antes: retornava `order_status`, `status_code/label`, `gateway_status: null` e dados de endereço básicos do usuário.
- Agora: adiciona `is_active` (boolean derivado de `status_code`) e `payment_status` (placeholder para futura integração de gateway). Campos anteriores permanecem inalterados.
- Arquivo: `backend-laravel/app/Http/Resources/SubscriberResource.php`
- Motivação: fornecer um sinal unificado para o frontend/admin sem quebrar contratos existentes.

4) Endpoint admin para atualizar endereço do usuário
- Antes: não havia rota dedicada; atualização dependia de fluxos indiretos.
- Agora: `PUT /api/admin/users/{user}/address` para atualizar `cep,address,number,neighborhood,complete,city,state`.
- Arquivos: `backend-laravel/app/Http/Controllers/Api/Admin/UserController.php`, `backend-laravel/routes/api.php`
- Motivação: manter o perfil como fonte de verdade de endereço e facilitar correções operacionais.

Compatibilidade e Rollback
- Todas as mudanças são aditivas e condicionais. Para restaurar o comportamento anterior:
  - Remover o filtro por `last_action` na listagem e a checagem no `generateLabel` (mesmo arquivo de controller citado acima).
  - Ignorar os novos campos do `SubscriberResource` no frontend (são opcionais).
  - A rota de endereço é nova; basta não utilizá-la.
