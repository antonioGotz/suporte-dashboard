import React from 'react';
import FilterButton, { FilterContainer } from '../../../components/FilterControls.jsx';

/**
 * Componente reutilizável para barra de filtros com contadores globais.
 * Recebe:
 * - filters: array de objetos { key, label }
 * - counts: objeto { [key]: number }
 * - activeFilter: string
 * - onFilterClick: function(key)
 */
export default function FilterBar({ filters, counts, activeFilter, onFilterClick }) {
  return (
    <FilterContainer>
      {filters.map(({ key, label }) => (
        <FilterButton
          key={key}
          isActive={activeFilter === key}
          onClick={() => onFilterClick(key)}
          count={counts[key] ?? 0}
          highlightCount={key === 'solicitacoes' ? (counts[key] ?? 0) : 0}
        >
          {label}
        </FilterButton>
      ))}
    </FilterContainer>
  );
}
