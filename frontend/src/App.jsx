// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AssinantesPage from './features/assinantes/pages/AssinantesPage.jsx';
import AssinanteAddPage from './features/assinantes/pages/AssinanteAddPage.jsx';
import ProdutosPage from './features/produtos/pages/ProdutosPage.jsx';
import EstoquePage from './pages/EstoquePage.jsx';
import HistoricoPage from './features/historico/pages/HistoricoPage.jsx';
import ProductAddPage from './features/produtos/pages/ProductAddPage.jsx';
import ProductEditPage from './features/produtos/pages/ProductEditPage.jsx';
import SeparacaoPage from './features/separacao/pages/SeparacaoPage.jsx';
import LabelHistoryPage from './features/separacao/pages/LabelHistoryPage.jsx';
import DemoSignupPage from './pages/DemoSignupPage.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import DemoSubscribersAdminPage from './demo/pages/DemoSubscribersAdminPage.jsx';
import DemoSubscriberProfilePage from './demo/pages/DemoSubscriberProfilePage.jsx';

// === IMPORTAÇÃO DA NOVA PÁGINA DE DETALHES ===
import AssinanteDetalhePage from './features/assinantes/pages/AssinanteDetalhePage.jsx';
import EmailComposerPage from './pages/EmailComposerPage.jsx';

// === Provider de Alertas (novo) ===
// AlertsProvider removido

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/demo-signup" element={<PublicLayout><DemoSignupPage /></PublicLayout>} />
      <Route path="/demo-subscriber/:id" element={<PublicLayout><DemoSubscriberProfilePage /></PublicLayout>} />

      {/* Public test route for Email Composer (no auth) */}
      <Route path="/email-composer-public" element={<PublicLayout><EmailComposerPage /></PublicLayout>} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* --- Rotas de Assinantes Agrupadas --- */}
          <Route path="assinantes" element={<AssinantesPage />} />
          <Route path="assinantes/novo" element={<AssinanteAddPage />} />
          {/* === Perfil do Assinante === */}
          <Route path="assinantes/:id" element={<AssinanteDetalhePage />} />

          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="produtos/novo" element={<ProductAddPage />} />
          <Route path="produtos/:productId/editar" element={<ProductEditPage />} />

          <Route path="estoque" element={<EstoquePage />} />
          <Route path="separacao" element={<SeparacaoPage />} />
          <Route path="shipping/labels" element={<LabelHistoryPage />} />
          <Route path="email-composer" element={<EmailComposerPage />} />
          <Route path="demo-subscribers" element={<DemoSubscribersAdminPage />} />
          <Route path="historico" element={<HistoricoPage />} />
        </Route>
      </Route>

      <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
    </Routes>

  );
}

export default App;
