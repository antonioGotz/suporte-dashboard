import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUsers, FaBox, FaCubes, FaSignOutAlt, FaBars, FaTimes, FaHistory, FaEnvelope, FaAddressBook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { NavLink } from 'react-router-dom';
import Clock from '../components/Clock.jsx';

const COLORS = {
  background: '#1A202C',
  sidebarBg: '#2D3748',
  cardBg: '#2D3748',
    primaryCiano: '#9dd9d2',
  textLight: '#E2E8F0',
  textMuted: '#A0AEC0',
  border: '#4A5568',
};

const DashboardContainer = styled.div` display: flex; min-height: 100vh; background-color: ${COLORS.background}; color: ${COLORS.textLight}; `;

// CORREÇÃO: Removida a barra '\' antes de '-250px'
const Sidebar = styled.nav` width: ${props => (props.$isOpen ? '250px' : '80px')}; background-color: ${COLORS.sidebarBg}; padding: 1.5rem 0; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 4px 0 10px rgba(0, 0, 0, 0.2); transition: width 0.3s ease-in-out; flex-shrink: 0; @media (max-width: 768px) { position: fixed; height: 100%; left: ${props => (props.$isOpen ? '0' : '-250px')}; z-index: 100; } `;

const SidebarHeader = styled.div` padding: 0 1.5rem 2rem; display: flex; align-items: center; justify-content: ${props => (props.$isOpen ? 'flex-start' : 'center')}; gap: 1rem; font-size: 1.5rem; font-weight: bold; color: ${COLORS.textLight}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; img { height: 40px; width: 40px; object-fit: contain; } @media (max-width: 768px) { justify-content: space-between; padding-right: ${props => (props.$isOpen ? '1.5rem' : '0')}; } `;
const NavLinks = styled.div` flex-grow: 1; `;
const StyledNavLink = styled(NavLink)` display: flex; align-items: center; padding: 0.8rem 1.5rem; gap: 1rem; color: ${COLORS.textMuted}; text-decoration: none; font-weight: 500; transition: all 0.2s ease; overflow: hidden; white-space: nowrap; &.active { color: ${COLORS.primaryCiano}; background-color: rgba(157, 217, 210, 0.1); border-left: 4px solid ${COLORS.primaryCiano}; padding-left: calc(1.5rem - 4px); } &:hover { color: ${COLORS.textLight}; background-color: rgba(157, 217, 210, 0.05); } span { opacity: ${props => (props.$sidebaropen ? '1' : '0')}; transition: opacity 0.2s ease; display: ${props => (props.$sidebaropen ? 'inline' : 'none')}; } `;
const UserSection = styled.div` padding: 1.5rem; border-top: 1px solid ${COLORS.border}; display: flex; align-items: center; justify-content: ${props => (props.$isOpen ? 'flex-start' : 'center')}; gap: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; img { width: 40px; height: 40px; border-radius: 50%; background-color: #555; } `;
const LogoutButton = styled.button` background-color: ${COLORS.primaryCiano}; color: ${COLORS.sidebarBg}; border: none; border-radius: 8px; padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; margin: 0 1.5rem 1.5rem; text-align: center; display: ${props => (props.$isOpen ? 'block' : 'none')}; width: ${props => (props.$isOpen ? 'auto' : '100%')}; &:hover { filter: brightness(0.9); transform: translateY(-2px); } ${props => !props.$isOpen && ` margin: 1.5rem auto; padding: 0.8rem; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; span { display: none; } `} `;
const MainContent = styled.div` flex-grow: 1; display: flex; flex-direction: column; `;
const Header = styled.header` background-color: ${COLORS.sidebarBg}; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); min-height: 70px; `;
const HeaderLeft = styled.div` display: flex; align-items: center; gap: 1rem; `;
const ToggleButton = styled.button` background: none; border: none; color: ${COLORS.textLight}; font-size: 1.5rem; cursor: pointer; @media (min-width: 769px) { display: block; } @media (max-width: 768px) { display: block; } `;
const HeaderRight = styled.div` display: flex; align-items: center; gap: 1rem; color: ${COLORS.textLight}; `;
const ContentArea = styled.main` flex-grow: 1; padding: 2rem; overflow-y: auto; `;
const Overlay = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 99; display: ${props => (props.$isOpen ? 'block' : 'none')}; @media (min-width: 769px) { display: none; } `;

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <DashboardContainer>
      <Overlay $isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />
      <Sidebar $isOpen={isSidebarOpen}>
        <SidebarHeader $isOpen={isSidebarOpen}>
          {isSidebarOpen ? (<> <img src="/logo.png" alt="Cevolua Logo" /> Cevolua. </>) : (<img src="/logo.png" alt="Cevolua Logo" />)}
        </SidebarHeader>
        <NavLinks>
          <StyledNavLink to="/dashboard" $sidebaropen={isSidebarOpen ? 1 : 0} end><FaHome /> <span>Dashboard</span></StyledNavLink>
          <StyledNavLink to="/assinantes" $sidebaropen={isSidebarOpen ? 1 : 0}><FaUsers /> <span>Assinantes</span></StyledNavLink>
          <StyledNavLink to="/separacao" $sidebaropen={isSidebarOpen ? 1 : 0}><FaCubes /> <span>Separação</span></StyledNavLink>
          <StyledNavLink to="/produtos" $sidebaropen={isSidebarOpen ? 1 : 0}><FaBox /> <span>Produtos</span></StyledNavLink>
          <StyledNavLink to="/email-composer" $sidebaropen={isSidebarOpen ? 1 : 0}><FaAddressBook /> <span>Contatos • E-mail</span></StyledNavLink>
          <StyledNavLink to="/historico" $sidebaropen={isSidebarOpen ? 1 : 0}><FaHistory /> <span>Histórico</span></StyledNavLink>
        </NavLinks>
        <UserSection $isOpen={isSidebarOpen}>
          <img src="https://via.placeholder.com/40" alt="User Avatar" />
          {isSidebarOpen && (<span>{user?.name || 'Antonio Augusto'}</span>)}
        </UserSection>
        <LogoutButton onClick={handleLogout} $isOpen={isSidebarOpen}>
          <FaSignOutAlt />
          {isSidebarOpen && <span>Sair</span>}
        </LogoutButton>
      </Sidebar>
      <MainContent>
        <Header>
          <HeaderLeft>
            <ToggleButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? <FaTimes /> : <FaBars />}</ToggleButton>
          </HeaderLeft>
          <HeaderRight>
            <Clock />
          </HeaderRight>
        </Header>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardLayout;