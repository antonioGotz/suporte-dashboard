import React from 'react';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { TableContainer } from '../components/StandardTable';
import { fadeIn, fadeUp } from '../components/animations/motions.js';

const PageContainer = styled.div`
    animation: ${fadeIn} 0.6s ease-out;
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
`;

const HeaderTitleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    > * {
        opacity: 0;
        animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    > *:nth-child(1) { animation-delay: 0.08s; }
    > *:nth-child(2) { animation-delay: 0.16s; }
`;

const RightHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: flex-end;

    > * {
        opacity: 0;
        animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    > *:nth-child(1) { animation-delay: 0.2s; }
    > *:nth-child(2) { animation-delay: 0.28s; }
`;
const AddButton = styled(Link)` background-color: #9dd9d2; color: #1a202c; border-radius: 8px; padding: 0.8rem 1.5rem; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 8px; `;
export const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

// ALTERAÇÃO 1: Adicionamos a prop "transparent" aqui, com valor padrão "false"
const ListPageLayout = ({ title, description, addButtonLink, addButtonText, filters, headerRight = null, children, pagination, transparent = false }) => {
    const location = useLocation();
    // Lista de rotas nas quais queremos esconder o headerRight (barra de pesquisa)
    const hideHeaderFor = [];
    const shouldHideHeaderRight = hideHeaderFor.some(r => location.pathname.startsWith(r));

    return (
        <PageContainer>
            <PageHeader>
                <HeaderTitleGroup>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </HeaderTitleGroup>
                <RightHeader>
                    {!shouldHideHeaderRight && headerRight}
                    {addButtonLink && (
                        <AddButton to={addButtonLink}><FaPlus /> {addButtonText}</AddButton>
                    )}
                </RightHeader>
            </PageHeader>

            {filters}

            {/* Lógica para renderizar com ou sem o container de fundo */}
            {transparent ? (
                <>{children}</> // Se for transparente, renderiza o conteúdo diretamente
            ) : (
                <TableContainer> {/* Senão, usa o container padrão com fundo */}
                    {children}
                </TableContainer>
            )}

            {pagination}
        </PageContainer>
    );
};

export default ListPageLayout;