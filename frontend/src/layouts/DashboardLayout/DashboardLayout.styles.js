import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';
import breakpoints from '../../styles/breakpoints';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Outer = styled.div`
  height: 100vh;
  min-height: 0;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 18px;
  padding: 18px;
  background:
    radial-gradient(1100px 600px at 10% -20%, rgba(56,178,172,0.06), transparent 50%),
    radial-gradient(900px 500px at 110% 120%, rgba(56,178,172,0.05), transparent 50%),
    var(--color-bg-dark);

  /* Tablet: sidebar colapsável ou menor */
  @media (max-width: ${breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    height: auto;
    padding: 12px;
    gap: 12px;
  }

  /* Mobile: sem sidebar no grid */
  @media (max-width: ${breakpoints.mobile - 1}px) {
    grid-template-columns: 1fr;
    padding: 0;
    gap: 0;
    height: 100vh;
  }
`;

export const Sidebar = styled.aside`
  background: var(--color-sidebar-bg);
  border-radius: 24px;
  box-shadow: 0 14px 40px rgba(0,0,0,.35);
  border: 1px solid rgba(0,0,0,.25);
  position: sticky;
  top: 18px;
  height: calc(100vh - 36px);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Tablet: ajustes */
  @media (max-width: ${breakpoints.tablet - 1}px) {
    position: static;
    height: auto;
    max-height: 80vh;
  }

  /* Mobile: escondido (usar MobileSidebar) */
  @media (max-width: ${breakpoints.mobile - 1}px) {
    display: none;
  }
`;

export const Brand = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 26px 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  img {
    width: 170px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 0 14px rgba(56,178,172,0.35));
  }
`;

export const Nav = styled.nav`
  padding: 18px 12px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow: auto;
`;

export const NavItem = styled(NavLink)`
  --padX: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 10px var(--padX);
  border-radius: 14px;
  color: var(--color-text-light);
  opacity: .9;
  transition: background .15s ease, opacity .15s ease, color .15s ease;
  margin-bottom: 0;
  &:hover { background: rgba(255,255,255,0.06); opacity: 1; }
  &.active {
    background: rgba(56,178,172,0.16);
    color: var(--color-text-light);
    box-shadow: inset 0 0 0 1px rgba(56,178,172,0.28);
  }
  .label { font-weight: 600; }
`;

export const SidebarFooter = styled.div`
  padding: 18px 20px 20px 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: grid;
  gap: 10px;
`;

export const UserName = styled.div`
  font-weight: 800;
  text-align: center;
`;

export const Logout = styled.button`
  height: 44px;
  border: none;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  color: var(--color-text-light);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background .15s ease, transform .1s ease;
  &:hover { background: rgba(255,255,255,0.12); }
  &:active { transform: translateY(1px); }
`;

export const ContentCol = styled.div`
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 36px);
  display: grid;

  /* Mobile: altura automática */
  @media (max-width: ${breakpoints.mobile - 1}px) {
    height: 100vh;
  }
`;

export const Canvas = styled.div`
  background: #1d2c2f;
  border: 1px solid rgba(0,0,0,.28);
  border-radius: 24px;
  box-shadow: 0 14px 40px rgba(0,0,0,.35);
  overflow: hidden;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  position: relative;
  z-index: 1; /* Menor que o hambúrguer (1001) */

  /* Mobile: ajustes de altura e borda */
  @media (max-width: ${breakpoints.mobile - 1}px) {
    border-radius: 0;
    min-height: 100vh;
    height: auto;
  }

  /* Tablet: altura automática */
  @media (max-width: ${breakpoints.tablet - 1}px) {
    height: auto;
    min-height: 100vh;
  }
`;

export const TopInfoBar = styled.div`
  height: 68px;
  background: linear-gradient(180deg, rgba(2,6,23,.82), rgba(2,6,23,.42));
  border-bottom: 1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(6px);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 0 16px;

  /* Mobile: adicionar padding-left para não sobrepor o menu hambúrguer */
  @media (max-width: ${breakpoints.mobile - 1}px) {
    padding-left: 70px; /* Espaço para o hambúrguer (48px de largura + 20px de left + 2px de margem) */
    padding-right: 12px;
    grid-template-columns: auto; /* Apenas 1 coluna, esconder TimeCenter */
    justify-content: flex-end; /* Alinhar à direita */
  }
`;

export const TimeCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: var(--color-text-light);

  /* Mobile: esconder completamente */
  @media (max-width: ${breakpoints.mobile - 1}px) {
    display: none;
  }
`;

export const UserChip = styled.div`
  display: inline-flex; 
  align-items: center; 
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.06);
  color: var(--color-text-light);
  font-weight: 600;

  /* Mobile: ajustes de padding */
  @media (max-width: 640px) {
    gap: 6px;
    padding: 6px 10px;
  }
`;

export const UserChipText = styled.span`
  /* Desktop: mostrar texto */
  display: inline;

  /* Mobile: esconder texto, mostrar apenas ícone e iniciais */
  @media (max-width: 640px) {
    display: none;
  }
`;

export const UserChipInitials = styled.span`
  /* Desktop: esconder iniciais */
  display: none;

  /* Mobile: mostrar iniciais */
  @media (max-width: 640px) {
    display: inline-flex;
    font-size: 11px;
    font-weight: 700;
    min-width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
    background: rgba(56,178,172,0.2);
    border-radius: 50%;
    margin-left: 4px;
  }
`;

export const ContentScroll = styled.div`
  min-height: 0;
  overflow: auto;
  padding: 28px 28px 34px;
  animation: ${fadeIn} .25s ease;

  /* Mobile: padding menor */
  @media (max-width: ${breakpoints.mobile - 1}px) {
    padding: 20px 16px 24px;
  }

  &::-webkit-scrollbar { width: 10px; height: 10px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(148,163,184,0.25);
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

