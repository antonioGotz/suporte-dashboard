import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiBell,
  FiUserPlus,
  FiBarChart2,
  FiClipboard,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaHeadset, FaCircle } from 'react-icons/fa';
import Loader from '../components/Loader';
import dashboardService from '../features/dashboard/services/dashboardService';
import { fadeUp } from '../components/animations/motions.js';

const formatNumber = (value) => {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('pt-BR');
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(Number(value));
};

const formatPercent = (value) => {
  if (value === null || value === undefined) return '—';
  return `${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
};

const formatSigned = (value, formatter = formatNumber) => {
  if (value === null || value === undefined) return '—';
  const formatted = formatter(Math.abs(value));
  return `${value >= 0 ? '+' : '-'}${formatted}`;
};

const formatRelativeTime = (date) => {
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.max(1, Math.round(diffMs / 1000));

  if (seconds < 60) {
    return `há ${seconds} segundo${seconds > 1 ? 's' : ''}`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainingMinutes = minutes % 60;
    return `há ${hours}h${remainingMinutes ? ` ${remainingMinutes}min` : ''}`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `há ${days} dia${days > 1 ? 's' : ''}`;
  }

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const capitalize = (text) => (
  text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
);

const pageReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.99);
  }
  70% {
    opacity: 1;
    transform: translateY(-4px) scale(1.005);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vw, 32px);
  opacity: 0;
  animation: ${pageReveal} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 clamp(18px, 3vw, 28px);
`;

const PageHeader = styled.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px 28px;
  padding: clamp(22px, 3vw, 28px) clamp(24px, 3.4vw, 32px);
  border-radius: 26px;
  background:
    radial-gradient(160% 140% at 110% -30%, rgba(56, 189, 248, 0.22), transparent 60%),
    radial-gradient(140% 140% at -20% 120%, rgba(129, 140, 248, 0.18), transparent 58%),
    rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 26px 52px -36px rgba(15, 23, 42, 1);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(56, 189, 248, 0.12), transparent 45%);
    opacity: 0.4;
    pointer-events: none;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.65rem, 1.9vw, 2.15rem);
  color: var(--text);
  margin: 0;
  position: relative;
  z-index: 1;
`;

const Subtitle = styled.p`
  color: var(--muted);
  font-size: clamp(0.9rem, 1vw, 0.98rem);
  max-width: 620px;
  position: relative;
  z-index: 1;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;

  > * {
    opacity: 0;
    animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  > *:nth-child(1) { animation-delay: 0.05s; }
  > *:nth-child(2) { animation-delay: 0.12s; }
`;

const UpdatedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border-radius: 999px;
  background: linear-gradient(125deg, rgba(56, 189, 248, 0.18), rgba(129, 140, 248, 0.14));
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: rgba(226, 232, 240, 0.86);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: 0 12px 34px -20px rgba(14, 116, 144, 0.65);
  backdrop-filter: blur(6px);
`;

const UpdatedIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: rgba(22, 163, 74, 0.18);
  border: 1px solid rgba(34, 197, 94, 0.45);
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.35);
  position: relative;
`;
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.55);
  }
  50% {
    transform: scale(1.35);
    opacity: 1;
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.8);
  }
`;

const cardAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const OnlineDot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(120deg, #22c55e, #4ade80);
  color: #0f172a;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const UpdatedText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  gap: 2px;
  font-size: 0.78rem;

  strong {
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: rgba(241, 245, 249, 0.92);
  }
`;

const UpdatedMeta = styled.span`
  color: rgba(148, 163, 184, 0.85);
  font-size: 0.74rem;
`;

const SectionsGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: stretch;

  @media (min-width: 768px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
`;

const Section = styled.section`
  background: rgba(15, 23, 42, 0.58);
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  padding: clamp(18px, 3vw, 26px);
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 1);
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.2vw, 22px);
  grid-column: span 1;
  min-height: 100%;

  @media (min-width: 768px) {
    grid-column: span ${({ $spanMd = 6 }) => Math.min($spanMd, 6)};
  }

  @media (min-width: 1200px) {
    grid-column: span ${({ $spanLg = 12 }) => Math.min($spanLg, 12)};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  > * {
    opacity: 0;
    animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  > *:nth-child(1) { animation-delay: 0.06s; }
  > *:nth-child(2) { animation-delay: 0.12s; }
`;

const SectionTitle = styled.h2`
  font-size: clamp(0.96rem, 1.05vw, 1.02rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  margin: 0;
`;

const SectionHint = styled.span`
  color: rgba(226, 232, 240, 0.65);
  font-size: clamp(0.78rem, 0.92vw, 0.84rem);
`;

const MetricGrid = styled.div`
  display: grid;
  gap: clamp(14px, 2vw, 18px);
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const MetricCard = styled.article`
  background: linear-gradient(160deg, rgba(45, 55, 72, 0.88), rgba(26, 32, 44, 0.92));
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: clamp(18px, 2.6vw, 22px);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 16px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 44px -36px rgba(15, 23, 42, 0.65);
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  animation: ${cardAppear} 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: border-color 0.26s ease, box-shadow 0.26s ease;
  will-change: transform, box-shadow;

  min-width: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(140deg, rgba(56, 189, 248, 0) 25%, rgba(14, 165, 233, 0.18) 75%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(56, 189, 248, 0.35);
  }

  &:hover::after {
    opacity: 1;
  }
  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.12s; }
  &:nth-child(3) { animation-delay: 0.19s; }
  &:nth-child(4) { animation-delay: 0.26s; }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(226, 232, 240, 0.62);
  font-size: clamp(0.76rem, 0.92vw, 0.84rem);
`;

const MetricValue = styled.strong`
  font-size: clamp(1.35rem, 2.05vw, 1.85rem);
  font-weight: 700;
`;

const Trend = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: clamp(0.76rem, 0.95vw, 0.82rem);
  font-weight: 600;
  color: ${({ $direction }) => ($direction === 'up' ? '#34d399' : '#f87171')};
`;

const TrendBadge = styled.span`
  background: rgba(148,163,184,0.08);
  border-radius: 999px;
  padding: 6px 10px;
  color: rgba(226, 232, 240, 0.72);
  font-size: clamp(0.72rem, 0.9vw, 0.8rem);
`;

const Timeline = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
  padding: 0;
`;

const TimelineScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: clamp(320px, 55vh, 480px);
  overflow-y: auto;
  padding-right: 6px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.35);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.35);
    border-radius: 999px;
  }
`;

const TimelineItem = styled.li`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`;

const TimelineIcon = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: ${({ $tone }) => $tone};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TimelineTitle = styled.strong`
  font-size: clamp(0.88rem, 1vw, 0.95rem);
`;

const TimelineMeta = styled.span`
  color: rgba(226, 232, 240, 0.6);
  font-size: clamp(0.74rem, 0.92vw, 0.82rem);
`;

const BarsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
`;

const BarTrack = styled.div`
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.18);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.12);
`;

const BarFill = styled.div`
  position: absolute;
  inset: 0;
  width: ${({ $progress }) => `${$progress}%`};
  background: ${({ $gradient }) => $gradient};
  transition: width 0.35s ease;
`;

const HealthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const HealthCard = styled.div`
  background: linear-gradient(160deg, rgba(45, 55, 72, 0.88), rgba(26, 32, 44, 0.92));
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 16px 44px -36px rgba(15, 23, 42, 0.55);
  opacity: 0;
  transform: translateY(18px);
  animation: ${cardAppear} 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: transform 0.26s ease, box-shadow 0.26s ease;
  will-change: transform, box-shadow;

  &:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 24px 50px -28px rgba(15, 23, 42, 0.8);
  }

  &:nth-child(1) { animation-delay: 0.08s; }
  &:nth-child(2) { animation-delay: 0.16s; }
  &:nth-child(3) { animation-delay: 0.24s; }
