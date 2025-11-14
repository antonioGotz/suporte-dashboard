import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaBell } from 'react-icons/fa';
import api from '../services/api';
import useToast from '../hooks/useToast';
import Toast from './Toast.jsx';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

const BellWrap = styled.div`
  position: relative;
`;

const BellBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.06);
  color: var(--color-text-light);
  cursor: pointer;
  transition: background .15s ease, transform .1s ease;
  position: relative;
  z-index: 2100;
  &:hover { background: rgba(255,255,255,0.1); }
  &:active { transform: translateY(1px); }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.25);
`;

const Dropdown = styled.section`
  position: fixed;
  top: ${({ $top }) => `${Math.max($top, 0)}px`};
  right: ${({ $right }) => `${Math.max($right, 12)}px`};
  width: clamp(320px, 24vw, 380px);
  background: linear-gradient(135deg, rgba(17,24,39,0.98), rgba(30,41,59,0.95));
  color: var(--color-text-light);
  border-radius: 16px;
  border: 1px solid rgba(148,163,184,0.22);
  box-shadow: 0 18px 45px rgba(15,23,42,0.45), 0 4px 18px rgba(14,21,33,0.35);
  overflow: hidden;
  /* Elevado para garantir que o painel apareça acima de overlays e toasts */
  z-index: 2147483647;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

const DropHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(148,163,184,0.18);
  font-weight: 700;
  font-size: 15px;
  background: rgba(15,23,42,0.65);
`;

const DropHeaderAction = styled.button`
  background: rgba(148,163,184,0.12);
  border: 1px solid rgba(148,163,184,0.2);
  color: var(--color-text-light);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background .15s ease, transform .15s ease;
  &:hover { background: rgba(148,163,184,0.16); }
  &:active { transform: translateY(1px); }
`;

const DropList = styled.div`
  max-height: 360px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const checkIn = keyframes`
  0% { transform: scale(0.6) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const strokeDraw = keyframes`
  from { stroke-dashoffset: 22; }
  to { stroke-dashoffset: 0; }
`;

const CheckWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: linear-gradient(180deg, rgba(34,197,94,1), rgba(16,185,129,0.95));
  box-shadow: 0 6px 18px rgba(34,197,94,0.18);
  color: #052e14;
  margin-left: 8px;
  padding: 3px;
  animation: ${checkIn} 420ms cubic-bezier(.22,.61,.36,1) both;
`;

const StyledSvg = styled.svg`
  width: 14px;
  height: 14px;
  display: block;
  & path {
    stroke: #052e14;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 22;
    stroke-dashoffset: 22;
    animation: ${strokeDraw} 420ms ease forwards;
  }
`;

function CheckMarkSVG() {
  return (
    <CheckWrap aria-hidden>
      <StyledSvg viewBox="0 0 24 24" aria-hidden>
        <path d="M5 13l4 4L19 7" />
      </StyledSvg>
    </CheckWrap>
  );
}

const newBadge = keyframes`
  0% { transform: translateX(-8px) scale(0.98); opacity: 0; }
  60% { transform: translateX(4px) scale(1.01); opacity: 1; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 6px 18px rgba(34,197,94,0.04); }
  50% { box-shadow: 0 14px 34px rgba(34,197,94,0.08); }
  100% { box-shadow: 0 6px 18px rgba(34,197,94,0.04); }
`;

