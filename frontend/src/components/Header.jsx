// FICHEIRO: src/components/Header.jsx
// OBJETIVO: Criar o cabeçalho superior com breadcrumbs, pesquisa e perfil do utilizador.

import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext.jsx';
import Breadcrumbs from './Breadcrumbs'; // Reutilizando o seu componente de breadcrumbs
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';

// O contentor principal do cabeçalho.
const HeaderContainer = styled.header`
  height: 80px;
  padding: 0 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-bg-dark);
  flex-shrink: 0;
`;

// Secção esquerda, onde ficam os breadcrumbs.
const HeaderLeft = styled.div``;

// Secção direita, que agrupa a pesquisa, notificações e perfil.
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

// A barra de pesquisa com o ícone.
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--color-bg-light);
  padding: 8px 16px;
  border-radius: 10px;
  width: 300px;
  
  svg {
    color: var(--color-text-muted);
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-light);
  font-size: 1rem;
  margin-left: 10px;
  width: 100%;

  &::placeholder {
    color: var(--color-text-muted);
  }
`;

// Botão genérico para ícones.
const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-text-light);
  }
`;

// O contentor do perfil do utilizador.
const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

// O avatar circular com as iniciais do utilizador.
const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
`;

// Agrupa o nome e a função do utilizador.
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.span`
  font-weight: 600;
  color: var(--color-text-light);
`;

const UserRole = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-muted);
`;

const Header = () => {
  const { user } = useAuth();

  // Função para extrair as iniciais do nome do utilizador.
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <Breadcrumbs />
      </HeaderLeft>
      <HeaderRight>
        <SearchBar>
          <FiSearch />
          <SearchInput type="text" placeholder="Procurar..." />
        </SearchBar>
        <IconButton>
          <FiBell />
        </IconButton>
        <UserProfile>
          <UserAvatar>{getInitials(user?.name)}</UserAvatar>
          <UserInfo>
            <UserName>{user ? user.name : 'Administrador'}</UserName>
            <UserRole>Admin</UserRole>
          </UserInfo>
          <FiChevronDown style={{ color: 'var(--color-text-muted)' }} />
        </UserProfile>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;