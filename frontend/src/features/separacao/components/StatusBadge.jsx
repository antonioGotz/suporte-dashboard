import React from 'react';
import styled, { css } from 'styled-components';
import { FiClock } from 'react-icons/fi';
import { FaBox, FaTruck, FaCheckCircle, FaTag, FaQuestion } from 'react-icons/fa';

const base = css`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1;
`;

const BadgeWrapper = styled.span`
  ${base}
  color: ${props => props.$color || '#cbd5e1'};
  background: ${props => props.$bg || 'transparent'};
  box-shadow: ${props => props.$inset || 'none'};
  display: inline-flex;
  align-items: center;
  min-width: 56px;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`;

const LabelRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const SubLabel = styled.span`
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: rgba(148,163,184,0.95);
  margin-top: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PIPELINE_MAP = {
  waiting: {
    color: '#0ea5e9', // azul-ciano
    bg: 'rgba(14,165,233,0.08)',
    inset: 'inset 0 0 0 1px rgba(14,165,233,0.12)',
    Icon: FiClock,
  },
  in_progress: {
    color: '#f59e0b', // amarelo
    bg: 'rgba(245,158,11,0.08)',
    inset: 'inset 0 0 0 1px rgba(245,158,11,0.12)',
    Icon: FaBox,
  },
  ready: {
    color: '#fb923c', // laranja
    bg: 'rgba(251,146,60,0.08)',
    inset: 'inset 0 0 0 1px rgba(251,146,60,0.12)',
    Icon: FaTruck,
  },
  shipped: {
    color: '#16a34a', // verde
    bg: 'rgba(16,163,74,0.08)',
    inset: 'inset 0 0 0 1px rgba(16,163,74,0.12)',
    Icon: FaCheckCircle,
  },
  label: {
    color: '#8b5cf6', // roxo
    bg: 'rgba(139,92,246,0.08)',
    inset: 'inset 0 0 0 1px rgba(139,92,246,0.12)',
    Icon: FaTag,
  },
};

export default function StatusBadge({ statusCode, label, subLabel, intent, className, title, size }) {
  const code = String(statusCode || '').trim();
  const def = PIPELINE_MAP[code] || null;

  const color = def ? def.color : (intent === 'warn' ? '#f59e0b' : '#94a3b8');
  const bg = def ? def.bg : 'rgba(148,163,184,0.06)';
  const inset = def ? def.inset : 'inset 0 0 0 1px rgba(255,255,255,0.02)';
  const Icon = def ? def.Icon : FaQuestion;

  const visibleLabel = label || statusCode || '—';

  const isCompact = String(size || '').toLowerCase() === 'compact';

  return (
    <BadgeWrapper
      className={className}
      $color={color}
      $bg={bg}
      $inset={inset}
      style={{
        padding: isCompact ? '4px 10px' : undefined,
        fontSize: isCompact ? '12px' : undefined,
        gap: isCompact ? '4px' : undefined,
        minWidth: isCompact ? '48px' : undefined,
      }}
      title={title || visibleLabel}
      aria-label={visibleLabel}
    >
      <LabelRow>
        <IconWrapper aria-hidden="true">
          <Icon style={{ color, width: isCompact ? 14 : 16, height: isCompact ? 14 : 16 }} />
        </IconWrapper>
        <span>{visibleLabel}</span>
      </LabelRow>
      {subLabel && (
        <SubLabel style={{ fontSize: isCompact ? 10 : undefined, marginTop: isCompact ? 1 : undefined }}>{subLabel}</SubLabel>
      )}
    </BadgeWrapper>
  );
}
