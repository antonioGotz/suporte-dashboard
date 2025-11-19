import React, { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBox, FaCubes, FaSignOutAlt, FaHistory, FaUserCircle, FaTicketAlt, FaEnvelope, FaAddressBook } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import NotificationBell from '../../components/NotificationBell';
import Clock from '../../components/Clock';
import logoUrl from '../../assets/logo.png';
import HamburgerButton from './HamburgerButton';
import MobileSidebar from './MobileSidebar';
import * as S from './DashboardLayout.styles';

// Componente auxiliar para itens colapsáveis (precisa de estado próprio)
const CollapsibleNavItemWrapper = ({ item }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div style={{ marginBottom: 0 }}>
      <S.NavItem
        as="div"
        style={{
          cursor: 'pointer',
          opacity: 0.95,
          userSelect: 'none',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          paddingRight: 0
        }}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span aria-hidden="true">{item.icon}</span>
        <span className="label">{item.label}</span>
        <span
          style={{
            position: 'absolute',
            right: 18,
            top: '50%',
            transform: `translateY(-50%) ${open ? 'rotate(90deg)' : 'rotate(0deg)'}`,
            transition: 'transform 0.28s cubic-bezier(.4,1.4,.6,1)',
            opacity: 0.7,
            fontSize: 18,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            height: 18
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </S.NavItem>
      <div
        style={{
          marginLeft: 24,
          marginTop: 0,
          marginBottom: 0,
          maxHeight: open ? 200 : 0,
          overflow: 'hidden',
          opacity: open ? 1 : 0,
          transition: 'max-height 0.38s cubic-bezier(.4,1.4,.6,1), opacity 0.28s',
          background: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {item.children.map(child => (
          <S.NavItem key={child.to} to={child.to} style={{ fontSize: 15, padding: '8px 10px', marginBottom: 0 }}>
            <span aria-hidden="true">{child.icon}</span>
            <span className="label">{child.label}</span>
          </S.NavItem>
        ))}
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile(768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fechar sidebar ao clicar em qualquer NavLink (mobile)
  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const navItems = useMemo(() => ([
    { to: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { to: '/assinantes', label: 'Assinantes', icon: <FaUsers /> },
    {
      label: 'Separação',
      icon: <FaCubes />,
      children: [
        { to: '/separacao', label: 'Pedidos para Separar', icon: <FaCubes /> },
        { to: '/shipping/labels', label: 'Histórico de Etiquetas', icon: <FaTicketAlt /> },
      ]
    },
    { to: '/produtos', label: 'Produtos', icon: <FaBox /> },
    { to: '/historico', label: 'Histórico', icon: <FaHistory /> },
    {
      label: 'Contatos',
      icon: <FaAddressBook />,
      children: [
        { to: '/email-composer', label: 'E-mail', icon: <FaEnvelope /> },
      ],
    },
    { to: '/demo-subscribers', label: 'Demo', icon: <FaTicketAlt /> },
  ]), []);

  const handleLogout = async () => {
    await logout();
  };

  // Função para obter iniciais do nome
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <S.Outer>
      {/* Mobile: Hamburger Button + Mobile Sidebar */}
      {isMobile ? (
        <>
          <HamburgerButton 
            isOpen={isSidebarOpen} 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          <MobileSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            onNavClick={handleNavClick}
          />
        </>
      ) : (
        /* Desktop: Sidebar normal (comportamento idêntico ao atual) */
        <S.Sidebar aria-label="Menu lateral">
          <S.Brand>
            <img src={logoUrl} alt="Logo Evolua" />
          </S.Brand>
          <S.Nav>
            {navItems.map(item => {
              if (item.children) {
                return (
                  <CollapsibleNavItemWrapper key={item.label} item={item} />
                );
              }
              return (
                <S.NavItem key={item.to} to={item.to}>
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </S.NavItem>
              );
            })}
          </S.Nav>
          <S.SidebarFooter>
            <S.UserName>{user?.name || 'Antonio Augusto'}</S.UserName>
            <S.Logout onClick={handleLogout}>
              <FaSignOutAlt />
              <span style={{ marginLeft: 8 }}>Sair</span>
            </S.Logout>
          </S.SidebarFooter>
        </S.Sidebar>
      )}

      <S.ContentCol>
        <S.Canvas>
          <S.TopInfoBar>
            <S.TimeCenter>
              <Clock />
            </S.TimeCenter>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <NotificationBell />
              <S.UserChip>
                <FaUserCircle />
                <S.UserChipText>{user?.name || 'Conectado'}</S.UserChipText>
                <S.UserChipInitials>{getInitials(user?.name || 'Conectado')}</S.UserChipInitials>
              </S.UserChip>
            </div>
          </S.TopInfoBar>
          <S.ContentScroll key={`${location.pathname}${location.search}${location.hash}`}>
            <Outlet />
          </S.ContentScroll>
        </S.Canvas>
      </S.ContentCol>
    </S.Outer>
  );
};

export default DashboardLayout;

