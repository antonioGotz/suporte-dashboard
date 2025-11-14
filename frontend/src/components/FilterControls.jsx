import React from 'react';
import styled from 'styled-components';

import { fadeUp } from './animations/motions.js';

export const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;

  > * {
    opacity: 0;
    animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  ${Array.from({ length: 12 }).map((_, index) => `
    > *:nth-child(${index + 1}) {
      animation-delay: ${0.05 * (index + 1)}s;
    }
  `).join('')}

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterCount = styled.span`
  background-color: var(--badge-bg, var(--border));
  color: ${({ $isActive }) => ($isActive ? 'var(--color-bg-dark)' : 'var(--color-primary)')};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  margin-left: 0.8rem;
  transition: all 0.3s ease-in-out;
`;

const HighlightBubble = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f87171, #ef4444);
  color: #fff8f8;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.45);
  pointer-events: none;
`;

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active', 'isActive', '$active', '$isActive', 'highlightCount', '$highlightCount'].includes(prop),
})`
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  background-color: ${({ $isActive }) => ($isActive ? 'var(--color-primary)' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? 'var(--color-bg-dark)' : 'var(--color-text-muted)')};
  border: 2px solid ${({ $isActive }) => ($isActive ? 'var(--color-primary)' : 'var(--border)')};
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  min-height: 40px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  position: relative;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-text-light);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--accent-d);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.9rem;
    min-height: 38px;
  }
`;

const FilterButton = ({ onClick, active, isActive, $active, count, highlightCount = 0, children, ...rest }) => {
  const computedIsActive = isActive ?? active ?? $active ?? false;
  const { type = 'button', ...sanitizedRest } = rest;

  return (
    <StyledButton onClick={onClick} $isActive={computedIsActive} type={type} {...sanitizedRest}>
      {highlightCount > 0 && <HighlightBubble>{highlightCount}</HighlightBubble>}
      {children}
      {typeof count === 'number' && <FilterCount $isActive={computedIsActive}>{count}</FilterCount>}
    </StyledButton>
  );
};

export default FilterButton;
