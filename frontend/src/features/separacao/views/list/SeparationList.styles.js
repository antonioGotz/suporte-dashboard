import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

import { fadeUp } from '../../../../components/animations/motions.js';

// Design tokens (for user-provided colors)
const HEADER_BG = '#334155';
const ROW_ODD = '#0f172a';
const ROW_EVEN = '#1e293b';
const STATUS_PROCESS_TEXT = '#facc15';
const STATUS_PROCESS_BG = 'rgba(234,179,8,0.10)'; // eab308 @10%
const STATUS_PENDING_TEXT = '#67e8f9';
const STATUS_PENDING_BG = 'rgba(6,182,212,0.10)'; // 06b6d4 @10%

// Container principal da aplicação
export const CustomMain = styled.main`
  background-color: transparent;
  min-height: 100vh;
  width: 100%;
  display: block; /* avoid centering that reduced effective content width */
  padding: 0; /* let inner table control spacing */
`;

// Container da Tabela
export const CustomTable = styled.div`
  width: 100%;
  max-width: none; /* remove limite para permitir ocupar toda a largura do parent */
  margin: 0;
  background-color: transparent;
  border-radius: 8px;
  /* overflow: hidden; */ /* Comentado para evitar que o menu seja cortado */
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1); /* subtle outer border */
  position: relative; /* suporte ao header sticky */
`;

// Cabeçalho da Tabela
export const CustomTh = styled.div`
  padding: 12px 18px;
  font-size: 14px; /* requested */
  font-weight: 700;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: ${({ align = 'left' }) => (align === 'center' ? 'center' : (align === 'right' ? 'flex-end' : 'flex-start'))};
  background: transparent; /* header background set on parent .header */
  border-bottom: none;
  white-space: nowrap;
  /* precisa permitir que o dropdown extrapole a célula */
  overflow: visible;
  text-overflow: ellipsis;
  min-width: 0; /* allow ellipsis in grid items */
  /* aceita prop colSpan para usar grid-column sem inline styles */
  grid-column: span ${({ colSpan = 1 }) => colSpan};
  line-height: 1.2;
  min-height: 44px;
  position: relative; /* contexto para dropdown do filtro */
  
`;

// Linha da Tabela
export const CustomTr = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
  align-items: center;
  transition: background-color 0.2s;

  /* Estilo do cabeçalho */
  &.header {
    /* header uses the same column gap as data rows to keep perfect alignment */
    gap: 1rem;
    background: ${HEADER_BG};
    border-radius: 8px 8px 0 0;
    padding: 0.25rem 0; /* vertical padding inside header bar */
    align-items: center;
    position: relative; /* cria contexto para dropdown do cabeçalho */
    z-index: 200; /* assegura que o menu do cabeçalho fique acima das linhas */
    /* sticky removido a pedido: header rola junto */
  }

  /* Estilo das linhas de dados */
  &.data-row {
    padding: 10px 12px; /* altura mais uniforme */
    min-height: 52px;
    &:hover {
      background-color: rgba(255,255,255,0.02);
    }
    &.odd {
      background-color: ${ROW_ODD};
    }
    &.even {
      background-color: ${ROW_EVEN};
    }
    /* divider between rows implemented as border-top on each row */
    border-top: 1px solid ${HEADER_BG};
  }
`;

// Célula da Tabela
export const CustomTd = styled.div`
  grid-column: span ${({ colSpan = 1 }) => colSpan};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 18px; /* iguala ao padding horizontal do header (CustomTh) */
  text-align: ${({ align = 'left' }) => align};
  align-items: ${({ align = 'left' }) => {
    if (align === 'center') return 'center';
    if (align === 'right') return 'flex-end';
    return 'flex-start';
  }};
  min-width: 0;
  line-height: 1.2;
  

  .main-text {
    font-size: 13px;
    font-weight: 600;
    color: #e2e8f0; /* main text */
    line-height: 1.2;
  }

  .secondary-text {
    font-size: 12px;
    color: #94a3b8; /* muted */
    line-height: 1.15;
  }

  /* Reforço para a coluna de Ação: conteúdo à direita */
  &.cell-actions {
    align-items: flex-end;
    justify-content: center; /* vertical */
  }

  /* utilitário para garantir duas linhas estáveis (título + meta) */
  .two-line {
    display: grid;
    grid-template-rows: 1.25em 1.1em;
    row-gap: 4px;
    align-items: center;
    width: 100%;
    min-width: 0;
  }

`;

/* ---------- Componentes auxiliares para migrar estilos inline ---------- */

export const StatusBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ align = 'flex-start' }) => align};
`;

export const SlaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${({ intent }) => (intent === 'danger' ? '#ef4444' : intent === 'warn' ? '#f59e0b' : '#0ea5e9')};
`;

export const SlaText = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

export const SecondaryMuted = styled.span`
  color: #64748B;
