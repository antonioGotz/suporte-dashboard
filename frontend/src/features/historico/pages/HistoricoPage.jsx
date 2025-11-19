import React, { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import breakpoints from '../../../styles/breakpoints';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getHistorico, getHistoricoCounts } from '../services/historicoService';
import Pagination from '../../../components/Pagination';
import ListPageLayout from '../../../layouts/ListPageLayout';
import FilterButton, { FilterContainer } from '../../../components/FilterControls.jsx';
import { Table, Th, Td, Tr } from '../../../components/StandardTable.jsx';

// --- ESTILOS QUE SÃO ÚNICOS DESTA PÁGINA ---
const BaseBadge = styled.span`
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.7rem;
  color: #fff;
  text-transform: uppercase;
`;
const CreatedBadge = styled(BaseBadge)` background-color: #3182ce; `;
const ReactivatedBadge = styled(BaseBadge)` background-color: #38A169; `;
const SuspendedBadge = styled(BaseBadge)` background-color: #D69E2E; `;
const CanceledBadge = styled(BaseBadge)` background-color: #E53E3E; `;
const DefaultBadge = styled(BaseBadge)` background-color: #718096; `;
// --- Fim DOS ESTILOS ---

const HistoricoPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [counts, setCounts] = useState(null);
  const isMobile = useIsMobile(breakpoints.mobile || 768);

  const fetchHistorico = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getHistorico(currentPage, activeFilter);
      const _list = (response?.data?.data || []).filter(r => !String(r?.action || '').toLowerCase().startsWith('separation_status'));
      setLogs(_list);
      setPaginationInfo({ currentPage: response.data.current_page, totalPages: response.data.last_page });
    } catch (err) {
      setError('Não foi possível carregar o histórico.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeFilter]);

  useEffect(() => {
    getHistoricoCounts()
      .then(response => { setCounts(response.data); })
      .catch(err => console.error('Erro ao buscar contadores:', err));
  }, []);

  useEffect(() => { fetchHistorico(); }, [fetchHistorico]);

  const handlePageChange = (page) => { setCurrentPage(page); };
  const handleFilterClick = (filter) => { setActiveFilter(filter); setCurrentPage(1); };

  const renderActionBadge = (row) => {
    const code = (row.status_code || '').toLowerCase();
    const label = row.status_label || (row.action || '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    switch (code) {
      case 'created':      return <CreatedBadge>{label}</CreatedBadge>;
      case 'reactivated':  return <ReactivatedBadge>{label}</ReactivatedBadge>;
      case 'suspended':    return <SuspendedBadge>{label}</SuspendedBadge>;
      case 'canceled':     return <CanceledBadge>{label}</CanceledBadge>;
      default:             return <DefaultBadge>{label}</DefaultBadge>;
    }
  };

  const filterOrder = ['todos', 'criado', 'reativado', 'suspenso', 'cancelado', 'ajuste_estoque'];

  return (
    <ListPageLayout
      title="Histórico"
      description="Acompanhe ações administrativas."
      filters={
        <FilterContainer>
          {counts && filterOrder.map(filterKey => {
            const count = counts[filterKey] || 0;
            const label = filterKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (counts[filterKey] !== undefined) {
              return (
                <FilterButton
                  key={filterKey}
                  isActive={activeFilter === filterKey}
                  onClick={() => handleFilterClick(filterKey)}
                  count={count}
                >
                  {label}
                </FilterButton>
              );
            }
            return null;
          })}
        </FilterContainer>
      }
      pagination={ (paginationInfo && paginationInfo.totalPages > 1 && (
        <Pagination currentPage={paginationInfo.currentPage} totalPages={paginationInfo.totalPages} onPageChange={handlePageChange} />
      )) || null }
    >
      {loading ? <p style={{color:'#fff'}}>Carregando historico...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        isMobile ? (
          <CardsList>
            {logs.map((log, idx) => (
              <PedidoCard key={`hist-card-${log.id ?? idx}`} log={log} />
            ))}
          </CardsList>
        ) : (
          <Table>
          <thead>
            <Tr>
              <Th>Data</Th>
              <Th>Assinante Afetado</Th>
              <Th>Acao</Th>
              <Th>Motivo/Detalhe</Th>
              <Th>Realizado Por</Th>
            </Tr>
          </thead>
          <tbody>
            {(() => {
              const seen = new Set();
              return logs.filter(log => {
                if (!log.id || seen.has(log.id)) return false;
                seen.add(log.id);
                return true;
              }).map((log, idx) => (
                <Tr key={`hist-${log.id ?? idx}`}>
                  <Td>{new Date(log.created_at).toLocaleString('pt-BR')}</Td>
                  <Td>
                    {log.subscriber_id ? (
                      <Link to={`/assinantes/${log.subscriber_id}`} style={{ color: 'var(--color-text, #f8fafc)', fontWeight: 600, textDecoration: 'none' }} title={log.subscriber_name || 'Assinante'}>
                        {log.subscriber_name || 'Assinante'}
                      </Link>
                    ) : (
                      log.subscriber_name || 'N/A'
                    )}
                  </Td>
                  <Td>{renderActionBadge(log)}</Td>
                  <Td className="reason-cell">{log.reason || 'N/A'}</Td>
                  <Td>{log.admin_name || 'Sistema'}</Td>
                </Tr>
              ));
            })()}
          </tbody>
        </Table>
        )
      )}
    </ListPageLayout>
  );
};