const Item = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  color: inherit;
  cursor: pointer;
  padding: 12px 18px 12px 28px;
  display: grid;
  gap: 6px;
  border-bottom: 1px solid rgba(148,163,184,0.12);
  transition: background .15s ease, box-shadow .2s ease, transform .18s ease;
  position: relative;
  will-change: transform, box-shadow;
  &:hover { background: rgba(148,163,184,0.12); transform: translateY(-2px); }
  &:focus-visible {
    outline: 2px solid rgba(96,165,250,0.6);
    outline-offset: 2px;
  }
  /* borda / destaque para notificações de assinante novo */
  ${({ $isNewSubscriber }) => $isNewSubscriber ? css`
    border: 1px solid rgba(34,197,94,0.18);
    box-shadow: 0 12px 30px rgba(34,197,94,0.06);
    background: linear-gradient(180deg, rgba(34,197,94,0.03), rgba(34,197,94,0.01));
    border-bottom: 1px solid rgba(34,197,94,0.08);
    animation: ${newBadge} 0.6s cubic-bezier(.22,.61,.36,1);
    &::after { content: ''; position: absolute; left: 10px; top: 10px; bottom: 10px; width: 6px; border-radius: 999px; background: linear-gradient(180deg, rgba(34,197,94,0.95), rgba(16,185,129,0.6)); box-shadow: 0 6px 18px rgba(34,197,94,0.12); }
    & { animation: ${glow} 3.6s ease-in-out infinite; }
  ` : ''}
`;

const ItemHighlight = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 74%;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(59,130,246,0.9), rgba(96,165,250,0.4));
  box-shadow: 0 6px 18px rgba(59,130,246,0.12);
`;

const ItemTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemBody = styled.div`
  font-size: 13px;
  opacity: 0.85;
`;

const ItemMeta = styled.div`
  font-size: 12px;
  opacity: 0.65;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Tag = styled.span`
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(59,130,246,0.18);
  color: rgba(191,219,254,0.95);
  padding: 3px 8px;
  border-radius: 999px;
`;

const EmptyState = styled.div`
  padding: 24px 18px;
  text-align: center;
  font-size: 14px;
  opacity: 0.75;
`;

const GroupHeader = styled.div`
  padding: 10px 18px 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
  background: rgba(15,23,42,0.35);
  &:not(:first-of-type) {
    margin-top: 6px;
  }
`;

const Footer = styled.div`
  padding: 10px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background: rgba(15,23,42,0.5);
