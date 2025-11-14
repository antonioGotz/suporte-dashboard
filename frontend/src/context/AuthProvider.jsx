// ARQUIVO: src/context/AuthProvider.jsx
// OBJETIVO: Gerir o estado de autenticação do utilizador em toda a aplicação React.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from './AuthContext.jsx';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        if (!token) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                const userData = response?.data?.data ?? null;
                setUser(userData);
            } catch (error) {
                setUser(null);
                try {
                    localStorage.removeItem('authToken');
                } catch { /* noop */ }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Aceita assinatura stateful: apenas dados do usuário
    const login = (userData, token) => {
        try {
            localStorage.setItem('authToken', token);
        } catch { /* noop */ }
        setUser(userData);
        navigate('/dashboard', { replace: true });
    };

    // Função para fazer o logout.
    const logout = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
            if (token) {
                await api.post('/admin/logout', {});
            }
        } catch (error) {
            console.error("Erro ao fazer logout na API:", error);
        } finally {
            try {
                localStorage.removeItem('authToken');
            } catch { /* noop */ }
            setUser(null);
            navigate('/login', { replace: true });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
