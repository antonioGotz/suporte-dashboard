import styled from "styled-components";

const color = {
  brand:    "var(--color-primary, #9dd9d2)",
  text:     "var(--color-text, #e2e8f0)",
  surface:  "var(--color-surface, #111827)",
  surface2: "var(--color-surface2, #1f2937)",
  line:     "var(--color-border, #374151)",
  muted:    "var(--color-muted, #a0aec0)",
  petroleo: "var(--petroleo, #1F4E5F)",
};

export const TableWrap = styled.div`
  --s-1: 4px; --s0: 8px; --s1: 12px; --s2: 16px; --s3: 20px; --s4: 24px;
  /* Pedido | Assinante | Gerada em | Ações */
  --col-col1: clamp(120px, 16vw, 200px);
  --col-col2: 1fr;
  --col-col3: clamp(160px, 20vw, 240px);
  --col-acoes: 120px;
  /* Glass tokens */
  --glass-bg: rgba(15, 23, 42, 0.55);
  --glass-border: rgba(255,255,255,0.06);
  --row-bg: rgba(30, 41, 59, 0.60);
  --row-bg-alt: rgba(36, 47, 66, 0.60);
  --row-hover: rgba(51, 65, 85, 0.65);
  color: ${color.text};
`;

export const Shell = styled.div`
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0,0,0,.24);
`;

export const Header = styled.div`
  position: sticky; top: 0; z-index: 1;
  display: grid;
  grid-template-columns: var(--col-col1) var(--col-col2) var(--col-col3) var(--col-acoes);
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(8px);
  color: ${color.muted};
  font-size: 12px;
  letter-spacing: .06em;
  text-transform: uppercase;
  font-weight: 700;
  & > div { text-align: inherit; }
`;

export const List = styled.div`
  padding: var(--s1);
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: var(--col-col1) var(--col-col2) var(--col-col3) var(--col-acoes);
  align-items: center;
  gap: 0;
  margin: var(--s1);
  padding: 12px 16px;
  border: 1px solid var(--glass-border);
  background: var(--row-bg);
  border-radius: 18px;
  box-shadow: 0 0 0 transparent;
  transition: background .24s, box-shadow .24s, transform .12s, border-color .24s;

  /* Zebra striping */
  &:nth-child(odd) { background: var(--row-bg); }
  &:nth-child(even) { background: var(--row-bg-alt); }

  /* Hover effect */
  &:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,.18);
    transform: translateY(-2px);
    border-color: #7ec4f7;
    background: var(--row-hover);
  }

  /* Row highlight for canceled labels */
  &.is-canceled {
    border-color: #fecaca;
    background: rgba(58, 43, 43, 0.75);
  }
`;

export const Cell = styled.div`
  min-width: 0;
  font-size: 15px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.right { text-align: right; }
  &.muted { color: ${color.muted}; }
  &.col1 { font-variant-numeric: tabular-nums; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  &.col3 { font-variant-numeric: tabular-nums; }
`;

export const Actions = styled.div`
  display: inline-flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 11px;
  line-height: 1.4;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  color: #e5e7eb;
  background: rgba(148,163,184,.18);
`;

export const CanceledBadge = styled(StatusBadge)`
  color: #991b1b;
  background: #fef2f2;
  border-color: #fecaca;
`;

export const ValidBadge = styled(StatusBadge)`
  color: #065f46;
  background: #d1fae5;
  border-color: #a7f3d0;
`;

/* Skeleton loading */
const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  }
`;

export const SkeletonRow = styled.div`
  ${shimmer}
  height: 64px;
  margin: var(--s1);
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%);
  background-size: 400px 100%;
  animation: shimmer 1.2s infinite linear;
  border: 1px solid var(--glass-border);
`;

export const EmptyState = styled.div`
  margin: 16px;
  padding: 20px;
  border-radius: 16px;
  background: rgba(2,6,23,0.35);
  border: 1px dashed var(--glass-border);
  color: ${color.muted};
  text-align: center;
`;

export const IconBtn = styled.button`
  display: inline-flex;
  align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,0.18);
  background: rgba(15,23,42,0.5);
  color: ${color.text};
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease, transform .1s ease, box-shadow .18s ease;
  &:hover{
    background: rgba(148,163,184,0.18);
    border-color: var(--color-primary, #9dd9d2);
    box-shadow: 0 2px 8px rgba(0,0,0,.2);
    transform: scale(1.05);
  }
  &:active{ transform: translateY(1px); }
`;

export const PdfBtn = styled(IconBtn)`
  &:hover{
    background: rgba(31,78,95,.22);
    border-color: ${color.petroleo};
  }
`;

export const Responsive = styled.div`
  @media (max-width: 900px){
    ${Header}, ${Row}{
      grid-template-columns: var(--col-col1) var(--col-col2) var(--col-acoes);
    }
    ${Header} > .col3, ${Row} > .col3 { display: none; }
  }
  @media (max-width: 640px){
    ${Header}, ${Row}{ grid-template-columns: 1fr var(--col-acoes); }
    ${Row} > .col2, ${Row} > .col3 { grid-column: 1 / -1; }
    ${Row} > .acoes { justify-self: end; }
    ${Header} > .col2, ${Header} > .col3, ${Header} > .acoes { display: none; }
  }
`;

export default {
  TableWrap, Shell, Header, List, Row, Cell, Actions, IconBtn, PdfBtn, Responsive, StatusBadge, CanceledBadge, ValidBadge, SkeletonRow, EmptyState
};
