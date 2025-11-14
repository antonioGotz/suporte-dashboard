// FICHEIRO: src/components/Sidebar.jsx
// OBJETIVO: Criar o menu de navegação lateral com o novo design, cor e efeitos de hover.

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png'; // Verifique se o caminho para o seu logo está correto
import {
  FiGrid, FiUsers, FiPackage,
  FiClipboard, FiClock, FiLogOut, FiMail
} from 'react-icons/fi'; // Usando ícones mais modernos (Feather Icons)

// Estilo do contentor principal da Sidebar.
// Usa a nova cor de fundo que você pediu e os cantos arredondados.
const SidebarContainer = styled.aside`
  width: 260px;
  background-color: var(--color-sidebar-bg); /* NOVA COR APLICADA AQUI */
  height: calc(100vh - 2rem);
  margin: 1rem;
  margin-right: 0;
  border-radius: 16px; /* Cantos arredondados */
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 1rem 0;
`;

const LogoImage = styled.img`
  width: 150px;
  max-width: 100%;
`;

const NavList = styled.nav`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-radius: 10px;
  color: var(--color-text-muted);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  svg { margin-right: 1rem; font-size: 1.1rem; }
  &:hover { color: var(--color-text-light); background: rgba(255,255,255,0.02); }
`;

const SubNav = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.6rem;
  margin-top: 6px;
  gap: 6px;
`;

const SubNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
  &:hover { color: var(--color-text-light); background: rgba(255,255,255,0.02); }
  &.active { color: var(--color-text-light); background: rgba(157, 217, 210, 0.08); border-left: 3px solid var(--color-primary); padding-left: calc(1.5rem - 3px); }
`;

// Estilo de cada item do menu.
const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-radius: 10px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  /* A transição suave que você pediu. Aplica-se a todas as propriedades que mudam. */
  transition: all 0.3s ease-in-out;
  font-size: 1rem;

  svg {
    margin-right: 1rem;
    font-size: 1.2rem;
  }

  /* EFEITO HOVER INVERTIDO: Ao passar o rato, o fundo fica com o gradiente do link ativo. */
  &:hover {
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
    color: var(--color-text-light);
  }

  /* Estilo do link ATIVO, que tem o gradiente e uma sombra. */
  &.active {
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
    color: var(--color-text-light);
    font-weight: 600;
    box-shadow: 0 4px 15px -5px var(--color-primary);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 18px;
  border-radius: 10px;
  color: var(--color-text-muted);
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-top: auto; /* Empurra o botão para o fundo da sidebar */
  transition: color 0.3s ease-in-out; /* Transição suave apenas na cor */

  svg {
    margin-right: 1rem;
    font-size: 1.2rem;
  }

  &:hover {
    color: var(--color-red-danger); /* Muda a cor para vermelho ao passar o rato */
  }
`;

const Sidebar = () => {
  const { logout } = useAuth();
  const [contactOpen, setContactOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage src={logo} alt="Logo Evolua" />
      </LogoContainer>
      <NavList>
        <StyledNavLink to="/dashboard"><FiGrid /> Dashboard</StyledNavLink>

        {/* Grupo 'Contato' com submenu 'Email' */}
        <GroupTitle onClick={() => setContactOpen((s) => !s)}>
          <FiMail /> <span>Contato</span>
        </GroupTitle>
        {contactOpen && (
          <SubNav>
            <SubNavLink to="/email-composer"><FiMail /> <span>Email</span></SubNavLink>
          </SubNav>
        )}

        <StyledNavLink to="/assinantes"><FiUsers /> Assinantes</StyledNavLink>
        <StyledNavLink to="/produtos"><FiPackage /> Produtos</StyledNavLink>
        <StyledNavLink to="/separacao"><FiClipboard /> Separação</StyledNavLink>
        <StyledNavLink to="/historico"><FiClock /> Histórico</StyledNavLink>
      </NavList>
      <LogoutButton onClick={handleLogout}>
        <FiLogOut /> Sair
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;