import React, { useMemo, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaHome, FaUsers, FaBox, FaCubes, FaSignOutAlt, FaHistory, FaUserCircle, FaTicketAlt, FaEnvelope, FaAddressBook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import logoUrl from '../assets/logo.png';
import NotificationBell from '../components/NotificationBell.jsx';
import Clock from '../components/Clock.jsx';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Outer = styled.div`
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

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
    padding: 12px;
    gap: 12px;
  }
`;

const Sidebar = styled.aside`
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

  @media (max-width: 1024px) {
    position: static;
    height: auto;
  }
`;

const Brand = styled.header`
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

const Nav = styled.nav`
  padding: 18px 12px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow: auto;
`;

const NavItem = styled(NavLink)`
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

const SidebarFooter = styled.div`
  padding: 18px 20px 20px 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: grid;
  gap: 10px;
`;

const UserName = styled.div`
  font-weight: 800;
  text-align: center;
`;

const Logout = styled.button`
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

const ContentCol = styled.div`
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 36px);
  display: grid;
`;

const Canvas = styled.div`
  background: #1d2c2f;
  border: 1px solid rgba(0,0,0,.28);
  border-radius: 24px;
  box-shadow: 0 14px 40px rgba(0,0,0,.35);
  overflow: hidden;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);

  @media (max-width: 1024px) {
    height: auto;
  }
`;

const TopInfoBar = styled.div`
  height: 68px;
  background: linear-gradient(180deg, rgba(2,6,23,.82), rgba(2,6,23,.42));
  border-bottom: 1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(6px);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 0 16px;
`;

const TimeCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: var(--color-text-light);
`;

const UserChip = styled.div`
  display: inline-flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.06);
  color: var(--color-text-light);
  font-weight: 600;
`;

const ContentScroll = styled.div`
  min-height: 0;
  overflow: auto;
  padding: 28px 28px 34px;
  animation: ${fadeIn} .25s ease;

  &::-webkit-scrollbar { width: 10px; height: 10px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(148,163,184,0.25);
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = useMemo(() => ([
    { to: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { to: '/assinantes', label: 'Assinantes', icon: <FaUsers /> },
    {
      label: 'Separação',
      icon: <FaCubes />,
      children: [
        { to: '/separacao', label: 'Pedidos para Separar', icon: <FaCubes /> },
        { to: '/shipping/labels', label: 'Histórico de Etiquetas', icon: <FaTicketAlt /> },
      ]
    },
    { to: '/produtos', label: 'Produtos', icon: <FaBox /> },
    { to: '/historico', label: 'Histórico', icon: <FaHistory /> },
    {
      label: 'Contatos',
      icon: <FaAddressBook />,
      children: [
        { to: '/email-composer', label: 'E-mail', icon: <FaEnvelope /> },
      ],
    },
    { to: '/demo-subscribers', label: 'Demo', icon: <FaTicketAlt /> },
  ]), []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Outer>
      <Sidebar aria-label="Menu lateral">
        <Brand>
          <img src={logoUrl} alt="Logo Evolua" />
        </Brand>
        <Nav>
          {navItems.map(item => {
            if (item.children) {
              const [open, setOpen] = useState(false);
              return (
                <div key={item.label} style={{ marginBottom: 0 }}>
                  <NavItem
                    as="div"
                    style={{
                      cursor: 'pointer',
                      opacity: 0.95,
                      userSelect: 'none',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: 0
                    }}
                    onClick={() => setOpen(o => !o)}
                    aria-expanded={open}
                  >
                    <span aria-hidden>{item.icon}</span>
                    <span className="label">{item.label}</span>
                    <span
                      style={{
                        position: 'absolute',
                        right: 18,
                        top: '50%',
                        transform: `translateY(-50%) ${open ? 'rotate(90deg)' : 'rotate(0deg)'}`,
                        transition: 'transform 0.28s cubic-bezier(.4,1.4,.6,1)',
                        opacity: 0.7,
                        fontSize: 18,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        height: 18
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </NavItem>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 0,
                      marginBottom: 0,
                      maxHeight: open ? 80 : 0,
                      overflow: 'hidden',
                      opacity: open ? 1 : 0,
                      transition: 'max-height 0.38s cubic-bezier(.4,1.4,.6,1), opacity 0.28s',
                      background: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    {item.children.map(child => (
                      <NavItem key={child.to} to={child.to} style={{ fontSize: 15, padding: '8px 10px', marginBottom: 0 }}>
                        <span aria-hidden>{child.icon}</span>
                        <span className="label">{child.label}</span>
                      </NavItem>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <NavItem key={item.to} to={item.to}>
                <span aria-hidden>{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavItem>
            );
          })}
        </Nav>
        <SidebarFooter>
          <UserName>{user?.name || 'Antonio Augusto'}</UserName>
          <Logout onClick={handleLogout}>
            <FaSignOutAlt />
            <span style={{ marginLeft: 8 }}>Sair</span>
          </Logout>
        </SidebarFooter>
      </Sidebar>
      <ContentCol>
        <Canvas>
          <TopInfoBar>
            <TimeCenter>
              <Clock />
            </TimeCenter>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <NotificationBell />
              <UserChip><FaUserCircle /> {user?.name || 'Conectado'}</UserChip>
            </div>
          </TopInfoBar>
          <ContentScroll key={`${location.pathname}${location.search}${location.hash}`}>
            <Outlet />
          </ContentScroll>
        </Canvas>
      </ContentCol>
    </Outer>
  );
};

export default DashboardLayout;
