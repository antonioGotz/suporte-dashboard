import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { normalizeProductName, classifySLA } from './separation.utils.js';
import * as S from '../SeparationList.styles.js';
import StatusBadge from '../../components/StatusBadge';
import { FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';

// Mapeia o status code para a classe CSS correspondente no styled-component
const getStatusClass = (statusCode) => {
  const statusMap = {
    processing: 'status-em-separacao', // Exemplo, ajuste conforme seus status
    pending: 'status-aguardando-separacao', // Exemplo
    shipped: 'status-enviado', // Exemplo
  };
  // O nome da classe deve corresponder ao que está em SeparationList.styles.js
  // Ex: 'status-em-separacao' para .status-em-separacao
  return statusMap[statusCode] || 'status-default';
};

export default function SeparationListCustom({
  items = [],
  loading = false,
  onSetStatus,
  onUpdateStatus,
  onGenerateLabel,
  statusPipeline = [],
  stageByCode = {},
  updatingIds = {},
  labelLocked = {},
  // filter/sort props
  statusOptions = [],
  statusFilter,
  setStatusFilter,
  sortBy,
  sortDir,
  toggleSort,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuDirectionById, setMenuDirectionById] = useState({});
  const buttonRefs = React.useRef({});
  const containerRefs = React.useRef({});
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const headerMenuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      try {
        if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
          setStatusMenuOpen(false);
        }
      } catch {}
    }
    if (statusMenuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [statusMenuOpen]);

  // Retorna apenas os dois primeiros nomes de uma string de nome completo.
  // Ex: "Maria das Dores Silva" -> "Maria das"
  // Trata null/undefined e reduz múltiplos espaços.
  const twoNames = (fullName) => {
    if (!fullName && fullName !== 0) return '';
    try {
      const cleaned = String(fullName).trim().replace(/\s+/g, ' ');
      if (!cleaned) return '';
      const parts = cleaned.split(' ');
      if (parts.length <= 2) return cleaned;
      return parts.slice(0, 2).join(' ');
    } catch (err) {
      return String(fullName);
    }
  };

  const handleToggleMenu = (orderId) => {
    try {
      const el = buttonRefs.current[orderId];
      if (el && typeof window !== 'undefined') {
        const rect = el.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dir = (spaceBelow >= 260 || spaceBelow >= spaceAbove) ? 'down' : 'up';
        setMenuDirectionById(prev => ({ ...prev, [orderId]: dir }));
      }
    } catch {}
    setOpenMenuId(prevId => (prevId === orderId ? null : orderId));
  };

  // Fecha o menu ao clicar fora ou ao pressionar ESC
  React.useEffect(() => {
    if (!openMenuId) return;
    const handleDocClick = (e) => {
      try {
        const container = containerRefs.current[openMenuId];
        if (container && !container.contains(e.target)) {
          setOpenMenuId(null);
        }
      } catch {}
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpenMenuId(null);
    };
    const handleScroll = () => {
      // fecha em qualquer scroll (página ou container), evita menu “perdido”
      setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleDocClick, true);
    document.addEventListener('touchstart', handleDocClick, true);
    document.addEventListener('keydown', handleKey, true);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleDocClick, true);
      document.removeEventListener('touchstart', handleDocClick, true);
      document.removeEventListener('keydown', handleKey, true);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [openMenuId]);

  const handleAdvance = async (orderId, nextStatusCode) => {
    if (!orderId || !onSetStatus) return;
    try {
      await onSetStatus(orderId, nextStatusCode);
      setOpenMenuId(null); // Fecha o menu após a ação
    } catch (err) {
      console.error('onSetStatus error', err);
    }
  };

  const cards = useMemo(() => items.map((item) => {
    const stage = item.status_code ? stageByCode[item.status_code] : undefined;
    const product = normalizeProductName(item.product_to_send?.name || item.product_name || '—');
    // compute human-readable SLA text (same logic used in SeparationListItem)
    const slaText = (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      try {
        const d = new Date(String(item.next_shipment_date || '') + 'T00:00:00');
        const diff = Math.ceil((d - today) / (24 * 60 * 60 * 1000));
        if (Number.isNaN(diff)) return '';
        if (diff < 0) return 'Prazo encerrado';
        if (diff === 0) return 'Envia hoje';
        if (diff === 1) return 'Resta 1 dia';
        return `Restam ${diff} dias`;
      } catch {
        return '';
      }
    })();
    const sla = classifySLA(item.next_shipment_date);
    return { item, stage, product, sla, slaText };
  }), [items, stageByCode]);

  const emptyMessage = useMemo(() => {
    if (!statusFilter || statusFilter === 'all') return 'Sem resultados';
    const label = stageByCode?.[statusFilter]?.statusLabel || statusFilter;
    return `Nenhum item encontrado para o status "${label}".`;
  }, [stageByCode, statusFilter]);

  return (
    <S.CustomMain>
      <S.CustomTable>
        {/* Cabeçalho */}
        <S.CustomTr className="header">
          <S.CustomTh colSpan={3} align="left">Assinante / Bebê</S.CustomTh>
          <S.CustomTh colSpan={2} align="left">Pedido</S.CustomTh>
          <S.CustomTh colSpan={3} align="left">Brinquedo / Idade</S.CustomTh>
          <S.CustomTh colSpan={2} align="left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <S.HeaderSort onClick={() => toggleSort && toggleSort('status')} aria-label="Ordenar por status">
                <span>Status</span>
                {sortBy === 'status'
                  ? (sortDir === 'asc'
                      ? <FaSortUp size={14} style={{ color: 'var(--color-primary, #9dd9d2)' }} />
                      : <FaSortDown size={14} style={{ color: 'var(--color-primary, #9dd9d2)' }} />)
                  : <FaSort size={14} style={{ color: 'var(--color-muted, #94a3b8)' }} />
                }
              </S.HeaderSort>
              <div ref={headerMenuRef} style={{ position: 'relative' }}>
                <S.MenuButton className="icon-only" onClick={() => setStatusMenuOpen(p => !p)} aria-haspopup="true" aria-expanded={statusMenuOpen} title="Filtrar por status" aria-label="Filtrar por status">
                  <S.HeaderIcon><FaFilter size={14} /></S.HeaderIcon>
                </S.MenuButton>
                {statusMenuOpen && (
                  <S.MenuList $isOpen={statusMenuOpen} $direction="down">
                    {statusOptions.map((o) => (
                      <S.MenuItem key={String(o.value)} onClick={() => {
                        try { setStatusFilter && setStatusFilter(o.value === 'all' ? 'all' : o.value); } finally { setStatusMenuOpen(false); }
                      }}>
                        <span style={{ marginRight: 8 }}>{String(o.value) === String(statusFilter) ? '✓' : ''}</span>
                        <span>{o.label}</span>
                      </S.MenuItem>
                    ))}
                  </S.MenuList>
                )}
              </div>
            </div>
          </S.CustomTh>
          <S.CustomTh colSpan={2} align="right">Ação</S.CustomTh>
        </S.CustomTr>

        {/* Linhas de Dados */}
        {loading ? (
          [...Array(4)].map((_, idx) => (
            <S.CustomTr key={`sk-${idx}`} className={`data-row ${idx % 2 === 0 ? 'odd' : 'even'}`}>
              <S.CustomTd colSpan={12}>
                <div style={{ height: 18, width: '100%', background: 'rgba(148,163,184,.18)', borderRadius: 8 }} />
              </S.CustomTd>
            </S.CustomTr>
          ))
        ) : cards.length > 0 ? (
          cards.map(({ item, stage, product }, idx) => (
            <S.CustomTr key={item.order_id} className={`data-row ${idx % 2 === 0 ? 'odd' : 'even'}`}>
              {/* Assinante / Bebê */}
              <S.CustomTd colSpan={3}>
                <div className="two-line">
                  <span className="main-text">{twoNames(item.mother_name)}</span>
                  <span className="secondary-text">Criança: {twoNames(item.baby_name)}</span>
                </div>
              </S.CustomTd>

              {/* Pedido */}
              <S.CustomTd colSpan={2}>
                <div className="two-line">
                  <span className="main-text">#{item.order_id}</span>
                  <S.SecondaryMuted className="secondary-text">{item.plan_name}</S.SecondaryMuted>
                </div>
              </S.CustomTd>

              {/* Brinquedo / Idade */}
              <S.CustomTd colSpan={3}>
                <div className="two-line">
                  <span className="main-text">{product}</span>
                  <span className="secondary-text">{item.baby_age_label}</span>
                </div>
              </S.CustomTd>

              {/* Status */}
              <S.CustomTd colSpan={2}>
                {/* Migrado de inline styles: StatusBlock centraliza badges/status */}
                <S.StatusBlock align="flex-start">
                  <StatusBadge size="compact" statusCode={item.status_code} label={stage?.statusLabel || item.status || '—'} />
                  {/* Migrado de inline: SlaRow substitui a div que continha dot + texto */}
                  <S.SlaRow>
                    <S.Dot intent={cards[idx].sla?.intent} />
                    <S.SlaText>{cards[idx].slaText || cards[idx].sla?.label}</S.SlaText>
                  </S.SlaRow>
                </S.StatusBlock>
              </S.CustomTd>

              {/* Ação */}
              <S.CustomTd colSpan={2} align="right" className="cell-actions">
                <S.MenuContainer ref={el => { if (el) containerRefs.current[item.order_id] = el; }}>
                    {(() => {
                      const isUpdating = Boolean(updatingIds?.[item.order_id]);
                      const isLabelGenerated = Boolean(labelLocked?.[item.order_id] || item.label_generated);
                      const canGenerate = stage?.statusCode === 'shipped' || stage?.key === 'shipped';
                      const printTitle = isUpdating
                        ? 'Processando...'
                        : isLabelGenerated
                          ? 'Etiqueta já gerada'
                          : canGenerate
                            ? 'Gerar etiqueta'
                            : 'Aguardando status "Enviado"';
                      return (
                        <>
                          {/* Botão "Definir" neutro, sem chevron */}
                          <S.MenuButton ref={el => { if (el) buttonRefs.current[item.order_id] = el; }} onClick={() => handleToggleMenu(item.order_id)} disabled={isUpdating} title={isUpdating ? 'Ação em andamento' : 'Definir status'}>
                            {isUpdating ? 'Processando...' : 'Definir'}
                          </S.MenuButton>

                          {/* Botão de impressão sempre visível, circular outline */}
                          <S.MenuButton
                            className="icon-only"
                            onClick={() => { if (!onGenerateLabel) return; if (canGenerate && !isLabelGenerated && !isUpdating) onGenerateLabel(item.order_id); }}
                            disabled={isUpdating || (!canGenerate && !isLabelGenerated)}
                            title={printTitle}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 6 2 18 2 18 9"></polyline>
                              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                              <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                          </S.MenuButton>

                          <S.MenuList $isOpen={openMenuId === item.order_id} $direction={menuDirectionById[item.order_id] || 'up'} onClick={(e) => e.stopPropagation()}>
                            {/* Prev/Next removidos por Alteração 2 - mantém apenas a lista de status abaixo */}
                            {statusPipeline
                              .filter(s => !s.isFallback)
                              .map(s => (
                                <S.MenuItem 
                                  key={s.statusCode} 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (isUpdating) return; // bloqueia cliques duplicados
                                    handleAdvance(item.order_id, s.statusCode);
                                  }}
                                  aria-disabled={isUpdating}
                                  style={isUpdating ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                                >
                                  {s.statusLabel}
                                </S.MenuItem>
                              ))}
                          </S.MenuList>
                        </>
                      );
                    })()}
                  </S.MenuContainer>
              </S.CustomTd>
            </S.CustomTr>
          ))
        ) : (
          <S.CustomTr className="data-row empty">
            <S.CustomTd colSpan={12} align="center" style={{ padding: '18px 0' }}>
              {emptyMessage}
            </S.CustomTd>
          </S.CustomTr>
        )}
      </S.CustomTable>
    </S.CustomMain>
  );
}
