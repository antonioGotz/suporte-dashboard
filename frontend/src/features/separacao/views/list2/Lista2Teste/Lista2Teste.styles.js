import styled from 'styled-components';
import { Link } from 'react-router-dom';

/* Tokens de cor para manter consistência com a imagem */
export const COLORS = {
  background: '#071225',
  panel: '#0d1b27',
  row: '#0b2233',
  text: '#e6eef2',
  muted: '#94a3b8',
  primary: '#9dd9d2',
  accent: '#06b6d4',
  warn: '#b59b2b',
  danger: '#ef4444'
};

export const Root = styled.div`
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
`;

export const Main = styled.div`
  padding: 12px;
`;

export const CardGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  @media (min-width: 768px) { display: none; }
`;

export const Card = styled.div`
  background: ${COLORS.row};
  border: 1px solid rgba(255,255,255,0.02);
  padding: 12px;
  border-radius: 12px;
`;

export const CardHeader = styled.div`
  display:flex; justify-content:space-between; align-items:flex-start;
`;

export const CardTitle = styled.div`
  font-weight:700; color: ${COLORS.text};
`;

export const CardSubtitle = styled.div`
  font-size: 13px; color: ${COLORS.muted};
`;

export const CardRight = styled.div` color: ${COLORS.text}; font-family: monospace; `;

export const CardProduct = styled.div` margin-top:8px; font-weight:600; color: ${COLORS.text}; `;
export const CardMeta = styled.div` font-size:12px; color: ${COLORS.muted}; `;

export const CardFooter = styled.div` display:flex; justify-content:space-between; align-items:center; margin-top:10px; `;

export const StatusBadge = styled.span`
  display:inline-flex; align-items:center; gap:8px; padding:6px 12px; border-radius:999px; background: ${({bg})=> bg || 'rgba(14,165,233,0.10)'}; color: ${({color})=> color || COLORS.accent}; font-weight:700; font-size:12px;
`;

export const ActionButton = styled.button`
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); color: ${COLORS.text}; font-weight:700; padding:6px 12px; border-radius:10px; cursor: pointer;
  transition: all .12s ease;
  &:hover { transform: translateY(-1px); background: rgba(255,255,255,0.03); }
  &:focus-visible { outline: 2px solid rgba(157,217,210,0.18); outline-offset: 2px; }
`;

export const MenuButton = styled.button`
  display: inline-flex; align-items:center; gap:6px; height:34px; padding:0 12px; border-radius:10px; border:1px solid rgba(255,255,255,.04); background: rgba(15,23,34,0.6); color: ${COLORS.text}; font-weight:700; cursor:pointer;
  transition: all .12s ease;
  &:hover { background: rgba(255,255,255,0.02); }
  &:focus-visible { outline: 2px solid ${COLORS.primary}; outline-offset: 2px; }
`;

export const MenuList = styled.ul`
  position: absolute;
  z-index: 1200;
  margin: 6px 0 0 0;
  padding: 4px 0; /* py-1 */
  list-style: none;
  background: ${COLORS.panel};
  border: 1px solid #334155; /* slate-700 */
  border-radius: 6px; /* rounded-md */
  min-width: 220px;
  max-height: 320px;
  overflow: auto;
  box-shadow: 0 12px 28px rgba(0,0,0,.45);
`;

export const MenuItem = styled.li`
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  color: ${COLORS.text};
  &:hover, &:focus { background: rgba(255,255,255,.02); outline: none; }
`;

export const BadgeInfo = styled(StatusBadge)`
  background: rgba(6,182,212,0.12);
  color: ${COLORS.accent};
`;

export const BadgeWarn = styled(StatusBadge)`
  background: rgba(181,152,43,0.12);
  color: ${COLORS.warn};
`;

/* Table (desktop) */
export const TableWrapper = styled.div` overflow-x:auto; display:none; @media (min-width:768px){ display:block; } `;
export const TablePanel = styled.div`
  width: 100%;
  max-width: none; /* remove limite para permitir ocupar toda a largura do parent */
  width: 100%;
  margin: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(32px);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  overflow: hidden;
`;

export const Table = styled.table`
  width:100%;
  border-collapse:separate;
  border-spacing:0;
`;
export const Th = styled.th`
  text-align:left;
  padding:16px 24px;
  font-size:14px;
  font-weight:600;
  color: ${COLORS.muted};
`;
export const Td = styled.td`
  padding:24px;
  vertical-align:middle;
  color: ${COLORS.text};
`;

export const THeadRow = styled.tr`
  border-bottom: 1px solid rgba(51,65,85,0.5);
`;

export const TRow = styled.tr`
  transition: background-color .2s ease;
  &:hover { background-color: rgba(51,65,85,0.6); }
  &:nth-child(odd) { background-color: rgba(30,41,59,0.4); }
`;

export const SecondaryText = styled.div`
  font-size: 12px;
  color: ${COLORS.muted};
`;

export const StrongText = styled.div`
  font-weight: 500;
  color: ${COLORS.text};
`;

export const SecondaryTextMuted = styled(SecondaryText)`
  color: #64748B; /* slate-500 */
`;

export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export default Root;
