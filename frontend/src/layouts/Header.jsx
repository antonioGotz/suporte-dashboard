import React from 'react';
import NotificationBell from '../components/NotificationBell.jsx';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    const goToOrder = (orderId) => {
        navigate(`/kanban?focus=${orderId}`); // ajuste conforme sua rota
    };

    return (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
            <div>Meu Painel</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <NotificationBell />
            </div>
        </header>
    );
}
