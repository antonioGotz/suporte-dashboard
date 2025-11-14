import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { StyleSheetManager } from 'styled-components';
// Removido ToastProvider
import App from './App';
// CORREÇÃO: Importando o arquivo de estilo correto e completo
import GlobalStyles from './styles/GlobalStyles.jsx';

// Filtro global simples para evitar que props não padrão vazem para elementos DOM nativos
const shouldForwardProp = (prop, target) => {
  if (typeof target === 'string') {
    const blocked = new Set([
      'isActive', '$isActive', 'active', '$active',
      'variant', '$variant', 'intent', '$intent',
      'size', '$size', 'selected', '$selected',
    ]);
    return !blocked.has(prop);
  }
  return true;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* O GlobalStyles deve vir aqui, para ser aplicado a tudo */}
    <GlobalStyles />
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </StyleSheetManager>
  </React.StrictMode>
);
