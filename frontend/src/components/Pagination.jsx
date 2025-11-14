// ARQUIVO: src/components/Pagination.jsx (VERSÃO FINAL COM CORREÇÃO)

import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding-bottom: 1rem;
`;

// CORREÇÃO AQUI: Usa props.$active para definir os estilos
const PageButton = styled.button`
  background-color: ${props => props.$active ? 'var(--color-primary-ciano)' : '#2d3748'};
  color: ${props => props.$active ? 'var(--color-card-bg)' : 'var(--color-text-light)'};
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: var(--color-primary-ciano);
    color: var(--color-text-light);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  margin: 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const pageLimit = 5;
    let startPage, endPage;

    if (totalPages <= pageLimit) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= Math.ceil(pageLimit / 2)) {
            startPage = 1;
            endPage = pageLimit;
        } else if (currentPage + Math.floor(pageLimit / 2) >= totalPages) {
            startPage = totalPages - pageLimit + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - Math.floor(pageLimit / 2);
            endPage = currentPage + Math.floor(pageLimit / 2);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <PaginationContainer>
            <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
            </PageButton>

            {startPage > 1 && <PageButton onClick={() => onPageChange(1)}>1</PageButton>}
            {startPage > 2 && <PaginationInfo>...</PaginationInfo>}

            {pages.map(page => (
                // CORREÇÃO AQUI: Passa a prop como $active
                <PageButton key={`page-${page}`} $active={page === currentPage} onClick={() => onPageChange(page)}>
                    {page}
                </PageButton>
            ))}

            {endPage < totalPages - 1 && <PaginationInfo>...</PaginationInfo>}
            {endPage < totalPages && <PageButton onClick={() => onPageChange(totalPages)}>{totalPages}</PageButton>}

            <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Próxima
            </PageButton>
        </PaginationContainer>
    );
};

export default Pagination;

