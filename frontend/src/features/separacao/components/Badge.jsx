import React from 'react';
import styled, { css } from 'styled-components';

const base = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: .01em;
  white-space: nowrap;
`;

const intentStyles = {
  neutral: css`
    background: #334155; /* slate-700 */
    color: #e5e7eb; /* slate-200 */
    border: 1px solid rgba(148,163,184,.25);
  `,
  info: css`
    background: #0ea5e9; /* sky-500 */
    color: #ffffff;
    border: 1px solid rgba(255,255,255,.15);
  `,
  warn: css`
    background: #f59e0b; /* amber-500 */
    color: #0b1220; /* dark text for contrast */
    border: 1px solid rgba(251,191,36,.25);
  `,
  danger: css`
    background: #e11d48; /* rose-600 */
    color: #ffffff;
    border: 1px solid rgba(255,255,255,.15);
  `,
  success: css`
    background: #10b981; /* emerald-500 */
    color: #ffffff;
    border: 1px solid rgba(255,255,255,.15);
  `,
};

const Pill = styled.span`
  ${base}
  ${props => intentStyles[props.$intent || 'neutral']}
  ${props => props.$clickable ? css`
    cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
    &:hover { transform: translateY(-1px); filter: brightness(1.03); box-shadow: 0 4px 12px rgba(0,0,0,.25); }
    &:active { transform: translateY(0); filter: brightness(0.98); }
  ` : ''}
`;

const Badge = ({ intent = 'neutral', clickable = false, children, ...rest }) => (
  <Pill $intent={intent} $clickable={clickable} {...rest}>{children}</Pill>
);

export default Badge;
