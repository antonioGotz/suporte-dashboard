import React, { useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { createPortal } from "react-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-18px) translateX(8px) scale(0.985); }
  60% { opacity: 1; transform: translateY(-6px) translateX(2px) scale(1.01); }
  to { opacity: 1; transform: translateY(0) translateX(0) scale(1); }
`;
const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-12px) scale(0.985); }
`;

const leftSweep = keyframes`
  0% { transform: translateX(-12px); opacity: 0; }
  60% { transform: translateX(6px); opacity: 1; }
  100% { transform: translateX(0); opacity: 1; }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 32px;
  right: 32px;
  /* Elevado para garantir que toasts fiquem à frente de outros elementos */
  z-index: 2147483647;
  min-width: 260px;
  max-width: 420px;
  background: linear-gradient(180deg, rgba(25,35,46,0.96), rgba(17,24,39,0.94));
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 44px rgba(3,7,18,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
  padding: 18px 22px 18px 70px; /* espaço para stripe e ícone */
  font-size: 1.04rem;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  overflow: visible;
  animation: ${fadeIn} 0.68s cubic-bezier(.22,.61,.36,1) both;
  transition: opacity 0.45s ease, transform 0.45s ease;
  &.toast-exit {
    animation: ${fadeOut} 0.5s cubic-bezier(.22,.61,.36,1) both;
  }

  /* faixa colorida curva à esquerda */
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 8px;
    bottom: 8px;
    width: 12px;
    border-radius: 12px 0 0 12px;
    background: linear-gradient(180deg, rgba(34,197,94,1), rgba(16,185,129,0.9));
    box-shadow: 0 6px 20px rgba(34,197,94,0.18);
    animation: ${leftSweep} 0.6s cubic-bezier(.22,.61,.36,1) both;
  }
`;

const ToastIcon = styled.div`
  font-size: 1.6rem;
  margin-top: 0;
  margin-left: -44px;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  background: rgba(0,0,0,0.12);
  box-shadow: 0 6px 18px rgba(2,6,10,0.55);
  color: #fff;
`;
const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const ToastTitle = styled.div`
  font-weight: 700;
  font-size: 1.04rem;
  margin-bottom: 2px;
  color: ${({ type }) =>
    type === "success" ? "#d1fae5" : type === "error" ? "#fee2e2" : "#d1fae5"};
  text-shadow: 0 2px 6px rgba(0,0,0,0.45);
`;
const ToastMessage = styled.div`
  font-size: 0.98rem;
  color: #e5e7eb;
  word-break: break-word;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: 0;
  color: #cbd5e1;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 6px;
  &:hover { color: #fff; background: rgba(255,255,255,0.08); }
`;

const icons = {
  success: <span aria-label="Sucesso" role="img">✓</span>,
  error: <span aria-label="Erro" role="img">⚠</span>,
  info: <span aria-label="Info" role="img">ℹ</span>,
  warning: <span aria-label="Atenção" role="img">!</span>,
};

function parseToastMessage(message) {
  // Se a mensagem for estruturada, pode ser { title, body, exiting }
  if (typeof message === 'object' && message !== null) {
    return message;
  }
  // Se for string, tenta separar título e corpo por ":"
  if (typeof message === 'string' && message.includes(':')) {
    const [title, ...rest] = message.split(':');
    return { title: title.trim(), body: rest.join(':').trim() };
  }
  return { title: '', body: message };
}

const Toast = ({ message, type = "info", exit = false }) => {
  const parsed = parseToastMessage(message);
  const { title, body } = parsed;
  const isExiting = exit === true || (typeof message === 'object' && message && message.exiting === true);
  const onClose = typeof exit === 'function' ? exit : () => {};
  const portalTarget = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const existing = document.getElementById('toast-root');
    if (existing) return existing;
    const el = document.createElement('div');
    el.id = 'toast-root';
    // Usamos um portal dedicado para evitar que contêineres com overflow escondam o toast.
    document.body.appendChild(el);
    return el;
  }, []);
  useEffect(() => {
    if (typeof exit !== 'function') return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        try { onClose(); } catch {}
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [exit, onClose]);
  if (!portalTarget) return null;
  return createPortal(
    (
      <ToastContainer type={type} className={isExiting ? 'toast-exit' : ''} role="status" aria-live="polite">
        <ToastIcon>{icons[type] || icons.info}</ToastIcon>
        <ToastContent>
          {title && <ToastTitle type={type}>{title}</ToastTitle>}
          <ToastMessage>{body}</ToastMessage>
        </ToastContent>
        <CloseBtn onClick={onClose} aria-label="Fechar alerta" title="Fechar">×</CloseBtn>
      </ToastContainer>
    ),
    portalTarget
  );
};

export default Toast;