`;

// --- Componentes de Ação Redesenhados ---

/**
 * O container agora gerencia o layout e o formato de "pílula" do grupo.
 * Adicionamos uma sombra sutil para dar profundidade.
 */
export const MenuContainer = styled.div`
  position: relative;
  display: inline-flex;
  border-radius: 9999px; /* Pílula contínua */
  background-color: #334155; /* fundo único do grupo */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  /* NÃO usar overflow: hidden; para não cortar o dropdown */
  gap: 0; /* sem espaço entre botões */
`;

/**
 * O novo MenuButton foi redesenhado para funcionar dentro do MenuContainer.
 * Ele não tem bordas ou sombras individuais. A separação é feita com uma borda sutil.
 * A lógica de variantes de cor e estado desabilitado foi aprimorada.
 */
export const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px; /* reduzido */
  padding: 0 12px; /* reduzido */
  border: none;
  background-color: transparent; /* transparente para usar o fundo do container */
  color: #e2e8f0;
  font-size: 13px; /* reduzido */
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  border-radius: 0; /* pílula é do container, não de cada botão */
  position: relative; /* necessário para o separador pseudo-elemento */

  /* Adiciona um separador sutil entre os botões */
  &:not(:first-child)::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    width: 1px;
    height: 60%;
    background-color: #475569;
  }
  
  /* SVG dentro do botão */
  svg {
    margin-left: 8px;
    width: 14px; /* reduzido */
    height: 14px; /* reduzido */
  }

  /* Hover que preserva o formato arredondado nas extremidades */
  &:hover {
    background-color: rgba(255, 255, 255, 0.06); /* hover um pouco mais visível */
  }
  &:first-child:hover {
    border-top-left-radius: 9999px;
    border-bottom-left-radius: 9999px;
  }
  &:last-child:hover {
    border-top-right-radius: 9999px;
    border-bottom-right-radius: 9999px;
  }

  /* Focus ring sutil para acessibilidade */
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.35) inset;
  }

  /* Botão de ícone sem círculo: apenas o ícone com mesmo fundo do grupo */
  &.icon-only {
    width: auto;
    min-width: 38px; /* reduzido mantendo área clicável */
    padding: 0 8px; /* reduzido */
    background: ${({ $intent = 'default' }) => ($intent === 'ready' ? 'rgba(34, 197, 94, 0.18)' : $intent === 'available' ? 'rgba(59, 130, 246, 0.16)' : 'transparent')};
    border: none;
    color: ${({ $intent = 'default' }) => ($intent === 'ready' ? '#4ade80' : $intent === 'available' ? '#38bdf8' : '#94a3b8')};
    svg { margin-left: 0; color: currentColor; }

    &:not(:disabled):hover {
      background-color: ${({ $intent = 'default' }) => ($intent === 'ready' ? 'rgba(34, 197, 94, 0.32)' : $intent === 'available' ? 'rgba(59, 130, 246, 0.28)' : 'rgba(255,255,255,0.06)')};
      color: ${({ $intent = 'default' }) => ($intent === 'ready' ? '#bef264' : $intent === 'available' ? '#bfdbfe' : '#cbd5e1')};
    }
  }

  /* Estado de Hover herdado acima (cores mais sutis) */

  /* Estado Desabilitado */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Mantemos o botão neutro (sem variante verde) para casar com o screenshot */
`;

/* Wrapper para garantir que ícones SVG herdem a cor via variável de tema */
export const HeaderIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text, #e5e7eb);
  svg { color: inherit; fill: currentColor; }
`;

/* Botão de ordenação do cabeçalho: mantém aparência inline e alinhamento com o resto do tema */
export const HeaderSort = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
`;

/**
 * Menu suspenso com estilo atualizado para combinar com os botões.
 * Fundo escuro, bordas arredondadas e uma animação sutil de entrada.
 */
export const MenuList = styled.ul`
  position: absolute;
  right: 0;
  /* direção dinâmica: abre acima (up) ou abaixo (down) */
  ${({ $direction }) => $direction === 'down'
    ? 'top: calc(100% + 8px); bottom: auto;'
    : 'bottom: calc(100% + 8px); top: auto;'}
  min-width: 180px;
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  list-style: none;
  padding: 8px;
  margin: 0;
  z-index: 100; /* acima do header sticky (z-index:20) */
  z-index: 1000; /* elevar acima das linhas da tabela e demais elementos */
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Lógica de visibilidade */
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen, $direction }) => ($isOpen ? 'translateY(0)' : ($direction === 'down' ? 'translateY(-8px)' : 'translateY(8px)'))};
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
`;

/**
 * Itens do menu com feedback claro no hover.
 */
export const MenuItem = styled.li`
  padding: 8px 12px;
  font-size: 14px;
  color: #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  text-decoration: none;
  display: block;
  white-space: nowrap;

  &:hover {
    background-color: #334155;
    color: #ffffff;
  }
`;

