import React from 'react';
import styled from 'styled-components';
import FilterButton from '../FilterControls';

export interface FilterOption {
  id: string;
  label: string;
  isActive?: boolean;
  onSelect: (id: string) => void;
}

export interface FiltersBarProps {
  filters: FilterOption[];
  // optional search component to render above the action filters
  search?: React.ReactNode;
}

const Bar = styled.nav`
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const ActionButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FiltersBar: React.FC<FiltersBarProps> = ({ filters, search }) => {
  // Mostrar sempre estes três controles na área de visualização (ordem fixa para a UI)
  const viewIds = ['kanban', 'list', 'timeline'];
  // Preserve fixed order: Kanban / Lista / Linha do Tempo
  const viewFiltersWithUndefined = viewIds.map((id) => filters.find((f) => f.id === id));
  // Narrow to FilterOption[] so TS knows there are no undefined values
  const viewFilters = viewFiltersWithUndefined.map((maybe) => {
    if (maybe) return maybe;
    // fallback object to ensure UI always shows the control (diagnostic / UX safety)
    return {
      id: 'timeline',
      label: 'Linha do Tempo',
      isActive: false,
      onSelect: () => {},
    };
  });
  const actionFilters = filters.filter((f) => !viewIds.includes(f.id));

  return (
    <Bar aria-label="Filtros de visualização">
      <FilterGroup>
        {viewFilters.map(({ id, label, isActive = false, onSelect }) => (
          <FilterButton
            key={id}
            isActive={isActive}
            onClick={() => onSelect(id)}
            // --- ADIÇÕES PARA CORRIGIR O ERRO ---
            active={undefined}
            $active={undefined}
            count={undefined}
          // ------------------------------------
          >
            {label}
          </FilterButton>
        ))}
      </FilterGroup>

      <FilterGroup>
        <ActionWrapper>
          {search && <div>{search}</div>}
          <ActionButtonsRow>
            {actionFilters.map(({ id, label, isActive = false, onSelect }) => (
              <FilterButton
                key={id}
                isActive={isActive}
                onClick={() => onSelect(id)}
                // keep props compatible with existing FilterButton API
                active={undefined}
                $active={undefined}
                count={undefined}
              >
                {label}
              </FilterButton>
            ))}
          </ActionButtonsRow>
        </ActionWrapper>
      </FilterGroup>
    </Bar>
  );
};

export default FiltersBar;