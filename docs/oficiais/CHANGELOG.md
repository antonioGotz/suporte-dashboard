# CHANGELOG — Documentação Oficial

Este arquivo registra mudanças relevantes na documentação e no comportamento dos módulos descritos em `docs/oficiais`.

## 2025-10-16 — Módulo de Separações alinhado ao Perfil
- Doc: ver `docs/oficiais/separacoes.md` (seção “Alterações Recentes (Before/After)”).
- Lista de separação agora exclui pedidos cuja última ação (`ActionLog`) seja `cancelado` ou `suspenso`.
- Geração de etiqueta também bloqueia quando a última ação indicar `cancelado`/`suspenso`, além de exigir `orders.status = active`.
- `SubscriberResource` passou a expor `is_active` e `payment_status` (placeholder).
- Nova rota admin para atualizar endereço do usuário: `PUT /api/admin/users/{user}/address`.

Rollback rápido
- Remover filtro por `last_action` na listagem e checagem no `generateLabel` (arquivo `backend-laravel/app/Http/Controllers/Api/Admin/SeparationController.php`).
- Ignorar os campos novos do `SubscriberResource` no front (são opcionais).
- A rota de endereço é aditiva; basta não utilizá-la.

Links úteis
- Guia do módulo: `docs/oficiais/separacoes.md`
- Como escrever docs: `docs/COMO_ESCREVER.md`

