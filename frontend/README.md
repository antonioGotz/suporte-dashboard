# Frontend

Informações sobre o frontend.

## Testando deploy automático
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## CI/CD — Frontend (Vite + Yarn)

### Pasta do Frontend
- **FRONTEND_DIR**: `frontend`

### Requisitos
- **Node**: 20
- **Yarn**: Gerenciador de pacotes usado

### Variáveis de Ambiente
- **VITE_API_URL**: Configurada no workflow do GitHub Actions como `https://apicentral.aevolua.com.br/api`
  - Pode ser configurada via secrets do GitHub Actions (`secrets.VITE_API_URL`) no futuro

### Comandos Locais

```bash
# Instalar dependências
yarn install

# Desenvolvimento (com hot reload)
yarn dev

# Build de produção
yarn build

# Preview do build
yarn preview
```

### Workflow do GitHub Actions
O workflow `.github/workflows/frontend-build.yml` executa automaticamente em:
- Push para a branch `main`
- Pull requests

O workflow:
1. Configura Node.js 20 com cache do Yarn
2. Instala dependências com `yarn install --frozen-lockfile`
3. Executa o build com `yarn build`
4. Injeta a variável `VITE_API_URL` automaticamente
