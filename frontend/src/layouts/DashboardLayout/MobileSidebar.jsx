import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaBox, FaCubes, FaSignOutAlt, FaHistory, FaTicketAlt, FaEnvelope, FaAddressBook, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import logoUrl from '../../assets/logo.png';
import breakpoints from '../../styles/breakpoints';
import * as S from './DashboardLayout.styles';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.25s ease, visibility 0.25s ease;
  backdrop-filter: blur(2px);

  /* Apenas em mobile */
  @media (min-width: ${breakpoints.mobile}px) {
    display: none;
  }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: var(--color-sidebar-bg);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(0, 0, 0, 0.25);
  z-index: 999;
  display: flex;
  flex-direction: column;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s cubic-bezier(0.4, 1.4, 0.6, 1);
  overflow: hidden;

  /* Apenas em mobile */
  @media (min-width: ${breakpoints.mobile}px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.1s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid rgba(56, 178, 172, 0.6);
    outline-offset: 2px;
  }
`;

const MobileNavItem = styled(NavLink)`
  --padX: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 10px var(--padX);
  border-radius: 14px;
  color: var(--color-text-light);
  opacity: .9;
  transition: background .15s ease, opacity .15s ease, color .15s ease;
  margin-bottom: 0;
  text-decoration: none;
  
  &:hover { 
    background: rgba(255,255,255,0.06); 
    opacity: 1; 
  }
  
  &.active {
    background: rgba(56,178,172,0.16);
    color: var(--color-text-light);
    box-shadow: inset 0 0 0 1px rgba(56,178,172,0.28);
  }
  
  .label { 
    font-weight: 600; 
  }
`;

const CollapsibleNavItem = styled.div`
  --padX: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 10px var(--padX);
  border-radius: 14px;
  color: var(--color-text-light);
  opacity: 0.95;
  cursor: pointer;
  user-select: none;
  position: relative;
  margin-bottom: 0;
  transition: background .15s ease, opacity .15s ease;
  
  &:hover {
    background: rgba(255,255,255,0.06);
    opacity: 1;
  }
  
  .label { 
    font-weight: 600; 
  }
`;

const CollapsibleContent = styled.div`
  margin-left: 24px;
  margin-top: 0;
  margin-bottom: 0;
  max-height: ${props => props.isOpen ? '200px' : '0'};
  overflow: hidden;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: max-height 0.38s cubic-bezier(.4,1.4,.6,1), opacity 0.28s;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChevronIcon = styled.span`
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%) ${props => props.isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: transform 0.28s cubic-bezier(.4,1.4,.6,1);
  opacity: 0.7;
  font-size: 18px;
  pointer-events: none;
  display: flex;
  align-items: center;
  height: 18px;
`;

/**
 * Sidebar mobile com overlay e animações
 * 
 * @param {boolean} isOpen - Estado se a sidebar está aberta
 * @param {function} onClose - Função para fechar a sidebar
 * @param {function} onNavClick - Função chamada ao clicar em um NavLink (fecha sidebar)
 */
const MobileSidebar = ({ isOpen, onClose, onNavClick }) => {
  const { logout, user } = useAuth();

  // Fechar sidebar ao pressionar ESC
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevenir scroll do body quando sidebar está aberta
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
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
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onClose} aria-hidden="true" />
      <SidebarContainer isOpen={isOpen} aria-label="Menu lateral mobile">
        <CloseButton
          onClick={onClose}
          aria-label="Fechar menu"
          type="button"
        >
          <FaTimes />
        </CloseButton>
        
        <S.Brand>
          <img src={logoUrl} alt="Logo Evolua" />
        </S.Brand>
        
        <S.Nav>
          {navItems.map((item, index) => {
            if (item.children) {
              // Componente colapsável precisa de estado próprio
              return <CollapsibleNavItemWrapper 
                key={item.label} 
                item={item} 
                onNavClick={onNavClick}
              />;
            }
            return (
              <MobileNavItem 
                key={item.to} 
                to={item.to}
                onClick={onNavClick}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span className="label">{item.label}</span>
              </MobileNavItem>
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
      </SidebarContainer>
    </>
  );
};

// Componente auxiliar para itens colapsáveis (precisa de estado próprio)
const CollapsibleNavItemWrapper = ({ item, onNavClick }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div key={item.label} style={{ marginBottom: 0 }}>
      <CollapsibleNavItem
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span aria-hidden="true">{item.icon}</span>
        <span className="label">{item.label}</span>
        <ChevronIcon isOpen={open}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ChevronIcon>
      </CollapsibleNavItem>
      <CollapsibleContent isOpen={open}>
        {item.children.map(child => (
          <MobileNavItem 
            key={child.to} 
            to={child.to}
            onClick={onNavClick}
            style={{ fontSize: 15, padding: '8px 10px', marginBottom: 0 }}
          >
            <span aria-hidden="true">{child.icon}</span>
            <span className="label">{child.label}</span>
          </MobileNavItem>
        ))}
      </CollapsibleContent>
    </div>
  );
};

export default MobileSidebar;

