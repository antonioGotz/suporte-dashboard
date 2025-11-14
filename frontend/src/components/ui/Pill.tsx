import React from 'react';
import styled, { css } from 'styled-components';

export type PillVariant = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: PillVariant;
  icon?: React.ReactNode;
  count?: number;
  isActive?: boolean;
}

const variantTokens: Record<PillVariant, { bg: string; fg: string; hover: string; pressed: string; focus: string }> = {
  primary: {
    bg: 'var(--color-primary, #3b82f6)',
    fg: 'var(--color-on-primary, #0b1220)',
    hover: 'var(--color-primary-hover, #60a5fa)',
    pressed: 'var(--color-primary-pressed, #2563eb)',
    focus: 'var(--color-primary, #3b82f6)',
  },
  accent: {
    bg: 'var(--color-accent, #8b5cf6)',
    fg: 'var(--color-on-accent, #0b1026)',
    hover: 'var(--color-accent-hover, #a78bfa)',
    pressed: 'var(--color-accent-pressed, #7c3aed)',
    focus: 'var(--color-accent, #8b5cf6)',
  },
  success: {
    bg: 'var(--color-success, #22c55e)',
    fg: 'var(--color-on-success, #04210f)',
    hover: 'var(--color-success-hover, #4ade80)',
    pressed: 'var(--color-success-pressed, #16a34a)',
    focus: 'var(--color-success, #22c55e)',
  },
  warning: {
    bg: 'var(--color-warning, #f59e0b)',
    fg: 'var(--color-on-warning, #291200)',
    hover: 'var(--color-warning-hover, #fbbf24)',
    pressed: 'var(--color-warning-pressed, #d97706)',
    focus: 'var(--color-warning, #f59e0b)',
  },
  danger: {
    bg: 'var(--color-danger, #ef4444)',
    fg: 'var(--color-on-danger, #250202)',
    hover: 'var(--color-danger-hover, #f87171)',
    pressed: 'var(--color-danger-pressed, #dc2626)',
    focus: 'var(--color-danger, #ef4444)',
  },
  neutral: {
    bg: 'var(--color-surface2, #1f2937)',
    fg: 'var(--color-text, #edf2f7)',
    hover: 'var(--color-surface2-hover, #273549)',
    pressed: 'var(--color-surface2-pressed, #1b2433)',
    focus: 'var(--color-accent, #8b5cf6)',
  },
};

const StyledPill = styled.button<{ $variant: PillVariant; $isActive: boolean }>`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 36px;
  padding: 0 1rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;

  ${({ $variant, $isActive }) => {
    const tokens = variantTokens[$variant];
    return css`
      color: ${tokens.fg};
      background: ${$isActive ? tokens.pressed : tokens.bg};
      box-shadow: ${$isActive ? '0 0 0 1px rgba(255,255,255,0.12)' : 'none'};

      &:hover {
        background: ${tokens.hover};
        transform: translateY(-1px);
      }

      &:active {
        background: ${tokens.pressed};
        transform: translateY(0);
      }

      &:focus-visible {
        outline: 2px solid ${tokens.focus};
        outline-offset: 2px;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.45;
        transform: none;
      }
    `;
  }}
`;

const Content = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const Counter = styled.span`
  font-weight: 700;
  font-size: 0.7rem;
  padding: 0 0.35rem;
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.16);
`;

export const Pill: React.FC<PillProps> = ({
  label,
  variant = 'neutral',
  icon,
  count,
  isActive = false,
  type = 'button',
  ...rest
}) => (
  <StyledPill
    type={type}
    $variant={variant}
    $isActive={isActive}
    aria-pressed={isActive}
    {...rest}
  >
    <Content>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
      {typeof count === 'number' && <Counter>{count}</Counter>}
    </Content>
  </StyledPill>
);

export default Pill;
