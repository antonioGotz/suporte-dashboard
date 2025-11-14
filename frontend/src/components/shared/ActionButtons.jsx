import React from 'react';
import styled, { css } from 'styled-components';
import { FaEye, FaPauseCircle, FaTimes, FaPlayCircle } from 'react-icons/fa';

const ButtonGroup = styled.div.withConfig({
  shouldForwardProp: (prop) => !['align', 'compactOnNarrow'].includes(prop),
})`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: ${({ align }) => align === 'end' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'};
  flex-wrap: ${({ compactOnNarrow }) => compactOnNarrow ? 'wrap' : 'nowrap'};
  @media (max-width: 1200px) {
    flex-wrap: wrap;
  }
`;

const hues = {
  primary: { bg: 'var(--color-primary, #06b6d4)', hover: '#0891b2', textOn: '#fff' },
  warning: { bg: '#fbbf24', hover: '#f59e42', textOn: '#1e293b' },
  danger:  { bg: '#ef4444', hover: '#dc2626', textOn: '#fff' },
  success: { bg: '#22c55e', hover: '#16a34a', textOn: '#fff' },
};

const solidVariant = (variant) => {
  const v = hues[variant] || hues.primary;
  return css`
    background: ${v.bg};
    color: ${v.textOn};
    &:hover, &:focus-visible { background: ${v.hover}; }
  `;
};

const softVariant = (variant) => {
  const v = hues[variant] || hues.primary;
  return css`
    background: color-mix(in srgb, ${v.bg} 12%, transparent);
    color: color-mix(in srgb, ${v.bg} 80%, #0f172a);
    border: 1px solid color-mix(in srgb, ${v.bg} 35%, transparent);
    &:hover, &:focus-visible {
      background: color-mix(in srgb, ${v.bg} 18%, transparent);
      border-color: color-mix(in srgb, ${v.bg} 50%, transparent);
    }
  `;
};

export const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['size', 'variant', 'tone', 'pill'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  height: ${({ size }) => size === 'xs' ? '24px' : size === 'sm' ? '28px' : '36px'};
  padding: ${({ size }) => size === 'xs' ? '0 8px' : '0 10px'};
  border-radius: ${({ pill }) => pill ? '9999px' : '10px'};
  font-weight: 600;
  font-size: ${({ size }) => size === 'xs' ? '0.78rem' : size === 'sm' ? '0.86rem' : '0.95rem'};
  border: ${({ tone }) => tone === 'soft' ? '1px solid transparent' : 'none'};
  outline: none;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  ${({ tone, variant }) => tone === 'soft' ? softVariant(variant) : solidVariant(variant)}
  &:hover {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  }
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(6,182,212,0.25), 0 4px 10px rgba(15, 23, 42, 0.12);
    z-index: 2;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.2);
  }
  @media (max-width: 768px) {
    height: ${({ size }) => size === 'xs' ? '22px' : '26px'};
    font-size: ${({ size }) => size === 'xs' ? '0.74rem' : '0.82rem'};
    padding: ${({ size }) => size === 'xs' ? '0 7px' : '0 8px'};
  }
`;

const Label = styled.span.withConfig({
  shouldForwardProp: (prop) => !['hideBelow'].includes(prop),
})`
  @media (max-width: ${({ hideBelow }) => hideBelow || '0px'}) {
    display: none;
  }
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.9em;
`;

export function ActionButtons({
  onView,
  onSuspend,
  onCancel,
  onReactivate,
  size = 'sm',
  align = 'end',
  compactOnNarrow = true,
  labels = {},
  ariaContext = '',
  disabled = {},
  loading = {},
  hideLabelsBelow,
  tone = 'solid',
  pill = false,
  tones = {},
}) {
  return (
    <ButtonGroup align={align} compactOnNarrow={compactOnNarrow}>
      {onView && (
        <StyledButton
          size={size}
          variant="primary"
          tone={tones.view || tone}
          pill={pill}
          aria-label={`Ver detalhes de ${ariaContext}`}
          title={labels.view || 'Ver Detalhes'}
          onClick={onView}
          tabIndex={0}
          type="button"
          disabled={disabled.view || loading.view}
        >
          <IconWrap><FaEye aria-hidden="true" /></IconWrap>
          <Label hideBelow={hideLabelsBelow}>{labels.view || 'Ver Detalhes'}</Label>
        </StyledButton>
      )}
      {onSuspend && (
        <StyledButton
          size={size}
          variant="warning"
          tone={tones.suspend || tone}
          pill={pill}
          aria-label={`Suspender assinatura de ${ariaContext}`}
          title={labels.suspend || 'Suspender'}
          onClick={onSuspend}
          tabIndex={0}
          type="button"
          disabled={disabled.suspend || loading.suspend}
        >
          <IconWrap><FaPauseCircle aria-hidden="true" /></IconWrap>
          <Label hideBelow={hideLabelsBelow}>{labels.suspend || 'Suspender'}</Label>
        </StyledButton>
      )}
      {onCancel && (
        <StyledButton
          size={size}
          variant="danger"
          tone={tones.cancel || tone}
          pill={pill}
          aria-label={`Cancelar assinatura de ${ariaContext}`}
          title={labels.cancel || 'Cancelar'}
          onClick={onCancel}
          tabIndex={0}
          type="button"
          disabled={disabled.cancel || loading.cancel}
        >
          <IconWrap><FaTimes aria-hidden="true" /></IconWrap>
          <Label hideBelow={hideLabelsBelow}>{labels.cancel || 'Cancelar'}</Label>
        </StyledButton>
      )}
      {onReactivate && (
        <StyledButton
          size={size}
          variant="success"
          tone={tones.reactivate || tone}
          pill={pill}
          aria-label={`Reativar assinatura de ${ariaContext}`}
          title={labels.reactivate || 'Reativar'}
          onClick={onReactivate}
          tabIndex={0}
          type="button"
          disabled={disabled.reactivate || loading.reactivate}
        >
          <IconWrap><FaPlayCircle aria-hidden="true" /></IconWrap>
          <Label hideBelow={hideLabelsBelow}>{labels.reactivate || 'Reativar'}</Label>
        </StyledButton>
      )}
    </ButtonGroup>
  );
}

export default ActionButtons;
