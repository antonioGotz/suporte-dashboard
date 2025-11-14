# Análise Completa: Erros e Incompatibilidades no CI/CD

## 📋 Resumo Executivo

Este documento analisa todos os erros recorrentes relacionados ao build do frontend no GitHub Actions, identificando causas raiz e soluções definitivas.

---

## 🔴 Problemas Identificados

### 1. **Incompatibilidade de Versões: Vite 5 vs Vite 7**

#### Problema
- **Estado Original**: O projeto tinha `vite: ^7.1.2` e `@vitejs/plugin-react: ^5.0.2`
- **Estado Atual**: Forçado para `vite: ^5` e `@vitejs/plugin-react: ^4`
- **Impacto**: Downgrade forçado pode causar incompatibilidades com dependências que esperam Vite 7

#### Análise
```json
// ANTES (correto para React 19)
"vite": "^7.1.2"
"@vitejs/plugin-react": "^5.0.2"
"react": "^19.1.1"

// DEPOIS (downgrade forçado)
"vite": "^5"
"@vitejs/plugin-react": "^4"
"react": "^19.1.1"  // ⚠️ React 19 pode ter incompatibilidades com Vite 5
```

#### Causa Raiz
- React 19 é muito recente e foi lançado junto com Vite 7
- Vite 5 foi lançado para React 18
- `@vitejs/plugin-react@^4` pode não suportar todas as features do React 19

---

### 2. **Erro: "Command vite not found"**

#### Problema
O erro `error Command "vite" not found` ocorria porque:

1. **Script do package.json tentava executar `vite` diretamente**
   ```json
   "build": "vite build --config vite.config.js"
   ```
   - O Yarn não encontrava o binário no PATH
   - O binário está em `node_modules/.bin/vite`, mas não estava no PATH do workflow

2. **Soluções tentadas (incompletas)**:
   - ❌ `yarn vite build` - não funcionava porque `yarn vite` não é um comando válido
   - ❌ `node_modules/.bin/vite build` - caminho relativo não funcionava no CI
   - ❌ `npx vite build` - tentava instalar do npm registry, não do yarn.lock

#### Solução Correta
```json
"build": "vite build"
```
- O script deve usar apenas `vite build` (sem flags extras)
- O Yarn automaticamente resolve `node_modules/.bin/vite` quando executa `yarn build`
- O `--config vite.config.js` é desnecessário (Vite encontra automaticamente)

---

### 3. **Problema: Yarn não instalado no GitHub Actions**

#### Problema
O GitHub Actions não tem Yarn instalado por padrão no runner `ubuntu-latest`.

#### Erro
```
yarn: command not found
Error: Process completed with exit code 127
```

#### Solução Aplicada
```yaml
- name: Install Yarn
  run: npm install -g yarn
```

#### ⚠️ Problema Identificado
- O workflow `frontend-build.yml` **NÃO** instala o Yarn
- O workflow `frontend_deploy.yml` instala, mas pode falhar se npm não estiver disponível

---

### 4. **Inconsistência entre Workflows**

#### Problema
Existem **2 workflows diferentes** com configurações distintas:

1. **`.github/workflows/frontend-build.yml`** (novo)
   - ✅ Usa `FRONTEND_DIR` como env
   - ❌ **NÃO instala Yarn**
   - ✅ Cache configurado corretamente
   - ✅ Usa `working-directory: ${{ env.FRONTEND_DIR }}`

2. **`.github/workflows/frontend_deploy.yml`** (antigo)
   - ❌ Usa caminho hardcoded `./frontend`
   - ✅ Instala Yarn
   - ❌ Cache configurado incorretamente (sem `cache-dependency-path`)
   - ❌ Usa `working-directory: ./frontend` (hardcoded)

#### Impacto
- Workflows podem falhar de forma diferente
- Dificulta debugging
- Manutenção duplicada

---

### 5. **Problema: Peer Dependencies do TipTap**

#### Warnings Recorrentes
```
warning " > @tiptap/extension-link@3.10.0" has unmet peer dependency "@tiptap/core@^3.10.0"
warning " > @tiptap/react@3.10.0" has unmet peer dependency "@tiptap/core@^3.10.0"
```

#### Análise
- **Causa**: O projeto usa `@tiptap/react` e extensões, mas **não instala `@tiptap/core`**
- **Impacto**: Funciona localmente por acaso (transitive dependency), mas pode quebrar no CI
- **Solução**: Instalar explicitamente `@tiptap/core` e `@tiptap/pm`

---

### 6. **Problema: Versão do React 19 vs Vite 5**

#### Incompatibilidade Potencial
- **React 19** foi lançado em Dezembro 2024
- **Vite 5** foi lançado em Novembro 2023 (antes do React 19)
- **Vite 7** foi lançado para suportar React 19 nativamente

#### Risco
- Features do React 19 podem não funcionar corretamente com Vite 5
- TypeScript types podem estar desatualizados
- Hot Module Replacement (HMR) pode ter bugs

---

### 7. **Problema: Cache do Yarn Incorreto**