export const MenuLink = styled(Link)`
  display: block;
  padding: 8px 12px;
  font-size: 14px;
  color: #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  text-decoration: none;

  &:hover {
    background-color: #334155;
    color: #ffffff;
  }
`;

// Badge de Status
export const StatusBadgeStyled = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.7rem; /* reduzido */
  border-radius: 9999px;
  font-size: 0.85rem; /* reduzido */
  font-weight: 700;
  
  &.status-em-separacao {
    background-color: ${STATUS_PROCESS_BG};
    color: ${STATUS_PROCESS_TEXT};
  }

  &.status-aguardando-separacao {
    background-color: ${STATUS_PENDING_BG};
    color: ${STATUS_PENDING_TEXT};
  }
  
  /* Adicione outros status aqui se necessário */
`;

// --- Table-based components for the default 'table' presentation ---

export const ListContainer = styled.div`
  width: 100%;
  max-width: none; /* permitir que a lista ocupe todo o espaço do parent */
  margin: 0;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1); /* subtle outer border */
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0; /* no vertical gap, use dividing lines instead */

  thead th {
    background: transparent;
    padding: 12px 18px;
    font-size: 14px;
    font-weight: 700;
    color: #e2e8f0;
    text-align: left;
    border-bottom: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  thead tr {
    background: ${HEADER_BG};
    border-radius: 8px 8px 0 0;
  }
  /* divider between thead and tbody */
  thead + tbody {
    border-top: 1px solid ${HEADER_BG};
  }

  tbody tr:nth-child(odd) {
    background: ${ROW_ODD};
  }

  tbody tr:nth-child(even) {
    background: ${ROW_EVEN};
  }
  /* divider between rows implemented as border-top */
  tbody tr {
    border-top: 1px solid ${HEADER_BG};
  }

  tbody tr:hover {
    background-color: rgba(255,255,255,0.02);
  }

  tbody tr {
    border-radius: 0;
  }
`;

const hoverSheen = keyframes`
  from {
    transform: translateX(-60%);
    opacity: 0;
  }
  to {
    transform: translateX(120%);
    opacity: 0.35;
  }
`;

export const Tr = styled.tr`
  transition: background-color 0.2s ease, transform 0.26s ease, box-shadow 0.26s ease;

  thead & {
    opacity: 1;
    transform: none;
    animation: none;
  }

  tbody & {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
    animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: ${({ $delay = 0 }) => `${$delay}s`};
    position: relative;
  }

  tbody &:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 22px 48px -30px rgba(15, 23, 42, 0.85);
  }

  tbody &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(59,130,246,0.08), rgba(16,185,129,0.04));
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    transform: translateX(-60%);
  }

  @media (hover: hover) {
    tbody &:hover::after {
      opacity: 1;
      animation: ${hoverSheen} 0.75s ease forwards;
    }
  }
`;

export const Th = styled.th`
  padding: 16px 20px; /* adjusted padding to match header */
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  text-align: left;
  background: ${HEADER_BG};
  border-bottom: 1px solid rgba(255,255,255,0.04);
`;

export const ThPedido = styled(Th)`
  width: 120px;
  text-align: center;
`;

export const ThBrinquedo = styled(Th)``;

export const ThAcAção = styled(Th)`
  width: 160px;
  text-align: center;
`;

export const ThStatus = styled(Th)`
  position: relative; /* contexto para dropdown do filtro (modo tabela) */
  overflow: visible;  /* evita que o menu seja cortado pelo th */
`;

export const ThSLA = styled(Th)`
  width: 140px;
`;

export const Td = styled.td`
  padding: 10px 20px; /* adjusted to match header horizontal padding */
  vertical-align: middle;
  color: #e2e8f0;
`;

export const EmptyTableCell = styled.td`
  text-align: center;
  color: #94a3b8;
`;

export const SubscriberName = styled(Link)`
  display: block;
  font-weight: 700;
  color: #e2e8f0;
  text-decoration: none;
  &:hover { text-decoration: underline; color: #9dd9d2; }
`;

export const SmallMuted = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

export const BabyName = styled(Link)`
  display: block;
  font-size: 12px;
  color: #94a3b8;
  text-decoration: none;
`;

export const TdCenter = styled.td`
  text-align: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.02);
`;

export const TdCenterWrap = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.02);
`;

export const OrderId = styled.span`
  font-weight: 700;
  color: #e2e8f0;
`;

export const PlanName = styled.span`
  display: block;
  color: #94a3b8;
  font-size: 12px;
`;

export const ProductName = styled.div`
  font-weight: 700;
  color: #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export const ProductMeta = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

export const ActionsCell = styled.td`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.02);
`;

export const BadgeLink = styled(Link)`
  display: inline-block;
`;
