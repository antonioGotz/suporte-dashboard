# Fluxo de Aprovação de Assinantes — Documentação de Deploy

## Visão Geral
Este documento descreve o fluxo seguro e recomendado para cadastro, aprovação e gestão de assinantes no sistema, conforme implementado em 09/10/2025.

---

## 1. Cadastro do Assinante (Site/Demo)
- O usuário preenche o formulário em `/demo-signup`.
- O sistema sugere automaticamente um ID único.
- Ao enviar, **apenas o usuário é criado** (sem assinatura/order).
- Mensagem exibida: “Cadastro enviado! Aguarde aprovação do administrador. Assim que aprovado, sua assinatura será ativada.”

## 2. Aprovação/Administração (Painel)
- O admin acessa o painel e filtra por “Solicitações (sem assinatura)” para ver os pendentes.
- Para cada pendente, há:
  - Botão “Criar Assinatura” (gera o pedido/order vinculado ao usuário, com ID único gerado automaticamente).
  - Botão “Excluir” (com confirmação), que remove o cadastro do banco caso necessário.
- Após aprovação, o assinante passa a aparecer nas listas de ativos e pode ser gerenciado normalmente.

## 3. Segurança e Integridade
- O backend garante que IDs de orders são sempre únicos, mesmo sem AUTO_INCREMENT.
- Não é possível excluir usuários que já possuem assinatura/order vinculada.
- Todo fluxo é auditável e reversível conforme documentação de integridade (`procedimento_integridade_orders.md`).

## 4. Observações para Deploy
- Sempre siga o fluxo: cadastro → aprovação → geração de assinatura.
- Nunca crie orders automaticamente no cadastro demo.
- Use os filtros do painel para aprovar ou excluir pendentes.
- Consulte a documentação de integridade antes de migrar ou restaurar o banco.

---

## Observação sobre compatibilidade com sistema legado

> **Atenção:**
> Este projeto suporta tanto o modo seguro (com PRIMARY KEY/AUTO_INCREMENT na tabela `orders`) quanto o modo legado (controle manual de id).
> 
> - Para manter compatibilidade com o legado, basta não alterar o schema da tabela `orders` e garantir que o backend sempre envie um id único ao criar um pedido.
> - Se desejar migrar para o modo seguro, siga o procedimento de integridade e ajuste o schema conforme documentado.

---

**Responsável:**
- [Seu Nome]
- Data: 09/10/2025
- Projeto: meu-projeto