`;

function NotificationBell() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const lastCount = useRef(0);
  const timer = useRef(null);
  const inFlight = useRef(false);
  const lastCallAt = useRef(0);
  const baseInterval = useRef(12000); // 12s polling base
  const backoffMs = useRef(0); // 0 = sem backoff; sobe com 429: 2s, 4s, 8s... até 30s
  const navigate = useNavigate();
  const { showToast, toast, exit: toastExit } = useToast();
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, right: 16 });
  const [justReadIds, setJustReadIds] = useState([]); // ids recentemente marcados como lidos (para animação)

  const updatePosition = useCallback(() => {
    const anchor = containerRef.current;
    if (!anchor) return;
    if (typeof window === 'undefined') return;
    const rect = anchor.getBoundingClientRect();
    const margin = 12;
    setCoords({
      top: rect.bottom + margin,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, []);

  const scheduleNext = (customDelay) => {
    if (timer.current) clearTimeout(timer.current);
    const delay = typeof customDelay === 'number'
      ? customDelay
      : Math.max(baseInterval.current, backoffMs.current || 0);
    timer.current = setTimeout(() => {
      // Chamada programada respeita inFlight e throttle por evento
      loadCount();
    }, delay);
  };

  const loadCount = async () => {
    // Throttle simples: evita rajadas (429) se já houver requisição em andamento
    const now = Date.now();
    if (inFlight.current) return;
    if (now - lastCallAt.current < 4000) return; // mínimo 4s entre chamadas acionadas por eventos
    inFlight.current = true;
    lastCallAt.current = now;
    try {
      const res = await api.get('/admin/notifications/count');
      const c = res.data?.unread ?? 0;
      const prev = lastCount.current;
      setCount(c);
      lastCount.current = c;
      if (c > prev) {
        // novo alerta chegou: busca o topo e mostra toast
        const list = await api.get('/admin/notifications', { params: { limit: 1, unread: 1 } });
        const n = Array.isArray(list.data?.data) ? list.data.data[0] : null;
        if (n) {
            // usar estilo success para notificações de assinante (novo assinante)
            const isSubscriber = typeof n.type === 'string' && n.type.includes('subscriber');
            showToast(isSubscriber ? 'success' : 'info', { title: n.title || 'Nova notificação', body: n.body || n.type, duration: 8000 });
        }
      }
      // Sucesso: reseta backoff e agenda próximo pelo intervalo base
      backoffMs.current = 0;
      scheduleNext();
    } catch (e) {
      // 429: aplica exponential backoff (2s, 4s, 8s... máx 30s)
      const status = e?.response?.status;
      if (status === 429) {
        backoffMs.current = Math.min(backoffMs.current ? backoffMs.current * 2 : 2000, 30000);
      }
      // Agenda próximo com backoff (ou mantém base se outro erro)
      scheduleNext();
    } finally {
      inFlight.current = false;
    }
  };

  const loadList = async () => {
    try {
      const res = await api.get('/admin/notifications', { params: { limit: 20 } });
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {}
  };

  useEffect(() => {
    // Primeira carga + agenda o próximo ciclo por timeout (permite backoff variável)
    loadCount();
    scheduleNext();
    const onFocus = () => loadCount();
    const onVis = () => { if (document.visibilityState === 'visible') loadCount(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      const anchor = containerRef.current;
      const panel = dropdownRef.current;
      if (anchor && anchor.contains(event.target)) return;
      if (panel && panel.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    if (typeof window === 'undefined') return undefined;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  const mapTypeLabel = (type) => {
    const labels = {
      subscriber_pending: 'Pendente',
      subscriber_approved: 'Aprovada',
      subscriber_canceled: 'Cancelada',
      subscriber_reactivated: 'Reativada',
      demo_subscriber_pending: 'Demo pendente',
      demo_subscriber_approved: 'Demo aprovada',
      separation_status_changed: 'Separação',
      separation_due_soon: 'Separação - prazo',
      separation_overdue: 'Separação - atrasado',
    };
    return labels[type] || type;
  };

  const formatCreatedAt = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGroupMeta = (rawDate) => {
    const fallback = { key: 'unknown', label: 'Outros', sortValue: -Infinity };
    if (!rawDate) return fallback;
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return fallback;
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const startOfDay = new Date(year, month, day);
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((startOfToday - startOfDay) / 86400000);
    let label = startOfDay.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (diffDays === 0) label = 'Hoje';
    else if (diffDays === 1) label = 'Ontem';
    return { key, label, sortValue: startOfDay.getTime() };
  };

  const groupedNotifications = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];
    const groupsMap = new Map();
    items.forEach((notification) => {
      const timestamp = notification.created_at || notification.updated_at || notification.read_at;
      const meta = getGroupMeta(timestamp);
      if (!groupsMap.has(meta.key)) {
        groupsMap.set(meta.key, { key: meta.key, label: meta.label, sortValue: meta.sortValue, items: [] });
      }
      groupsMap.get(meta.key).items.push(notification);
    });

    const result = Array.from(groupsMap.values());
    result.forEach((group) => {
      group.items.sort((a, b) => {
        const aDate = new Date(a.created_at || a.updated_at || 0).getTime();
        const bDate = new Date(b.created_at || b.updated_at || 0).getTime();
        return bDate - aDate;
      });
    });
    result.sort((a, b) => b.sortValue - a.sortValue);
    return result;
  }, [items]);

  const toggleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      updatePosition();
      await loadList();
    }
  };

  const markOne = async (id) => {
    try {
      await api.post(`/admin/notifications/${id}/read`);
      setItems(prev => prev.map(it => it.id === id ? { ...it, read_at: new Date().toISOString() } : it));
      setCount(c => Math.max(0, c - 1));
      // animar check para o item marcado
      setJustReadIds(prev => [...prev, id]);
      setTimeout(() => setJustReadIds(prev => prev.filter(x => x !== id)), 1400);
    } catch {}
  };

  const markAll = async () => {
    try {
      await api.post('/admin/notifications/read-all');
      const now = new Date().toISOString();
      setItems(prev => prev.map(it => ({ ...it, read_at: now })));
      // animar checks para todos os itens exibidos
      setJustReadIds(prevIds => {
        const ids = Array.from(new Set([...(prevIds||[]), ...items.map(it => it.id)]));
        setTimeout(() => setJustReadIds(current => current.filter(() => false)), 1400);
        return ids;
      });
      setCount(0);
    } catch {}
  };

  const resolvePath = (n) => {
    const t = n?.type || '';
    const data = n?.data || {};
    if (t === 'demo_subscriber_pending') {
      if (data && data.user_id) return `/assinantes/${data.user_id}?origin=demo&status=solicitacoes`;
      return '/assinantes?status=solicitacoes&origin=demo';
    }
    if (t === 'subscriber_pending') return '/assinantes?status=pending';
    if (t === 'subscriber_approved') return data.user_id ? `/assinantes/${data.user_id}` : '/assinantes';
    if (t === 'demo_subscriber_approved') {
      if (data.user_id) return `/assinantes/${data.user_id}?origin=demo`;
      return '/assinantes?origin=demo';
    }
    if (t === 'subscriber_canceled') return data.user_id ? `/assinantes/${data.user_id}` : '/assinantes';
    if (t === 'subscriber_reactivated') return data.user_id ? `/assinantes/${data.user_id}` : '/assinantes';
    if (t === 'separation_status_changed' || t === 'separation_due_soon' || t === 'separation_overdue') {
      if (data && data.order_id) return `/separacao?order_id=${data.order_id}`;
      return '/separacao';
    }
    return '/dashboard';
  };

  const navigateFor = async (n) => {
    try { await markOne(n.id); } catch {}
    const to = resolvePath(n);
    navigate(to);
    setOpen(false);
  };

  return (
    <BellWrap ref={containerRef}>
      <BellBtn aria-haspopup="menu" aria-expanded={open} onClick={toggleOpen} title="Notificações">
        <FaBell />
      </BellBtn>
      {count > 0 && <Badge>{count > 9 ? '9+' : count}</Badge>}
      {open && typeof document !== 'undefined' && createPortal(
        (
          <Dropdown
            ref={dropdownRef}
            role="menu"
            aria-label="Notificações"
            $top={coords.top}
            $right={coords.right}
          >
            <DropHeader>
              <span>Notificações</span>
              <DropHeaderAction onClick={markAll}>Marcar tudo</DropHeaderAction>
            </DropHeader>
            <DropList>
              {groupedNotifications.length === 0 ? (
                <EmptyState>Sem notificações</EmptyState>
              ) : groupedNotifications.map((group) => (
                <React.Fragment key={group.key}>
                  <GroupHeader>{group.label}</GroupHeader>
                  {group.items.map((n) => {
                    const unread = !n.read_at;
                    const createdAt = n.created_at || n.updated_at;
                    return (
                      <Item
                        key={n.id}
                        onClick={() => navigateFor(n)}
                        aria-pressed={!unread}
                        $isNewSubscriber={unread && n.type && n.type.includes('subscriber')}
                      >
                        {unread && <ItemHighlight aria-hidden />}
                        <ItemTitle>
                          <span>{n.title || 'Notificação'}</span>
                          {n.type && <Tag>{mapTypeLabel(n.type)}</Tag>}
                        </ItemTitle>
                        {n.body && <ItemBody>{n.body}</ItemBody>}
                        <ItemMeta>
                          <span>{formatCreatedAt(createdAt)}</span>
                          {unread ? (
                            <strong style={{ fontSize: 11 }}>Novo</strong>
                          ) : (
                            (justReadIds.includes(n.id)) ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <CheckMarkSVG />
                                <span style={{ fontSize: 12, opacity: 0.85 }}>Lida</span>
                              </span>
                            ) : (
                              <span>Lida</span>
                            )
                          )}
                        </ItemMeta>
                      </Item>
                    );
                  })}
                </React.Fragment>
              ))}
            </DropList>
            <Footer>
              <DropHeaderAction onClick={markAll}>Marcar todas como lidas</DropHeaderAction>
            </Footer>
          </Dropdown>
        ),
        document.body
      )}
  {toast && <Toast message={toast.message} type={toast.type} exit={toastExit} />}
    </BellWrap>
  );
}

export default NotificationBell;
