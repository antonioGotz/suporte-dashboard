# Procedimento de Integridade da Tabela `orders` — Deploy/Migração

## Objetivo
Garantir que a tabela `orders` esteja íntegra, sem duplicidade de IDs, e compatível com o funcionamento seguro do backend Laravel, tanto para ambientes de desenvolvimento quanto produção.

---

## 1. Diagnóstico Inicial
- Verifique se a tabela `orders` possui duplicidade de IDs:
  ```sql
  SELECT id, COUNT(*) as total FROM orders GROUP BY id HAVING total > 1;
  ```
- Se houver duplicatas, é obrigatório removê-las antes de qualquer alteração estrutural.

## 2. Backup dos Dados
- Antes de qualquer exclusão, faça backup dos registros duplicados:
  - Exporte os registros duplicados para arquivo `.sql` ou `.csv`.
  - Exemplo:
    ```sql
    SELECT * FROM orders WHERE id IN (SELECT id FROM (SELECT id FROM orders GROUP BY id HAVING COUNT(*) > 1) as t);
    ```

## 3. Remoção Segura de Duplicados
- Para cada ID duplicado, mantenha apenas o registro mais antigo (ou o mais relevante para o negócio):
  ```sql
  DELETE FROM orders WHERE id IN (SELECT id FROM (SELECT id FROM orders GROUP BY id HAVING COUNT(*) > 1) as t) AND created_at NOT IN (SELECT MIN(created_at) FROM orders GROUP BY id);
  ```
- Confirme que não restaram duplicatas:
  ```sql
  SELECT id, COUNT(*) as total FROM orders GROUP BY id HAVING total > 1;
  ```

## 4. Ajuste do Schema (Opcional, mas Recomendado)
- Para máxima segurança e performance, defina o campo `id` como PRIMARY KEY e AUTO_INCREMENT:
  ```sql
  ALTER TABLE orders MODIFY COLUMN id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (id);
  ```
- Se não for possível (por restrição de legado), mantenha a validação de unicidade no backend.

## 5. Testes
- Teste a criação de assinantes e pedidos pelo painel/admin e pelo fluxo demo.
- Certifique-se de que o sistema recusa IDs duplicados e gera erros claros ao usuário.

## 6. Restauração (Rollback)
- Para restaurar registros removidos, utilize os backups salvos no passo 2:
  ```sql
  INSERT INTO orders (...) VALUES (...);
  ```
- Documente sempre os registros removidos e o motivo.

---

## Observações Finais
- Nunca suba para produção um banco com duplicidade de IDs em `orders`.
- Prefira sempre a integridade garantida pelo banco (PRIMARY KEY/AUTO_INCREMENT).
- Se optar por controle manual de IDs, mantenha validação rigorosa no backend.

---

**Responsável:**
- [Seu Nome]
- Data: 09/10/2025
- Projeto: meu-projeto
