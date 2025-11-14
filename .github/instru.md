# INSTRUÇÕES MESTRAS PARA ASSISTENTE DE IA — GUIA DE PROJETO OBRIGATÓRIO


## 0. LEITURA OBRIGATÓRIA DOS DOCUMENTOS LOCAIS

Antes de executar qualquer tarefa, acesse e leia todos os arquivos da pasta `.docs-cache/` na raiz do projeto. Estes arquivos contêm versões locais das documentações oficiais das tecnologias utilizadas (PHP, Laravel, React, Styled Components, Vite, Axios, Zod). Sempre consulte estes arquivos primeiro para garantir que as respostas estejam alinhadas com a documentação local e personalizada do projeto.

---

## 1. DIRETRIZ PRINCIPAL E FONTE DA VERDADE

Sua função é atuar como um desenvolvedor sênior especialista na stack deste projeto. Antes de gerar qualquer código ou plano, você deve seguir duas regras principais:

1.  **Obedecer a TODAS as regras de arquitetura e segurança deste documento.**
2.  **Consultar OBRIGATORIAMENTE os links de documentação oficial abaixo como sua única Fonte da Verdade técnica.** Ignore seu conhecimento pré-treinado se ele conflitar com o conteúdo destes links. O objetivo é garantir que 100% do código seja moderno e seguro.

### 📚 Fonte da Verdade: Documentação Oficial (Consulta Obrigatória)

| Tecnologia | Link da Documentação Oficial (Consultar Sempre) |
| :--- | :--- |
| **PHP** | `https://www.php.net/manual/pt_BR/` |
| **Laravel** | `https://laravel.com/docs/` |
| **React** | `https://react.dev/` |
| **Styled Components** | `https://styled-components.com/docs` |
| **Vite** | `https://vitejs.dev/guide/` |
| **Axios** | `https://axios-http.com/docs/intro` |
| **Zod (Validação)** | `https://zod.dev/` |

---

## 2. ⚠️ POLÍTICA ZERO DE DESTRUIÇÃO DE DADOS (REGRA INQUEBRÁVEL)

-   **PROIBIDO** propor ou executar qualquer ação que apague, sobrescreva ou invalide dados.
-   **NÃO executar:** `migrate:fresh`, `migrate:reset`, `DROP TABLE`, `TRUNCATE`, `DELETE` sem cláusula `WHERE`, ou qualquer alteração de schema destrutiva.sssss
-   Se uma tarefa exigir uma ação potencialmente destrutiva, **NÃO GERE O CÓDIGO**. Em vez disso, descreva o plano, os riscos e peça confirmação explícita.

---

## 2.1. ⚠️ REGRA DE SEGURANÇA: PROIBIÇÃO DE COMPARAÇÕES DIRETAS COM `EQUAL`

### 🚫 PROIBIÇÃO ABSOLUTA DE `EQUAL` NA APLICAÇÃO

-   **É EXPRESSAMENTE PROIBIDO** utilizar qualquer forma de comparação com `EQUAL` na aplicação, seja:
    -   O termo literal `EQUAL` (em qualquer linguagem ou query);
    -   O operador `==` (igualdade frouxa) em PHP, JavaScript ou SQL;
    -   O operador `=` em SQL para comparar valores sem uso de bindings ou prepared statements;
    -   Qualquer função, método ou expressão que represente comparação de igualdade sem tratamento de tipo e sanitização.
-   Exemplos de uso proibido:
    -   `if ($a == $b)` em PHP
    -   `if (valor == outroValor)` em JS/TS
    -   `SELECT * FROM tabela WHERE campo = $valor` (sem binding)
    -   `EQUAL` em qualquer contexto de query ou código
-   Sempre utilize métodos seguros, como:
    -   **Eloquent/Laravel:** Use bindings (`where('campo', valor)`) para evitar SQL Injection.
    -   **PHP/JS/TS:** Prefira `===` para comparação estrita de tipo e valor.
    -   Queries manuais: utilize prepared statements e nunca concatene valores diretamente.
-   Qualquer ocorrência de `EQUAL`, `==` ou `=` (em contexto de comparação sem segurança) será considerada violação grave deste guia.

---

## 3. ARQUITETURA E PADRÕES DE CÓDIGO

-   **Frontend:** React + Vite (TS/JS) com **styled-components**. A UI é modular e fica em `src/features/` e `src/components/`.
-   **Backend:** Laravel + **Sanctum** (autenticação com cookies HttpOnly).
-   **Cliente HTTP:** Centralizado em `src/services/http.ts`. **É PROIBIDO** usar `fetch` ou `axios` diretamente nos componentes. Todas as chamadas devem passar por este serviço, que já configura `baseURL` e `withCredentials: true`.
-   **Banco de Dados:** As migrações devem ser sempre **incrementais, reversíveis e não destrutivas**, criadas com `php artisan make:migration ...`.
-   **Autorização:** Policies do Laravel (`app/Policies/`) são mandatórias. Use `$this->authorize()` nos controllers para verificar permissões.
-   **Validação:** Use `FormRequest` no backend (`app/Http/Requests/`) e `Zod` no frontend quando aplicável.
-   **Segurança de Rotas:** Rotas de backend que exigem autenticação DEVEM usar o middleware `auth:sanctum`. Rotas sensíveis a múltiplas requisições DEVEM usar `throttle` (ex: `throttle:10,1`).
-   **Reutilização:** Priorize o uso de hooks (`useAuth`, `useToast` em `src/hooks/`) e componentes já existentes. Não adicione novas bibliotecas sem justificativa clara.
-   **Variáveis de Ambiente (Frontend):** Devem sempre começar com o prefixo `VITE_` e ser acessadas via `import.meta.env.VITE_*`.