`;

const HealthHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;

const HealthStatus = styled.span`
  color: ${({ $variant }) => {
    if ($variant === 'ok') return '#34d399';
    if ($variant === 'warn') return '#f59e0b';
    return '#f87171';
  }};
  font-weight: 600;
  font-size: clamp(0.78rem, 0.94vw, 0.84rem);
`;

const Checklist = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChecklistItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(0.8rem, 0.98vw, 0.86rem);
  color: rgba(226,232,240,0.78);
`;

const ChecklistBadge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  color: ${({ $variant }) => ($variant === 'warn' ? '#f97316' : '#10b981')};
  background: ${({ $variant }) => ($variant === 'warn' ? 'rgba(251, 191, 36, 0.16)' : 'rgba(16, 185, 129, 0.16)')};
`;

const ErrorBanner = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  background: rgba(248, 113, 113, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fecaca;
  border-radius: 14px;
  padding: 14px 18px;
`;

const RetryButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  background: rgba(248, 113, 113, 0.45);
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease;
  &:hover {
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  color: rgba(226, 232, 240, 0.62);
  font-size: 0.9rem;
  padding: 12px 0;
`;

const AlertList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AlertItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(15, 23, 42, 0.52);
  border: 1px solid rgba(148,163,184,0.12);
  border-radius: 16px;
  padding: 14px 16px;
`;

const AlertDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: clamp(0.78rem, 0.95vw, 0.86rem);
`;

const AlertTitle = styled.strong`
  font-size: clamp(0.86rem, 1vw, 0.95rem);
  display: block;
`;

const AlertTag = styled.span`
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  align-self: flex-start;
  background: rgba(34, 197, 94, 0.18);
  color: #34d399;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

const QuickActionButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 16px;
  background: linear-gradient(160deg, rgba(45, 55, 72, 0.88), rgba(26, 32, 44, 0.92));
  color: rgba(226,232,240,0.9);
  font-weight: 600;
  font-size: clamp(0.86rem, 1vw, 0.94rem);
  cursor: pointer;
  transition: border 0.22s ease, transform 0.26s ease, background 0.26s ease, box-shadow 0.26s ease;
  box-shadow: 0 16px 44px -36px rgba(15, 23, 42, 0.55);
  opacity: 0;
  transform: translateY(18px);
  animation: ${cardAppear} 0.74s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: transform, box-shadow;

  &:hover {
    border-color: rgba(56, 189, 248, 0.55);
    background: linear-gradient(160deg, rgba(45, 55, 72, 0.92), rgba(26, 32, 44, 0.98));
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 24px 50px -28px rgba(15, 23, 42, 0.82);
  }

  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.12s; }
  &:nth-child(3) { animation-delay: 0.19s; }

  svg {
    font-size: 1.2rem;
    color: rgba(56, 189, 248, 0.85);
  }
`;

const QuickActionDescription = styled.span`
  font-size: clamp(0.72rem, 0.9vw, 0.8rem);
  color: rgba(226, 232, 240, 0.7);
  font-weight: 400;
