# Documentação do Módulo: Assinantes

## 1. Descrição Geral
Módulo responsável pela gestão dos assinantes do sistema, incluindo listagem, cadastro, edição, visualização de detalhes e filtros avançados. Permite o acompanhamento do status dos assinantes, ações administrativas e integração com pedidos (orders).

## 2. Diagrama de Fluxo ou Esquemático
- [ ] Inserir fluxograma do fluxo de assinantes (listagem > detalhes > ações)

## 3. Fluxo Principal
1. Usuário acessa o menu "Assinantes".
2. Visualiza a lista de assinantes com filtros e busca.
3. Pode clicar em "Ver detalhes" para acessar o perfil do assinante.
4. Pode adicionar novo assinante pelo botão correspondente.
5. Pode buscar assinantes pelo campo de busca.
6. Ações disponíveis: editar, suspender, reativar, cancelar, exportar.

## 4. Filtros e Lógicas de Listagem
- Filtro “Todos”: Mostra todos os assinantes ativos e aprovados, deduplicando por usuário (apenas o pedido mais recente por usuário).
- Filtro “Ativos”: Mostra assinantes com status ativo, deduplicando por usuário.
- Filtro “Pendentes/Solicitações”: Mostra usuários sem pedidos (orders), ou seja, potenciais assinantes ainda não convertidos.
- Filtro “Suspensos/Cancelados”: Mostra assinantes cujo último pedido está suspenso ou cancelado.
- Busca: Permite pesquisar por nome ou e-mail do assinante.
- Observação: A deduplicação é padrão para evitar assinantes duplicados na listagem.

## 5. Botões e Ações Disponíveis
- Botão “Adicionar Assinante”: Abre modal/formulário para cadastro manual de novo assinante.
- Botão “Buscar”: Realiza busca por nome ou e-mail.
- Botão “Ver Detalhes”: Abre a página de perfil do assinante.
- Botão “Editar”: Permite editar dados do assinante.
- Botão “Suspender/Reativar/Cancelar”: Ações administrativas sobre o status do assinante.
- Botão “Exportar”: Exporta a lista de assinantes filtrada.

## 6. Backend
### 6.1 Endpoints/API
- Listagem: `[GET] /api/admin/subscribers`  
  - Parâmetros: status, search, limit, unique (deduplicação)
- Detalhes: `[GET] /api/admin/subscribers/{id}`
- Cadastro: `[POST] /api/admin/subscribers/{user}/orders`
- Edição: `[PUT/PATCH] /api/admin/subscribers/{orderId}/status`
- Contagem: `[GET] /api/admin/subscribers/counts`

### 6.2 Exemplos de Requisições e Respostas
- Listagem:
```json
GET /api/admin/subscribers?status=todos&unique=1
{
  "data": [
    {
      "order_id": 123,
      "user_id": 1,
      "user_name": "João Silva",
      "user_email": "joao@email.com",
      ...
    }
  ],
  "current_page": 1,
  "last_page": 2,
  "total": 20
}
```
- Detalhe:
```json
GET /api/admin/subscribers/123
{
  "order_id": 123,
  "user_id": 1,
  "user_name": "João Silva",
  "name": "João Silva", // padronizado
  ...
}
```

### 6.3 Lógica de Negócio
- Deduplicação automática por usuário nos filtros principais.
- Cadastro de assinante gera novo pedido (Order) vinculado ao usuário.
- Permissões controladas por policies (apenas admins podem editar/cancelar).
- Logs de ações em tabela actions_log.

### 6.4 Tratamento de Erros
- 404 para assinante não encontrado.
- 422 para dados inválidos no cadastro/edição.
- Mensagens padronizadas em JSON.

### 6.5 Permissões e Regras de Acesso
- Apenas usuários com permissão "admin" podem acessar, editar ou cadastrar assinantes.

### 6.6 Alterações no Banco de Dados
- Tabela `orders` (pedidos/assinaturas)
- Tabela `users` (usuários)
- Tabela `actions_log` (log de ações administrativas)
- Possível ajuste em seeds para ambiente de produção

## 7. Frontend
### 7.1 Componentes Utilizados
- `SubscribersList` (lista principal)
- `SubscriberProfile` (página de detalhes)
- `AddSubscriberModal` (modal de cadastro)
- `SearchBar` (busca)

### 7.2 Integração com Backend
- Busca de assinantes via service/hook (`/api/admin/subscribers`)
- Busca de detalhes via service/hook (`/api/admin/subscribers/{id}`)
- Cadastro via POST (`/api/admin/subscribers/{user}/orders`)

### 7.3 Lógica de Exibição e Interação
- Exibe botões conforme permissões do usuário logado.
- Exibe status e ações disponíveis conforme status do assinante.
- Mensagens de erro/sucesso exibidas em toast/modal.

## 8. Relação Back x Front
- Listagem consome `/api/admin/subscribers`.
- Detalhes consome `/api/admin/subscribers/{id}`.
- Cadastro consome `/api/admin/subscribers/{user}/orders`.
- Status e permissões trafegam via JSON.

## 9. Testes
- Testes de integração para endpoints de listagem, cadastro e edição.
- Testes unitários para lógica de deduplicação e policies.
- Para rodar: `php artisan test --filter=Subscriber`

## 10. Referências de Código
- Backend: `app/Http/Controllers/Api/Admin/SubscriberController.php`
- Frontend: `src/features/subscribers/`, `src/pages/SubscriberProfile.jsx`

## 11. Páginas Relacionadas e Navegação
- Página de perfil do assinante (detalhes): acessada via botão "Ver Detalhes" na lista.
- Da página de detalhes, é possível navegar para edição, histórico de ações e exportação de dados.
- Relacionamento com menu de Pedidos (Orders) e Usuários.

## 12. Histórico de Alterações
- 2025-10-15: Padronização dos campos name/user_name no resource de detalhes.
- 2025-10-15: Deduplicação automática implementada nos filtros principais.

## 13. Observações para Deploy/Migração
- Rodar migrations para garantir estrutura das tabelas `orders`, `actions_log` e `users`.
- Validar seeds de produtos e permissões.
- Checklist: testar deduplicação, permissões e cadastro manual.
- Atenção ao contrato do resource de detalhes: padronizar uso de name/user_name para evitar ambiguidade no frontend.
