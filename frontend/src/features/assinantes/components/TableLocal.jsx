import styled from 'styled-components';

const TableLocal = styled.table`
  width: 100%;
  min-width: 780px;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--text);
  font-size: 0.95rem;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 4px);
  background-color: rgba(15, 23, 42, 0.45);
  overflow: hidden;

  thead tr {
    background: rgba(148, 163, 184, 0.08);
  }

  thead th:first-child {
    border-top-left-radius: calc(var(--radius) - 6px);
  }

  thead th:last-child {
    border-top-right-radius: calc(var(--radius) - 6px);
  }

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: calc(var(--radius) - 6px);
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: calc(var(--radius) - 6px);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export default TableLocal;