#### Workflow `frontend_deploy.yml`
```yaml
cache: 'yarn'  # ❌ Não especifica o caminho do yarn.lock
```

#### Problema
- O cache pode ser inválido se houver múltiplos `yarn.lock` (raiz e frontend/)
- O GitHub Actions pode cachear o lockfile errado

#### Solução Correta
```yaml
cache: yarn
cache-dependency-path: frontend/yarn.lock  # ✅ Especifica o lockfile correto
```

---

### 8. **Problema: Package.json na Raiz**

#### Estrutura Atual
```
/
├── package.json  (contém apenas jimp, jspdf)
├── yarn.lock     (lockfile da raiz)
└── frontend/
    ├── package.json
    └── yarn.lock
```

#### Problema
- Dois `yarn.lock` podem causar confusão
- O cache do GitHub Actions pode usar o lockfile errado
- Dependências na raiz podem interferir no frontend

---

## ✅ Soluções Recomendadas

### Solução 1: Manter Vite 7 (Recomendado)

```json
{
  "devDependencies": {
    "vite": "^7.1.2",
    "@vitejs/plugin-react": "^5.0.2"
  }
}
```

**Motivos**:
- React 19 requer Vite 7
- Melhor compatibilidade
- Features mais recentes

**Mudança necessária no workflow**:
```yaml
- name: Build
  run: yarn build  # ✅ Funciona porque o script usa "vite build"
```

---

### Solução 2: Consolidar Workflows

**Opção A**: Manter apenas `frontend-build.yml` (build + deploy)
**Opção B**: Separar responsabilidades:
- `frontend-build.yml` - apenas build/test
- `frontend_deploy.yml` - build + deploy

**Recomendação**: Opção B (separação de concerns)

---

### Solução 3: Corrigir Peer Dependencies

```bash
yarn add @tiptap/core@^3.10.0 @tiptap/pm@^3.10.0
```

---

### Solução 4: Padronizar Instalação do Yarn

Adicionar em **todos** os workflows:
```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: yarn
    cache-dependency-path: frontend/yarn.lock

- name: Install Yarn
  run: corepack enable && corepack prepare yarn@stable --activate
```

**Alternativa** (mais simples):
```yaml
- name: Install Yarn
  run: npm install -g yarn
```

---

### Solução 5: Remover Package.json da Raiz

Se não for necessário, remover `package.json` e `yarn.lock` da raiz:
- Reduz confusão
- Melhora cache do GitHub Actions
- Simplifica estrutura

---

## 📊 Matriz de Compatibilidade

| Componente | Versão Atual | Versão Recomendada | Compatível? |
|------------|--------------|-------------------|-------------|
| React | 19.1.1 | 19.1.1 | ✅ |
| Vite | 5.x (forçado) | 7.1.2 | ⚠️ |
| @vitejs/plugin-react | 4.x (forçado) | 5.0.2 | ⚠️ |
| Node | 20 | 20 | ✅ |
| Yarn | 1.22.22 | 1.22.22 | ✅ |

---

## 🎯 Plano de Ação Imediato

### Prioridade Alta

1. **Reverter downgrade do Vite**
   - Voltar para `vite: ^7.1.2`
   - Voltar para `@vitejs/plugin-react: ^5.0.2`
   - Testar build local

2. **Corrigir workflow `frontend-build.yml`**
   - Adicionar instalação do Yarn
   - Garantir cache correto

3. **Instalar peer dependencies do TipTap**
   - `@tiptap/core`
   - `@tiptap/pm`

### Prioridade Média

4. **Consolidar workflows**
   - Decidir qual manter
   - Padronizar configurações

5. **Limpar estrutura**
   - Avaliar necessidade do `package.json` na raiz
   - Remover se desnecessário

---

## 🔍 Checklist de Validação

Após aplicar correções, validar:

- [ ] `yarn build` funciona localmente
- [ ] `yarn dev` funciona localmente
- [ ] Workflow `frontend-build.yml` executa com sucesso
- [ ] Workflow `frontend_deploy.yml` executa com sucesso
- [ ] Build gera arquivos em `frontend/dist/`
- [ ] Não há warnings críticos de peer dependencies
- [ ] Cache do Yarn funciona corretamente
- [ ] Yarn é instalado corretamente no CI

---

## 📝 Notas Finais

### Lições Aprendidas

1. **Não fazer downgrade de versões principais sem necessidade**
   - Vite 7 é necessário para React 19
   - Downgrade causa mais problemas que resolve

2. **Scripts devem ser simples**
   - `"build": "vite build"` é suficiente
   - Yarn resolve binários automaticamente

3. **Workflows devem ser consistentes**
   - Mesma configuração em todos os workflows
   - Fácil de manter e debugar

4. **Peer dependencies devem ser explícitas**
   - Instalar dependências que são claramente necessárias
   - Evita problemas de transitive dependencies

### Próximos Passos

1. Aplicar correções recomendadas
2. Testar localmente
3. Fazer commit e push
4. Monitorar execução no GitHub Actions
5. Documentar decisões tomadas