// ================= Mobile components =================
const CardsList = styled.div`
  display:flex;
  flex-direction:column;
  gap:12px;
  padding:16px;
`;

const PedidoCard = ({ log }) => {
  const date = log.created_at ? new Date(log.created_at).toLocaleString('pt-BR') : '-';
  const status = (log.status_code || log.action || '').toLowerCase();
  const getBadge = () => {
    switch (status) {
      case 'pending':
      case 'created': return <StatusBadge style={{ background: '#F59E0B' }}>Pendente</StatusBadge>;
      case 'completed':
      case 'reactivated': return <StatusBadge style={{ background: '#10B981' }}>Concluído</StatusBadge>;
      case 'canceled': return <StatusBadge style={{ background: '#EF4444' }}>Cancelado</StatusBadge>;
      default: return <StatusBadge style={{ background: '#718096' }}>{(log.status_label || log.action || 'N/A')}</StatusBadge>;
    }
  };
  return (
    <PedidoCardWrapper>
      <CardHeader>
        <OrderNumber>#{log.id || '-'}</OrderNumber>
        <OrderDate>{date}</OrderDate>
      </CardHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <CardInfo>
            <InfoRow><small>Cliente</small><div>{log.subscriber_name || 'N/A'}</div></InfoRow>
            <InfoRow><small>Assinatura</small><div>{log.plan_name || log.subscription || '—'}</div></InfoRow>
            <InfoRow><small>Valor</small><div>{log.value || log.amount || '—'}</div></InfoRow>
          </CardInfo>
        </div>
        <div style={{ marginLeft: 12 }}>{getBadge()}</div>
      </div>
      {log.reason && <div style={{ marginTop: 12, color: '#94a3b8' }}>{log.reason}</div>}
    </PedidoCardWrapper>
  );
};

const PedidoCardWrapper = styled.div`
  border:1px solid rgba(255,255,255,0.04);
  border-radius:8px;
  padding:16px;
  background: #071124;
`;
const CardHeader = styled.div`
  display:flex; justify-content:space-between; margin-bottom:12px;
`;
const OrderNumber = styled.div`
  font-weight:700; font-size:16px; color:#e5e7eb;
`;
const OrderDate = styled.div`
  color:#94a3b8; font-size:13px;
`;
const StatusBadge = styled.div`
  color:#fff; padding:4px 12px; border-radius:12px; font-size:12px; font-weight:700;
`;
const CardInfo = styled.div`
  display:flex; flex-direction:column; gap:8px;
`;
const InfoRow = styled.div`
  small{ color:#94a3b8; font-size:12px; display:block; }
  div{ color:#e5e7eb; font-size:14px; font-weight:600; }
`;

export default HistoricoPage;
