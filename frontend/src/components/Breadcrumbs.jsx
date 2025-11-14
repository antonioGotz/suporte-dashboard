// ARQUIVO: src/components/Breadcrumbs.jsx
// TÍTULO: Componente de Navegação Breadcrumbs
// FUNÇÃO: Mostra o caminho da página atual de forma hierárquica.

import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const BreadcrumbsContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
`;

const CrumbLink = styled(Link)`
  color: var(--color-text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-primary-ciano);
  }
`;

const CrumbText = styled.span`
  color: var(--color-text-light);
  font-weight: 500;
`;

const Separator = styled(FaChevronRight)`
  font-size: 0.75rem;
`;

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Mapeia nomes de rota para nomes mais amigáveis
    const nameMap = {
        'dashboard': 'Dashboard',
        'assinantes': 'Assinantes',
        'novo': 'Adicionar Novo',
        'produtos': 'Produtos',
        'estoque': 'Estoque',
        'separacao': 'Separação'
    };

    // Se estivermos na raiz do dashboard, não mostramos nada.
    if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
        return null;
    }

    return (
        <BreadcrumbsContainer aria-label="breadcrumb">
            <CrumbLink to="/dashboard">
                <FaHome />
                Dashboard
            </CrumbLink>

            {pathnames.slice(1).length > 0 && <Separator />}

            {pathnames.slice(1).map((value, index) => { // Usamos slice(1) para pular 'dashboard'
                const fullPath = `/${pathnames.slice(0, index + 2).join('/')}`;
                const isLast = index === pathnames.slice(1).length - 1;
                const displayName = nameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

                return isLast ? (
                    <CrumbText key={fullPath}>{displayName}</CrumbText>
                ) : (
                    <React.Fragment key={fullPath}>
                        <CrumbLink to={fullPath}>{displayName}</CrumbLink>
                        <Separator />
                    </React.Fragment>
                );
            })}
        </BreadcrumbsContainer>
    );
};

export default Breadcrumbs;