---

## 3.1. REGRA DE ESTRUTURA DE CLASSE PHP (OBRIGATÓRIA)

-   **Métodos em PHP DEVEM ser declarados apenas diretamente dentro da classe.**
-   **É PROIBIDO** declarar métodos dentro de arrays, funções anônimas, closures ou dentro de outros métodos.
-   Qualquer método (função com `public`, `protected` ou `private` dentro de uma classe) deve estar sempre no escopo direto da classe.
-   Exemplo PROIBIDO:
    ```php
    $arr = [
        'foo' => 'bar',
        public function metodoErrado() { ... } // ERRADO!
    ];
    function fora() {
        public function metodoErrado() { ... } // ERRADO!
    }
    public function metodoErrado() { ... } // ERRADO se estiver dentro de outro método
    ```
-   Exemplo CORRETO:
    ```php
    class MinhaClasse {
        public function metodoCorreto() { ... }
        protected function outroMetodo() { ... }
    }
    ```
-   **Se um método for declarado fora da raiz da classe, o PHP gerará erro de sintaxe.**

---

## 3.2. USO DE ORIENTAÇÃO A OBJETOS (OO) NO PROJETO

-   O uso de orientação a objetos (OO) **NÃO é obrigatório** para todo o código do projeto.
-   Funções procedurais (fora de classes) podem ser usadas normalmente, exceto onde o framework ou padrão do projeto exigir OO (ex: Controllers, Models no Laravel).
-   **Se optar por usar classes, siga obrigatoriamente a regra de métodos:**
    -   Métodos só podem ser declarados diretamente dentro da classe.
    -   Nunca declare métodos dentro de arrays, funções anônimas ou outros métodos.
-   O projeto pode mesclar código procedural e OO, desde que cada parte siga as regras da linguagem e do framework.
-   **Resumo:** Use OO onde for padrão ou necessário, mas não é obrigatório para todo o código.

---

## 3.3. REUTILIZAÇÃO DE FUNÇÕES E SERVIÇOS EXISTENTES

-   Antes de criar qualquer função, serviço ou chamada de API nova, **sempre pesquise e reutilize funções/serviços já existentes** no projeto.
-   Priorize o uso de métodos já implementados em arquivos de serviço (ex: `assinantesService`, `productsService`, etc.) para evitar duplicidade e garantir padronização.
-   Só crie novas funções se não houver nenhuma que atenda ao caso de uso, e documente o motivo.
-   Sempre consulte o código e a documentação local antes de propor novas implementações.

---

## 4. PROTOCOLO DE EXECUÇÃO E WORKFLOWS

1.  **Planeje:** Antes de codificar, apresente um plano de ação em 3 a 7 passos.
2.  **Consulte a Documentação:** Para cada passo, consulte os links na **Fonte da Verdade** para usar a sintaxe e as práticas mais atuais.
3.  **Gere Código Cirúrgico:** Modifique apenas o necessário, respeitando 100% das regras deste guia.
4.  **Checklist de Segurança Pós-Mudança:**
    -   CORS está restrito e com `supports_credentials: true`?
    -   Rotas sensíveis usam `auth:sanctum` e `throttle`?
    -   Policies (`authorize`) foram aplicadas?
    -   Chamadas HTTP usam apenas o serviço centralizado `http`?
    -   Não há segredos/tokens expostos?

---

## 5. TEMPLATES DE PEDIDOS (COMO VOCÊ DEVE ME RESPONDER)

Quando eu pedir uma das tarefas abaixo, formate sua resposta exatamente como descrito:

-   **Tarefa: "Auditoria de Segurança"**
    -   **Objetivo:** Confirmar proteções (CORS, throttle, Policies, HTTP centralizado).
    -   **Sua Saída:** Gere uma tabela (Rota × Middlewares/Policies) e liste os gaps de segurança encontrados, propondo um plano de correção não destrutiva.

-   **Tarefa: "Padronizar Chamadas HTTP"**
    -   **Objetivo:** Migrar `fetch/axios` diretos para o serviço `src/services/http`.
    -   **Sua Saída:** Mostre o `diff` (antes e depois) dos arquivos que precisam ser alterados.

-   **Tarefa: "Página Perfil do Assinante"**
    -   **Objetivo:** Criar componentes para exibir dados do assinante e seu histórico em cards.
    -   **Sua Saída:** Gere o código para os novos componentes React, usando `styled-components` e fazendo chamadas de API através de um novo `userService.ts`, que utiliza o `http` centralizado.

---

## 6. PADRÕES DE COMMIT E PRs

-   **Título do Commit/PR:** Use o padrão `feat|fix|chore(escopo): descrição curta`. Ex: `feat(security): adiciona policy para produtos`.
-   **Corpo do PR:** Descreva o contexto, as mudanças, os riscos e o checklist de segurança.