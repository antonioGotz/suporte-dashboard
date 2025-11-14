import { FaInfoCircle, FaTimes, FaEye } from 'react-icons/fa';
import styled, { css } from 'styled-components';

// Container para agrupar botões de ação
export const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  width: 100%;
  min-width: 0;
`;

// Variante de botão pequeno para ações
const smallButton = css`
  height: 32px;
  padding: 0.13rem 0.7rem 0.13rem 0.5rem;
  font-size: 0.87rem;
  border-radius: 12px;
  min-width: 0;
  font-weight: 600;
  svg { margin-right: 0.5em; font-size: 1.1em; }
  @media (max-width: 768px) {
    font-size: 0.81rem;
    padding: 0.13rem 0.5rem 0.13rem 0.4rem;
    border-radius: 10px;
  }
`;

const baseStyle = css`
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.11rem 0.36rem;
  min-width: 62px;
  font-size: 0.68rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  white-space: nowrap;
  border: 2px solid var(--border);
  color: var(--color-bg-dark);
  background-color: var(--color-primary);
  &:hover { border-color: var(--color-primary); transform: translateY(-2px); }
  &:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  @media (max-width: 1200px) {
    font-size: 0.62rem;
    padding: 0.09rem 0.22rem;
    min-width: 48px;
    height: 20px;
  }
  @media (max-width: 768px) {
    font-size: 0.59rem;
    padding: 0.07rem 0.16rem;
    min-width: 38px;
    height: 18px;
  }
`;

export const ApproveButton = styled.button`
  ${baseStyle}
  background: transparent;
  color: #34d399;
  border-color: #34d399;
  &:hover { background: rgba(52, 211, 153, .12); }
`;

export const ReactivateButton = styled.button`
  ${baseStyle}
  background: transparent;
  color: #34d399;
  border-color: #34d399;
  &:hover {
    background: rgba(52, 211, 153, .12);
    color: #fff;
  }
`;

export const SuspendButton = styled.button`
  ${baseStyle}
  background: transparent;
  color: #f59e0b;
  border-color: #f59e0b;
  &:hover {
    background: rgba(245, 158, 11, .12);
    color: #fff;
  }
`;

export const CancelButton = styled.button`
  ${baseStyle}
  background: transparent;
  color: #ef4444;
  border-color: #ef4444;
  &:hover {
    background: rgba(239, 68, 68, .12);
    color: #fff;
  }
`;
