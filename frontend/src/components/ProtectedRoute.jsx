// ARQUIVO: src/components/ProtectedRoute.jsx (VERSÃO CORRIGIDA E INTELIGENTE)

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // 1. Enquanto o AuthContext estiver verificando o usuário, mostramos uma tela de carregamento.
    //    Isso impede a renderização da tela em branco.
    if (loading) {
        return <div>Verificando autenticação...</div>; // Ou um spinner/componente de loading
    }

    // 2. Após o carregamento, verificamos se o usuário existe.
    //    Se não existir (user é null), redirecionamos para o login.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Se o carregamento terminou e o usuário existe, renderizamos a página solicitada (Dashboard, etc.).
    //    Usamos <Outlet /> como padrão para rotas aninhadas.
    return <Outlet />;
};

export default ProtectedRoute;