`;

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Falha ao carregar dashboard:', err);
      setError('Não foi possível carregar os dados do dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const metrics = useMemo(() => {
    if (!summary?.metrics) return [];
    const { metrics: m } = summary;
    return [
      {
        key: 'activeSubscribers',
        label: 'Assinantes Ativos',
        value: formatNumber(m.activeSubscribers?.value ?? 0),
        caption: 'Variação líquida nos últimos 30 dias',
        deltaLabel: formatSigned(m.activeSubscribers?.netChange ?? 0, formatNumber),
        direction: (m.activeSubscribers?.netChange ?? 0) >= 0 ? 'up' : 'down',
      },
      {
        key: 'newSubscribers30d',
        label: 'Novos Cadastros (30d)',
        value: formatNumber(m.newSubscribers30d?.value ?? 0),
        caption: m.newSubscribers30d?.previous !== undefined
          ? `Período anterior: ${formatNumber(m.newSubscribers30d.previous)}`
          : 'Comparativo com janela anterior',
        deltaLabel: formatSigned(m.newSubscribers30d?.deltaPercent ?? 0, formatPercent),
        direction: (m.newSubscribers30d?.deltaPercent ?? 0) >= 0 ? 'up' : 'down',
      },
      {
        key: 'churnRate30d',
        label: 'Churn (30d)',
        value: formatPercent(m.churnRate30d?.value ?? 0),
        caption: `${formatNumber(m.churnRate30d?.cancellations ?? 0)} cancelamentos no período`,
        deltaLabel: formatSigned(m.churnRate30d?.deltaPercent ?? 0, formatPercent),
        direction: (m.churnRate30d?.deltaPercent ?? 0) <= 0 ? 'up' : 'down',
      },
      {
        key: 'monthlyRecurringRevenue',
        label: 'MRR',
        value: formatCurrency(m.monthlyRecurringRevenue?.value ?? 0),
        caption: `Variação líquida: ${formatSigned(m.monthlyRecurringRevenue?.deltaValue ?? 0, formatCurrency)}`,
        deltaLabel: formatSigned(m.monthlyRecurringRevenue?.deltaPercent ?? 0, formatPercent),
        direction: (m.monthlyRecurringRevenue?.deltaPercent ?? 0) >= 0 ? 'up' : 'down',
      },
    ];
  }, [summary]);

  const activities = summary?.activities ?? [];
  const plans = summary?.planPerformance?.plans ?? [];
  const totalActivePlans = summary?.planPerformance?.totalActive ?? 0;

  const newSignupAlerts = useMemo(() => (
    activities
      .filter((activity) => ['aprovado', 'ativo', 'criado', 'reativado'].includes(activity.action ?? ''))
      .slice(0, 5)
  ), [activities]);

  const lastUpdated = useMemo(() => {
    if (!summary?.generated_at) {
      return null;
    }

    const updatedAt = new Date(summary.generated_at);
    const dayName = capitalize(updatedAt.toLocaleDateString('pt-BR', { weekday: 'long' }));
    const monthName = capitalize(updatedAt.toLocaleDateString('pt-BR', { month: 'long' }));
    const datePart = `${updatedAt.getDate().toString().padStart(2, '0')} de ${monthName} de ${updatedAt.getFullYear()}`;
    const timePart = updatedAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${dayName}, ${datePart} às ${timePart}`;
  }, [summary?.generated_at]);

  const quickActions = useMemo(() => ([
    {
      key: 'add-subscriber',
      label: 'Cadastrar Assinante',
      description: 'Abra o fluxo completo de cadastro.',
      icon: <FiUserPlus />,
      to: '/assinantes/novo',
    },
    {
      key: 'analisar-planos',
      label: 'Gerenciar Planos',
      description: 'Revise valores e benefícios atuais.',
      icon: <FiBarChart2 />,
      to: '/produtos',
    },
    {
      key: 'relatorio-diario',
      label: 'Relatório Diário',
      description: 'Exportar métricas de hoje em CSV.',
      icon: <FiClipboard />,
      to: '/historico',
    },
  ]), [navigate]);

  const healthCards = useMemo(() => {
    const demoPending = summary?.health?.demoPending?.count ?? 0;
    const backlogPending = summary?.health?.separationBacklog?.pending ?? 0;
    const backlogInProgress = summary?.health?.separationBacklog?.in_progress ?? 0;
    const unreadNotifications = summary?.health?.unreadNotifications?.count ?? 0;

    const backlogTotal = backlogPending + backlogInProgress;

    return [
      {
        title: 'Onboarding & Demo',
        status: demoPending === 0 ? 'Operacional' : 'Atenção moderada',
        variant: demoPending === 0 ? 'ok' : 'warn',
        icon: <FiCheckCircle color={demoPending === 0 ? '#34d399' : '#f59e0b'} />,
        items: [
          {
            label: `${formatNumber(demoPending)} solicitações aguardando ativação completa`,
            variant: demoPending === 0 ? 'ok' : 'warn',
          },
        ],
      },
      {
        title: 'Fila de Separação',
        status: backlogTotal === 0 ? 'Sem fila' : (backlogTotal > 10 ? 'Atenção alta' : 'Dentro do esperado'),
        variant: backlogTotal === 0 ? 'ok' : (backlogTotal > 10 ? 'critical' : 'warn'),
        icon: <FiClock color={backlogTotal === 0 ? '#34d399' : '#f59e0b'} />,
        items: [
          {
            label: `${formatNumber(backlogPending)} aguardando início`,
            variant: backlogPending > 5 ? 'warn' : 'ok',
          },
          {
            label: `${formatNumber(backlogInProgress)} em separação neste momento`,
            variant: backlogInProgress > 5 ? 'warn' : 'ok',
          },
        ],
      },
      {
        title: 'Alertas & Comunicação',
        status: unreadNotifications === 0 ? 'Nenhum alerta crítico' : 'Há alertas pendentes',
        variant: unreadNotifications === 0 ? 'ok' : 'warn',
        icon: <FaHeadset color={unreadNotifications === 0 ? '#38bdf8' : '#f59e0b'} />,
        items: [
          {
            label: `${formatNumber(unreadNotifications)} notificações administrativas não lidas`,
            variant: unreadNotifications === 0 ? 'ok' : 'warn',
          },
        ],
      },
    ];
  }, [summary]);

  return (
    <PageWrapper>
      <PageHeader>
        <HeaderContent>
          <Title>Central Operacional Evolua</Title>
          <Subtitle>Acompanhe desempenho, receita recorrente e alertas críticos em um único lugar.</Subtitle>
        </HeaderContent>
        {lastUpdated && (
          <UpdatedBadge>
            <UpdatedIcon>
              <OnlineDot>
                <FaCircle />
              </OnlineDot>
            </UpdatedIcon>
            <UpdatedText>
              <strong>Online</strong>
              <UpdatedMeta>{lastUpdated}</UpdatedMeta>
            </UpdatedText>
          </UpdatedBadge>
        )}
      </PageHeader>

      {error && (
        <ErrorBanner>
          <span>{error}</span>
          <RetryButton type="button" onClick={fetchSummary}>Tentar novamente</RetryButton>
        </ErrorBanner>
      )}

      {loading && !summary ? (
        <SectionsGrid>
          <Section $spanMd={6} $spanLg={12}>
            <Loader />
          </Section>
        </SectionsGrid>
      ) : (
        <SectionsGrid>
          <Section $spanMd={6} $spanLg={12}>
            <SectionHeader>
              <SectionTitle>Visão Geral Executiva</SectionTitle>
              <SectionHint>Indicadores-chave com comparação ao período anterior</SectionHint>
            </SectionHeader>
            <MetricGrid>
              {metrics.map((metric) => (
                <MetricCard key={metric.key}>
                  <MetricHeader>
                    <span>{metric.label}</span>
                    <Trend $direction={metric.direction}>
                      {metric.direction === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                      {metric.deltaLabel}
                    </Trend>
                  </MetricHeader>
                  <MetricValue>{metric.value}</MetricValue>
                  <TrendBadge>{metric.caption}</TrendBadge>
                </MetricCard>
              ))}
            </MetricGrid>
          </Section>

          <Section $spanMd={6} $spanLg={8}>
            <SectionHeader>
              <SectionTitle>Performance de Produtos & Planos</SectionTitle>
              <SectionHint>
                Participação na base ativa ({formatNumber(totalActivePlans)} assinantes) e receita estimada
              </SectionHint>
            </SectionHeader>
            {plans.length === 0 ? (
              <EmptyState>Nenhum plano ativo para exibir.</EmptyState>
            ) : (
              <BarsWrapper>
                {plans.map((plan) => (
                  <div key={`${plan.product_id ?? 'sem-id'}`}>
                    <BarRow>
                      <span><strong>{plan.product_name}</strong> · {formatCurrency(plan.revenue)}</span>
                      <span>{plan.share?.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) ?? '0'}%</span>
                    </BarRow>
                    <BarTrack>
                      <BarFill
                        $progress={plan.share ?? 0}
                        $gradient="linear-gradient(90deg, #38B2AC, #0EA5E9)"
                      />
                    </BarTrack>
                  </div>
                ))}
              </BarsWrapper>
            )}
          </Section>

          <Section $spanMd={6} $spanLg={6}>
            <SectionHeader>
              <SectionTitle>Saúde Operacional</SectionTitle>
              <SectionHint>Alertas e pendências que podem afetar a continuidade do serviço</SectionHint>
            </SectionHeader>
            <HealthGrid>
              {healthCards.map((card) => (
                <HealthCard key={card.title}>
                  <HealthHeader>
                    {card.icon}
                    <div>
                      <span>{card.title}</span>
                      <br />
                      <HealthStatus $variant={card.variant}>{card.status}</HealthStatus>
                    </div>
                  </HealthHeader>
                  <Checklist>
                    {card.items.map((item) => (
                      <ChecklistItem key={item.label}>
                        {item.variant === 'warn' ? <FiAlertTriangle color="#f97316" /> : <FiCheckCircle color="#22c55e" />}
                        <span>{item.label}</span>
                        <ChecklistBadge $variant={item.variant}>
                          {item.variant === 'warn' ? 'atenção' : 'ok'}
                        </ChecklistBadge>
                      </ChecklistItem>
                    ))}
                  </Checklist>
                </HealthCard>
              ))}
              </HealthGrid>
            </Section>

            <Section $spanMd={6} $spanLg={6}>
              <SectionHeader>
                <SectionTitle>Atalhos Rápidos</SectionTitle>
                <SectionHint>Acesse as rotinas mais usadas em poucos cliques</SectionHint>
              </SectionHeader>
              <QuickActionsGrid>
                {quickActions.map((action) => (
                  <QuickActionButton
                    key={action.key}
                    type="button"
                    onClick={() => navigate(action.to)}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                    <QuickActionDescription>{action.description}</QuickActionDescription>
                  </QuickActionButton>
                ))}
              </QuickActionsGrid>
            </Section>

            <Section $spanMd={6} $spanLg={12}>
              <SectionHeader>
                <SectionTitle>Atividades Recentes</SectionTitle>
                <SectionHint>Últimas movimentações registradas no sistema</SectionHint>
              </SectionHeader>
              {activities.length === 0 ? (
                <EmptyState>Nenhum log recente disponível.</EmptyState>
              ) : (
                <TimelineScrollArea>
                  <Timeline>
                    {activities.map((activity) => {
                      const tone = activity.action === 'cancelado'
                        ? 'rgba(248,113,113,0.35)'
                        : activity.action === 'suspenso'
                          ? 'rgba(250,204,21,0.35)'
                          : 'rgba(52,211,153,0.35)';

                      const icon = activity.action === 'cancelado'
                        ? <FiArrowDownLeft />
                        : activity.action === 'suspenso'
                          ? <FiAlertTriangle />
                          : <FiArrowUpRight />;

                      return (
                        <TimelineItem key={`${activity.id}-${activity.occurred_at}`}>
                          <TimelineIcon $tone={tone}>{icon}</TimelineIcon>
                          <TimelineContent>
                            <TimelineTitle>{activity.title}</TimelineTitle>
                            <TimelineMeta>{activity.description}</TimelineMeta>
                            {activity.relative_time && (
                              <TimelineMeta>{activity.relative_time}</TimelineMeta>
                            )}
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })}
                </Timeline>
              </TimelineScrollArea>
            )}
          </Section>
        </SectionsGrid>
      )}
    </PageWrapper>
  );
};

export default DashboardPage;