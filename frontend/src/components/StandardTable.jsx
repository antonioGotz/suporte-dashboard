import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import styled, { css } from 'styled-components';

import { fadeUp } from './animations/motions.js';
// Cabeçalho sortável para uso em tabelas
export const SortableHeader = styled.th`
  padding: 0.9rem 1.2rem;
  text-align: left;
  color: var(--color-text-light, #e5e7eb);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: linear-gradient(180deg, rgba(148,163,184,.12), rgba(148,163,184,.08));
  border-bottom: 1px solid var(--border, rgba(148,163,184,.22));
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background 0.18s, color 0.18s;
  &:hover, &:focus-visible {
    background: rgba(139,92,246,0.10);
    color: var(--color-primary, #06b6d4);
    outline: 2px solid var(--color-primary, #06b6d4);
    outline-offset: 2px;
  }
  .sort-icon {
    margin-left: 0.5em;
    font-size: 1.1em;
    vertical-align: middle;
    color: inherit;
    transition: color 0.18s;
  }
`;


export const TableContainer = styled.div`
  width: 100%;
  background: var(--card, #0f172a);
  border-radius: 16px;
  border: 1px solid var(--border, rgba(148,163,184,.18));
  box-shadow: 0 8px 28px rgba(0,0,0,.25);
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  /* Usar layout auto para permitir que a coluna de ações expanda quando necessário */
  table-layout: auto;
`;

export const Th = styled.th`
  padding: 0.9rem 1.2rem;
  text-align: left;
  color: var(--color-text-light, #e5e7eb);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: linear-gradient(180deg, rgba(148,163,184,.12), rgba(148,163,184,.08));
  border-bottom: 1px solid var(--border, rgba(148,163,184,.22));
  &.acoes { text-align: center; }
  &.assinante { width: 26%; }
  &.data { text-align: center; width: 140px; }
`;

export const Td = styled.td`
  padding: 0.9rem 1.2rem;
  color: var(--color-text-light, #e5e7eb);
  font-size: 0.92rem;
  word-break: break-word;
  overflow-wrap: break-word;
  border-bottom: 1px solid var(--border, rgba(148,163,184,.14));
  /* permitir quebra automática para evitar forçar overflow do layout */
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  &.acoes {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: none;
    min-width: 220px;
    overflow: visible;
    text-overflow: initial;
    white-space: normal;
    width: auto;
    padding-right: 0.5rem;
  }
  &.assinante {
    max-width: 320px;
    width: 26%;
    white-space: normal;
    text-overflow: initial;
    overflow: visible;
  }
  &.data { text-align: center; }
`;

export const Tr = styled.tr`
  thead & {
    background: transparent;
  }
  /* zebra mais suave em dois tons */
  tbody &:nth-child(odd) {
    background-color: rgba(148,163,184,.06);
  }
  tbody &:nth-child(even) {
    background-color: rgba(148,163,184,.12);
  }
  tbody & {
    opacity: 0;
    animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  ${Array.from({ length: 20 }).map((_, index) => `
    tbody &:nth-child(${index + 1}) {
      animation-delay: ${0.08 * (index + 1)}s;
    }
  `).join('')}
  /* hover com feedback mais evidente */
  tbody &:hover {
    background-color: rgba(157,217,210,.22); /* mistura do brand mais visível */
    transition: background-color .18s ease, transform .08s ease, color .18s ease;
  }
  tbody &:hover a {
    text-decoration: underline;
    color: var(--color-primary, #9dd9d2);
  }
`;
