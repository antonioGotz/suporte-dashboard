import React, { useMemo, useState, useRef, useEffect } from 'react';
import Badge from "../../components/Badge.jsx";
import * as S from '../SeparationList.styles.js';
import SeparationListItem from '../SeparationListItem.jsx';
import SeparationListCustom from '../SeparationListCustom.jsx';
import { FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';

// HeaderSort e HeaderIcon foram movidos para SeparationList.styles.js e são importados via S

export default function SeparationList({
  items = [],
  statusPipeline = [],
  stageByCode = {},
  recentActions = false,
  labelLocked = {},
  updatingIds = {},
  onGenerateLabel,
  onSetStatus,
  onUpdateStatus,
  loading = false,
  // opt-in: 'custom' para usar SeparationListCustom
  presentation = false,
  // filter/sort props moved from page
  statusOptions = [],
  statusFilter,
  setStatusFilter,
  sortBy,
  sortDir,
  toggleSort,
}) {

  const deduped = useMemo(() => Array.from(
    new Map(
      (items || []).map(item => [
        `${item.order_id || ''}_${item.subscriber_id || item.user_id || ''}_${item.child_id || item.baby_name || ''}`,
        item
      ])
    ).values()
  ), [items]);

  // debug: log original vs deduped ids to help detect why a specific order (ex: #270) is missing
  try {
    // eslint-disable-next-line no-console
    console.debug('[SeparationList] original ids:', Array.isArray(items) ? items.map(i => i.order_id) : []);
    // eslint-disable-next-line no-console
    console.debug('[SeparationList] deduped ids:', Array.isArray(deduped) ? deduped.map(i => i.order_id) : []);
  } catch (e) {}

  const statusOrderLookup = useMemo(() => {
    const map = new Map();
    (statusPipeline || []).forEach((stage, idx) => {
      if (!stage || stage.isFallback) return;
      if (stage.statusCode) map.set(stage.statusCode, idx);
    });
    return map;
  }, [statusPipeline]);

  const sorted = useMemo(() => {
    if (!sortBy) return deduped;
    const copy = [...deduped];

    const direction = sortDir === 'desc' ? -1 : 1;

    const valueTuple = (item) => {
      if (!item) return [''];
      if (sortBy === 'status') {
        const code = String(item.status_code || item.status || item.separation_status || '');
        const orderIndex = statusOrderLookup.has(code)
          ? statusOrderLookup.get(code)
          : statusOrderLookup.size + 1;
        const label = (stageByCode && code && stageByCode[code]?.statusLabel)
          || String(item.status || item.separation_status || '')
          || '';
        return [orderIndex, label.toLowerCase()];
      }
      if (sortBy === 'mother_name') {
        const primary = String(item.mother_name || item.user?.name || '').toLowerCase();
        const secondary = String(item.baby_name || '').toLowerCase();
        return [primary, secondary];
      }
      if (sortBy === 'order_id') {
        return [Number(item.order_id) || 0];
      }
      const fallback = item[sortBy];
      return [typeof fallback === 'number' ? fallback : String(fallback ?? '').toLowerCase()];
    };

    const compareTuples = (aTuple, bTuple) => {
      const length = Math.max(aTuple.length, bTuple.length);
      for (let index = 0; index < length; index += 1) {
        const aVal = aTuple[index];
        const bVal = bTuple[index];
        if (aVal === bVal) continue;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return aVal - bVal;
        }
        return String(aVal ?? '').localeCompare(String(bVal ?? ''), 'pt', { sensitivity: 'base' });
      }
      return 0;
    };

    copy.sort((a, b) => compareTuples(valueTuple(a), valueTuple(b)) * direction);
    return copy;
  }, [deduped, sortBy, sortDir, statusOrderLookup, stageByCode]);

  // Header icon wrapper forces color via theme variable and currentColor

  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const headerMenuRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      try {
        if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
          setStatusMenuOpen(false);
        }
      } catch (err) {}
    }
    if (statusMenuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [statusMenuOpen]);

  if (presentation === 'custom') {
    return (
      <>
        <SeparationListCustom
          items={sorted}
          loading={loading}
          updatingIds={updatingIds}
          labelLocked={labelLocked}
          onGenerateLabel={onGenerateLabel}
          onSetStatus={onSetStatus}
            onUpdateStatus={onUpdateStatus}
          statusPipeline={statusPipeline}
          stageByCode={stageByCode}
          // pass filter/sort props to custom view as well
          statusOptions={statusOptions}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          sortDir={sortDir}
          toggleSort={toggleSort}
        />
      </>
    );
  }

  return (
    <S.ListContainer>
      <S.StyledTable>
        <thead>
          <S.Tr>
            <S.Th>Assinante</S.Th>
            <S.Th>Bebê</S.Th>
            <S.ThPedido>Pedido</S.ThPedido>
            <S.ThBrinquedo>Brinquedo</S.ThBrinquedo>
            <S.ThAcAção>Ação</S.ThAcAção>
            <S.ThStatus style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <S.HeaderSort
                  onClick={() => {
                    console.log('CLIQUE: SortButton Status clicado!');
                    if (toggleSort) toggleSort('status');
                  }}
                  aria-label="Ordenar por status"
                >
                  <span>Status</span>
                  {sortBy === 'status'
                    ? (sortDir === 'asc'
                        ? <FaSortUp size={14} style={{ color: 'var(--color-primary, #9dd9d2)' }} />
                        : <FaSortDown size={14} style={{ color: 'var(--color-primary, #9dd9d2)' }} />)
                    : <FaSort size={14} style={{ color: 'var(--color-muted, #94a3b8)' }} />
                  }
                </S.HeaderSort>

                <div ref={headerMenuRef} style={{ position: 'relative' }}>
                  <S.MenuButton className="icon-only" onClick={() => setStatusMenuOpen((p) => !p)} aria-haspopup="true" aria-expanded={statusMenuOpen} title="Filtrar por status" aria-label="Filtrar por status">
                    <S.HeaderIcon><FaFilter size={14} /></S.HeaderIcon>
                  </S.MenuButton>
                  {statusMenuOpen && (
                    <S.MenuList $isOpen={statusMenuOpen} $direction="down">
                      {statusOptions.map((o) => (
                        <S.MenuItem key={String(o.value)} onClick={async () => {
                          try {
                            setStatusFilter && setStatusFilter(o.value === 'all' ? 'all' : o.value);
                            // reset pagination handled by parent when setStatusFilter is called
                          } finally {
                            setStatusMenuOpen(false);
                          }
                        }}>
                          {/* Indica seleção atual */}
                          <span style={{ marginRight: 8 }}>{String(o.value) === String(statusFilter) ? '✓' : ''}</span>
                          <span>{o.label}</span>
                        </S.MenuItem>
                      ))}
                    </S.MenuList>
                  )}
                </div>
              </div>
            </S.ThStatus>
            <S.ThSLA>SLA</S.ThSLA>
          </S.Tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <S.Tr key={`sk-${i}`} $delay={0.08 * (i + 1)}>
                <S.Td colSpan="7">
                  <div style={{ height: 18, width: '100%', background: 'rgba(148,163,184,.18)', borderRadius: 8 }} />
                </S.Td>
              </S.Tr>
            ))
          ) : sorted.length > 0 ? (
            sorted.map((item, index) => (
              <SeparationListItem
                key={String(item.order_id)}
                item={item}
                statusPipeline={statusPipeline}
                stageByCode={stageByCode}
                recentActions={recentActions}
                labelLocked={labelLocked}
                updatingIds={updatingIds}
                onGenerateLabel={onGenerateLabel}
                onSetStatus={onSetStatus}
                onUpdateStatus={onUpdateStatus}
                index={index}
              />
            ))
          ) : (
            <S.Tr>
              <S.EmptyTableCell colSpan="7">Sem resultados</S.EmptyTableCell>
            </S.Tr>
          )}
        </tbody>
      </S.StyledTable>
    </S.ListContainer>
  );
}
