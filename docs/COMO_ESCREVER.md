**COMO ESCREVER — Padrões de Código e Encoding**

Objetivo: garantir que todo o time escreva código limpo, estável e com encoding padronizado, evitando erros de build e inconsistências entre ambientes.

1) Encoding e Arquivos
- Charset único: UTF-8 sem BOM em todo o repositório (frontend, backend, configs).
- Evitar caracteres “tipográficos” (aspas curvas “ ”, apóstrofo ’, hífens – —) em código/JSX/JSON.
- Em atributos JSX sensíveis (title/placeholder/aria-label), usar ASCII quando houver risco. Ex.: “Inicio”, “Fim”.
- Salvar sempre os arquivos como UTF-8 (configurar editor) e evitar copiar texto do Word/WhatsApp sem normalizar aspas/hífens.

2) Frontend (React/Vite)
- Cliente HTTP único em `src/services/api.ts` (axios + interceptors 401/403, `withCredentials: true`).
- Base URL por env: `VITE_API_URL` (produção) e `/api` via proxy (dev) — sem URLs hardcoded.
- Formatação: Prettier aplicado em `src/**/*.{js,jsx,ts,tsx,json,css,md}`.
- ESLint (se configurado) para correções automáticas e regras de estilo.
- Componentes: nada de `fetch/axios` direto em páginas; sempre via services de domínio.

3) Backend (Laravel)
- Controllers/Models/Routes: UTF-8 sem BOM; usar `response()->json()` (UTF-8 por padrão).
- Políticas de autorização (`$this->authorize`) em rotas sensíveis.
- CORS restrito e `supports_credentials: true` se necessário (cookies/token).
- Migrations: incrementais, não destrutivas. Para bancos vindos de dump, usar `php artisan schema:sync` para marcar migrations já refletidas no schema.

4) Banco de Dados
- Charset/Collation: `utf8mb4` / `utf8mb4_unicode_ci` no DB e tabelas.
- Campos JSON reais (MySQL 5.7+). Evitar colunas que dependam de encoding para “corrigir” dados.

5) Automação e Ferramentas
- `.editorconfig` na raiz: `charset=utf-8`, `insert_final_newline=true`, `trim_trailing_whitespace=true`.
- Prettier: `.prettierrc` com regras do time; `npm run format` no frontend.
- (Opcional) Husky + lint-staged para formatar/lintar no commit.

6) Padrões de Nome e Estrutura
- Nomes claros e consistentes (ex.: `sepStatus`, `labelsPage`).
- Pastas por domínio em `src/features/<dominio>/` com `pages`, `components`, `services`.
- Evitar abreviações obscuras; manter português para labels e comentários e inglês consistente para código/identificadores (ou definir padrão do time).

7) PRs e Revisão
- Descrever escopo, mudanças, riscos e passos de validação.
- Não incluir alterações destrutivas de dados/schema; se necessário, descrever o plano e validar com o time.
- Conferir que Prettier/ESLint foram executados e que não há caracteres de encoding inválidos.

8) Checklist Rápido (antes de abrir PR)
- [ ] Arquivos em UTF-8 sem BOM
- [ ] Prettier rodado no frontend
- [ ] Sem “aspas/hífens tipográficos” em JSX/JSON
- [ ] Variáveis/nomes consistentes e claros
- [ ] Healthcheck OK (se tocar backend)
- [ ] Sem URLs hardcoded; envs definidos

