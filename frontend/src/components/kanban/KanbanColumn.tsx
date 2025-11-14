import React from 'react';
import styled from 'styled-components';
import KanbanCard, { KanbanCardProps } from './KanbanCard';

export interface KanbanColumnProps {
  title: string;
  count?: number;
  emptyState?: React.ReactNode;
  cards?: KanbanCardProps[];
  recent?: boolean;
}

/* Escopo para o reset do GlobalStyles */
const Column = styled.section.attrs({ className: 'kanban-scope' })`
  background: var(--color-surface, #111827);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
  max-height: calc(100vh - 280px);
  overflow: hidden;
  border: 1px solid var(--color-border, #374151);
  width: 100%;
  max-width: 100%;
`;

const ColumnHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.25rem;
  flex-shrink: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text, #f8fafc);
`;

const CountBadge = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted, #94a3b8);
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 0.25rem 0.5rem;
  min-width: 0;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--color-surface2, #1f2937);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-border, #374151);
  }
`;

const EmptyStateBox = styled.div`
  border-radius: 8px;
  padding: 2rem 1rem;
  font-size: 0.875rem;
  color: var(--color-muted, #94a3b8);
  text-align: center;
`;

const Chip = styled.span`
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 9px;
  border: 1px solid rgba(148,163,184,.35);
  background: rgba(148,163,184,.12);
  color: #cbd5e1;
  font-weight: 700;
  font-size: 0.7rem;
`;

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  count = 0,
  cards = [],
  emptyState,
  recent = false,
}) => (
  <Column aria-label={title}>
    <ColumnHeader>
      <Title>{title} {recent && <Chip>Recentes</Chip>}</Title>
      <CountBadge>({count})</CountBadge>
    </ColumnHeader>

    <CardsContainer>
      {cards.length > 0 ? (
        cards.map((card) => <KanbanCard key={card.id} {...card} />)
      ) : (
        <EmptyStateBox>
          {emptyState ?? 'Nenhum item nesta coluna.'}
        </EmptyStateBox>
      )}
    </CardsContainer>
  </Column>
);

export default KanbanColumn;
