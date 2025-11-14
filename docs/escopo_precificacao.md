## Escopo para Precificação — Projeto Meu Dashboard

Este documento sumariza o escopo necessário para que um orçamento seja preparado. Contém atividades, tecnologias envolvidas, premissas, limites e itens opcionais que afetam preço.

### Visão geral
- Tipo: Sistema web (Dashboard/Admin) existente.
- Arquitetura: Backend API em Laravel 12 (PHP 8.2+) + Frontend SPA em React (Vite).
- Estado: Código em produção/uso (base madura, documentação e backups presentes) — considerar como sistema legado/evolutivo.

### Principais módulos (escopo funcional)
1. Autenticação e autorização
   - Login via API (`POST /api/login`) com Laravel Sanctum.
   - Proteção de rotas administrativas (`can:admin`).
2. Módulo Assinantes
   - Listagem, filtros, busca, deduplicação por usuário.
   - Visualização de detalhes (perfil, orders, children).
   - Criação/aceitação de pedidos manualmente e atualização de status.
   - Endpoints principais: `GET /api/admin/subscribers`, `GET /api/admin/subscribers/{id}`, `POST /api/admin/subscribers/{user}/orders`, `PUT /api/admin/subscribers/{orderId}/status`, `GET /api/admin/subscribers/counts`.
3. Separações e logística
   - Seleção de assinaturas elegíveis (janela configurável, ex.: próximos 15 dias).
   - Cálculo de próxima remessa e idade do bebê para sugestão de produto.
   - Geração de etiqueta (provider fake atualmente). Endpoint: `POST /api/admin/orders/{order}/shipping/label`.
   - Histórico de etiquetas: `GET /api/admin/shipping/labels/recent`.
4. Produtos / Planos
   - CRUD de produtos, endpoint para planos de assinatura.
5. Upload de arquivos
   - Upload seguro para imagens/ativos de produto.
6. Notificações e histórico
   - Listagem, contadores, marcação de leitura e logs (`ActionLog`).

### Tecnologias e versões (observadas no repositório)
- Backend: PHP 8.2, Laravel 12.x, Sanctum, PHPUnit 11, filas (queues), Vite para assets.
- Frontend: React 19, Vite 7, styled-components, react-router v7, TipTap, Axios.
- Banco: compatível com SQLite (dev), MySQL/MariaDB/Postgres em produção (config via `.env`).

### Premissas para orçar
- Fornecer acesso a: repositório (read/write), ambiente de staging (ou DB dump), e credenciais de provedores externos (se houver).
- Integração com transportadora: hoje é "fake" — orçar separadamente a integração com provider real (API de geração de etiquetas e tracking).
- Usuários administrativos e políticas já existentes; orçar alterações de permissão separadamente.

### Limites (fora do escopo básico)
- Integração com gateway de pagamentos real e reconciliação (se não existir) — item opcional.
- Reescrita completa do frontend ou migração para outra stack.
- Infra/DevOps (pipeline CI/CD, provisionamento infra) — orçar separadamente.

### Itens de custo para cotação (detalhamento para o precificador)
1. Levantamento detalhado e workshop (4–8h) — entendimento de regras de negócio e dados.
2. Correções críticas/bugs (por sprint ou por hora) — estimar por complexidade.
3. Evolução do backend
   - Novos endpoints, validações, policies, normalização de status
   - Integração com transportadora real (API + mapping de campos + testes)
4. Evolução do frontend
   - Implementação/ajuste de telas (Assinantes, Separações, geração de etiqueta)
   - UX/ajustes de filtros e paginação
5. Dados e migrações
   - Migrations, scripts de normalização (orders/status/actions)
   - Importação e validação de dados do backup
6. Testes e QA
   - Unit + integração (PHPUnit), testes E2E opcionais
7. Documentação e entrega
   - Atualizar README, adicionar runbook de deploy e checklist operacional

Para cada item, sugerir: escopo mínimo, tempo estimado (horas ou dias), responsável e dependências.

### Critérios de aceitação (para entrega)
- Endpoints documentados e testados (POST/GET principais).
- Fluxo de geração de etiqueta validado, com logs e tratamento de erros (422/409 conforme regras).
- UI funcional consumindo os endpoints principais e mostrando mensagens de erro amigáveis.
- Migrations aplicadas sem perda de dados em staging e plano de rollback documentado.

### Riscos e observações
- Produção usa banco diferente do dev (ver `.env`) — sempre testar em staging com dump real.
- Provider de frete real pode exigir adaptação de campos de endereço (CEP, número, complemento).
- Há lógica complexa de deduplicação e normalização de `separation_status` — estimar tempo de análise para evitar regressões.

---

Se quiser, eu adiciono estimativas em horas/dias por item (modelo T-shirt sizing ou Pontos) e gero um arquivo PDF/Word pronto para enviar ao seu amigo.
