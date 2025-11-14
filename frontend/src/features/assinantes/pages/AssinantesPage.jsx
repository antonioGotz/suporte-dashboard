import styled from 'styled-components';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useToast from '../../../hooks/useToast';
import assinantesService from '../services/assinantesService';
import productsService from '../../produtos/services/productsService';
import AddButton from '../components/AddButton';
import ActionsToolbar from '../components/ActionsToolbar';
import FilterBar from '../components/FilterBar';
import SearchBar from '../../../components/SearchBar';
import Loader from '../../../components/Loader';
import TableContainerLocal from '../components/TableContainerLocal';
import TableLocal from '../components/TableLocal';
import ThLocal from '../components/ThLocal';
import SortableHeader from '../components/SortableHeader';
import { FaPlus } from 'react-icons/fa';
import ActiveBadge from '../components/ActiveBadge';
import SuspendedBadge from '../components/SuspendedBadge';
import CanceledBadge from '../components/CanceledBadge';
import PendingBadge from '../components/PendingBadge';
import Pagination from '../../../components/Pagination';
import ConfirmationModalWithReason from '../../../components/ConfirmationModalWithReason';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Toast from '../../../components/Toast';
import ActionGroup from '../components/ActionGroup';
import { Link, useNavigate } from 'react-router-dom';
import TdLocal from '../components/TdLocal';
import { ActionButtons } from '../../../components/shared/ActionButtons';
import { updateDemoSubscriberStatusByEmail, mergeDemoSubscriberMetadata } from '../../../demo/demoSubscribersStore.js';

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const Subtitle = styled.p`
  color: var(--muted);
  margin: 4px 0 0;
`;

const HeaderActions = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;

  /* Igualar larguras em desktop */
  > div, > button {
    width: 220px;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    > div, > button { width: 100%; }
  }
`;

// Linha após const TdLocal = styled.td`...`
const TrLocal = styled.tr`
  transition: background 0.18s ease;

  &:nth-child(even) td {
    background-color: rgba(148, 163, 184, 0.03);
  }

  @media (hover: hover) {
    &:hover td {
      background-color: rgba(56, 178, 172, 0.1);
      border-color: rgba(56, 178, 172, 0.28);
    }
  }
`;


function AssinantesPage() {
  const navigate = useNavigate();

  // States principais
  const [assinantes, setAssinantes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  // Debounce para evitar estouro de requisições em digitação
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  // Para exclusão de solicitações
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  // Loading por linha/ação
  const [rowLoading, setRowLoading] = useState({});

  // Toast
  const { showToast, toast, exit: toastExit } = useToast();

  const resolveEmail = useCallback((record) => {
    if (!record) return '';
    const possibilities = [
      record.user_email,
      record.email,
      record.customer_email,
      record.billing_email,
      record.login,
    ];
    const found = possibilities.find((value) => typeof value === 'string' && value.trim().length > 0);
    return found ? found.trim() : '';
  }, []);

  const syncDemoStatus = useCallback((assinanteOrEmail, nextStatus, description) => {
    if (!nextStatus) return;
    const email = typeof assinanteOrEmail === 'string' ? assinanteOrEmail : resolveEmail(assinanteOrEmail);
    if (!email) return;
    try {
      const updatedRecord = updateDemoSubscriberStatusByEmail(email, nextStatus, { description });
      if (updatedRecord && typeof assinanteOrEmail === 'object' && assinanteOrEmail) {
        const meta = {};
        if (assinanteOrEmail.user_id) meta.backendUserId = String(assinanteOrEmail.user_id);
        if (assinanteOrEmail.order_id) meta.backendOrderId = String(assinanteOrEmail.order_id);
        if (assinanteOrEmail.id) meta.backendLegacyId = String(assinanteOrEmail.id);
        if (Object.keys(meta).length > 0) {
          mergeDemoSubscriberMetadata(updatedRecord.id, meta);
        }
      }
    } catch (err) {
      console.warn('[AssinantesPage] Falha ao sincronizar status demo', err);
    }
  }, [resolveEmail]);

  // Aplica debounce ao termo de busca
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(searchTerm), 450);
    return () => clearTimeout(h);
  }, [searchTerm]);

  // Filtro no cliente (fallback se o backend não aplicar)
  const filteredAssinantes = useMemo(() => {
    const list = Array.isArray(assinantes) ? assinantes : [];
    const normStatus = (a) => String(a?.status_code || a?.status || '').toLowerCase();
    const gwStatus = (a) => String(a?.gateway_status || '').toLowerCase();
    const isPending = (a) => normStatus(a) === 'pending' || (!normStatus(a) && gwStatus(a) === 'pendente');
    const isActive = (a) => normStatus(a) === 'active';
    const isSuspended = (a) => normStatus(a) === 'suspended';
    const isCanceled = (a) => normStatus(a) === 'canceled';

    switch (activeFilter) {
      case 'solicitacoes':
        return list.filter(isPending);
      case 'aprovados':
        return list.filter(isActive);
      case 'suspensos':
        return list.filter(isSuspended);
      case 'cancelados':
        return list.filter(isCanceled);
      case 'todos':
      default:
        return list;
    }
  }, [assinantes, activeFilter]);

  // Contadores globais dos filtros (agora integrados ao backend)
  const [filterCounts, setFilterCounts] = useState({
    todos: 0,
    aprovados: 0,
    suspensos: 0,
    cancelados: 0,
    solicitacoes: 0,
  });

  // Função para buscar contadores globais do backend
  const fetchFilterCounts = async () => {
    try {
      const res = await assinantesService.getCounts();
      // O backend retorna: { todos, aprovados, suspensos, cancelados, pendentes }
      if (res) {
        setFilterCounts({
          todos: res.todos ?? 0,
          aprovados: res.aprovados ?? 0,
          suspensos: res.suspensos ?? 0,
          cancelados: res.cancelados ?? 0,
          solicitacoes: res.pendentes ?? 0, // compatível com backend
        });
      }
    } catch (e) {
      // Em caso de erro, mantém os valores anteriores
    }
  };

  useEffect(() => {
    fetchFilterCounts();
  }, []);

  // Ordenação: sempre mostrar primeiro quem teve a última ação mais recente
  const sortedAssinantes = useMemo(() => {
    const toTs = (v) => {
      if (!v) return 0;
      const t = Date.parse(v);
      return Number.isFinite(t) ? t : 0;
    };
    const list = Array.isArray(filteredAssinantes) ? [...filteredAssinantes] : [];
    return list.sort((a, b) => {
      const ta = toTs(a.last_action_at) || toTs(a.subscription_date) || toTs(a.updated_at) || 0;
      const tb = toTs(b.last_action_at) || toTs(b.subscription_date) || toTs(b.updated_at) || 0;
      return tb - ta; // desc
    });
  }, [filteredAssinantes]);

  // Buscar assinantes
  const fetchAssinantes = async (page = null) => {
    setLoading(true);
    setError(null);
    try {
      // Sempre usa o valor mais recente do state se page não for passado
      const pageToUse = page !== null ? page : currentPage;
      const params = { page: pageToUse };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (activeFilter === 'solicitacoes') {
        params.only_pending = true;
      } else if (activeFilter && activeFilter !== 'todos') {
        params.status = activeFilter;
      } else if (!debouncedSearch) {
        params.status = 'todos';
        // Dedup mais robusto: usa email quando houver, senão id do usuário
        params.unique_by = 'identity';
      }
      const response = await assinantesService.getAll(params);
      const payload = response?.data;
      // Log para debug: veja o que o backend está retornando
      console.log('[DEBUG assinantes] payload recebido da API:', payload);
      const list = Array.isArray(payload)
        ? payload
        : (Array.isArray(payload?.data) ? payload.data : (payload?.results || []));
      setAssinantes(list);
      const mapStatus = (value) => {
        const norm = String(value || '').trim().toLowerCase();
        if (!norm) return null;
        if (['canceled', 'cancelled', 'cancelado', 'cancelada'].includes(norm)) return 'cancelled';
        if (['pending', 'pendente'].includes(norm)) return 'pending';
        if (['active', 'ativo', 'aprovado', 'aprovada'].includes(norm)) return 'active';
        if (['suspended', 'suspenso', 'suspensa'].includes(norm)) return 'suspended';
        return null;
      };
      if (Array.isArray(list) && list.length > 0) {
        list.forEach((item) => {
          const status = mapStatus(item?.status_code || item?.status);
          if (status) {
            syncDemoStatus(item, status, `Sincronizado com painel principal (${status}).`);
          }
        });
      }
      const pagination = payload?.pagination || (
        (typeof payload?.last_page !== 'undefined' || typeof payload?.total_pages !== 'undefined')
          ? {
            currentPage: payload?.current_page ?? payload?.page ?? pageToUse,
            totalPages: payload?.last_page ?? payload?.total_pages ?? 1,
          }
          : null
      );
      setPaginationInfo(pagination);
    } catch (e) {
      setError('Erro ao buscar assinantes.');
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar assinantes ao carregar ou mudar filtros
  useEffect(() => {
    fetchAssinantes(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeFilter, debouncedSearch]);

  // Função de busca
  const handleSearch = () => {
    // Apenas reposiciona a página; o efeito com debouncedSearch dispara a busca
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const renderStatusBadge = (code, fallbackLabel) => {
    const label = (fallbackLabel || '').toUpperCase();
    switch (code) {
      case 'active':
        return <ActiveBadge>{label || 'ATIVO'}</ActiveBadge>;
      case 'suspended':
        return <SuspendedBadge>{label || 'SUSPENSO'}</SuspendedBadge>;
      case 'canceled':
        return <CanceledBadge>{label || 'CANCELADO'}</CanceledBadge>;
      case 'pending':
      default:
        return <PendingBadge>{label || 'PENDENTE'}</PendingBadge>;
    }
  };
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };
  const handleKeyDown = (event) => { if (event.key === 'Enter') { event.preventDefault(); handleSearch(); } };

  // ATENÇÃO: Se o updateStatus precisar do ID do USUÁRIO e não do ORDER, ajuste aqui.
  const handleStatusChange = (orderId, newStatus, modalDetails) => {
    const action = (reason = '') => {
      const mapStatusToKey = (status) => {
        const s = String(status || '').toLowerCase();
        if (s === 'suspenso') return 'suspend';
        if (s === 'cancelado') return 'cancel';
        if (s === 'reativado' || s === 'ativo') return 'reactivate';
        return 'action';
      };
      const lk = mapStatusToKey(newStatus);
      setRowLoading(prev => ({
        ...prev,
        [orderId]: { ...(prev[orderId] || {}), [lk]: true }
      }));
      assinantesService.updateStatusAssinatura(orderId, newStatus, reason)
        .then(() => {
          // Buscar o assinante pelo orderId para exibir nome/id
          const assinante = assinantes.find(a => a.order_id === orderId || a.id === orderId || a.user_id === orderId);
          const nome = assinante?.user_name || 'Assinante';
          const id = assinante?.user_id || assinante?.id || orderId;
          let msg = '';
          if (newStatus === 'suspenso') {
            msg = `Assinante ${nome} (ID: ${id}) foi suspenso.`;
          } else if (newStatus === 'cancelado') {
            msg = `Assinante ${nome} (ID: ${id}) foi cancelado.`;
          } else if (newStatus === 'reativado') {
            msg = `Assinante ${nome} (ID: ${id}) foi reativado.`;
          } else {
            msg = `Status atualizado para ${newStatus} para ${nome} (ID: ${id}).`;
          }
          setAssinantes(prev => {
            if (!Array.isArray(prev)) return prev;
            const normalize = (a) => String(a?.status_code || a?.status || '').toLowerCase();
            const updated = prev.map(a => {
              if (a.order_id !== orderId && a.id !== orderId && a.user_id !== orderId) return a;
              if (newStatus === 'reativado') {
                return { ...a, status: 'active', status_code: 'active', last_action: 'reativado', last_action_at: new Date().toISOString() };
              }
              if (newStatus === 'suspenso') {
                return { ...a, status: 'suspended', status_code: 'suspended', last_action: 'suspenso', last_action_at: new Date().toISOString() };
              }
              if (newStatus === 'cancelado') {
                return { ...a, status: 'canceled', status_code: 'canceled', last_action: 'cancelado', last_action_at: new Date().toISOString() };
              }
              return a;
            });
            const belongs = (a) => {
              const code = normalize(a);
              if (activeFilter === 'aprovados') return code === 'active';
              if (activeFilter === 'suspensos') return code === 'suspended';
              if (activeFilter === 'cancelados') return code === 'canceled';
              if (activeFilter === 'solicitacoes') return code === 'pending';
              return true;
            };
            return updated.filter(belongs);
          });
          showToast('success', msg, { duration: 7000 });
          if (assinante) {
            const transitionMap = {
              suspenso: { status: 'suspended', description: 'Suspenso pelo painel principal.' },
              cancelado: { status: 'cancelled', description: 'Cancelado pelo painel principal.' },
              reativado: { status: 'active', description: 'Reativado pelo painel principal.' },
              ativo: { status: 'active', description: 'Aprovado pelo painel principal.' },
            };
            const info = transitionMap[newStatus];
            if (info) {
              syncDemoStatus(assinante, info.status, info.description);
            }
          }
          fetchAssinantes();
          fetchFilterCounts(); // Atualiza os contadores após ação
        })
        .catch(() => showToast('error', 'Erro ao atualizar status.', { duration: 7000 }))
        .finally(() => {
          setRowLoading(prev => ({
            ...prev,
            [orderId]: { ...(prev[orderId] || {}), [lk]: false }
          }));
          setActionToConfirm(null);
          setIsConfirmModalOpen(false);
        });
    };
    if (modalDetails) {
      setActionToConfirm({ action, ...modalDetails });
      setIsConfirmModalOpen(true);
    } else {
      action();
    }
  };

  // Cria uma assinatura para um usuário pendente
  // Recebe explicitamente o productId para evitar ReferenceError
  const handleCreateOrder = async (userId, productId) => {
    try {
      if (!userId) {
        showToast('error', 'Usuário da solicitação não encontrado.');
        return;
      }
      // Buscar assinante na lista atual
      const assinante = assinantes.find(a => (a.user_id ?? a.id) === userId);
      const amount = assinante?.amount || 0;
      const key = `req_${userId}`;
      setRowLoading(prev => ({ ...prev, [key]: { ...(prev[key] || {}), approve: true } }));
      const suggestedOrderId = assinante?.suggested_order_id;
      await assinantesService.createOrderForUser(userId, productId, amount, suggestedOrderId);
      if (activeFilter === 'solicitacoes') {
        setAssinantes(prev => (Array.isArray(prev) ? prev.filter(a => (a.user_id ?? a.id) !== userId) : prev));
      }
      await fetchAssinantes();
      await fetchFilterCounts(); // Atualiza os contadores após criar assinatura
      showToast('success', 'Assinatura criada com sucesso.', { duration: 7000 });
      if (assinante) {
        syncDemoStatus(assinante, 'active', 'Assinatura criada pelo painel principal.');
      }
    } catch (e) {
      console.error(e);
      const message = e?.response?.data?.message || 'Falha ao criar assinatura.';
      showToast('error', message, { duration: 7000 });
    } finally {
      const key = `req_${userId}`;
      setRowLoading(prev => ({ ...prev, [key]: { ...(prev[key] || {}), approve: false } }));
    }
  };

  // removidos helpers legados de status (agora padronizados via status_code/status_label)

  const formatSubscriptionDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Garante que a data é válida antes de formatar
    return isNaN(date.getTime()) ? 'Data Inválida' : date.toLocaleDateString('pt-BR');
  };

  // Função para deletar solicitação (usuário pendente)
  const handleDeleteSolicitacao = async () => {
    if (!userToDelete) return;
    try {
      const removed = Array.isArray(assinantes)
        ? assinantes.find(a => (a.user_id ?? a.id) === userToDelete)
        : null;
      const key = `req_${userToDelete}`;
      setRowLoading(prev => ({ ...prev, [key]: { ...(prev[key] || {}), delete: true } }));
      await assinantesService.deleteAssinante(userToDelete);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchAssinantes();
      fetchFilterCounts();
      showToast('success', 'Solicitação excluída com sucesso.', { duration: 7000 });
      if (removed) {
        syncDemoStatus(removed, 'cancelled', 'Solicitação excluída no painel principal.');
      }
    } catch (e) {
      showToast('error', 'Erro ao excluir solicitação.', { duration: 7000 });
    } finally {
      const key = `req_${userToDelete}`;
      setRowLoading(prev => ({ ...prev, [key]: { ...(prev[key] || {}), delete: false } }));
    }
  };

  return (
    <>
      <HeaderRow>
        <div>
          <h1>Gerenciamento de Assinantes</h1>
          <Subtitle>Pesquise, filtre e gerencie seus assinantes.</Subtitle>
        </div>
        <HeaderActions>
          <SearchBar
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <AddButton to="/assinantes/novo"><FaPlus /> Adicionar Assinante</AddButton>
        </HeaderActions>
      </HeaderRow>
      <ActionsToolbar>
        <FilterBar
          filters={[
            { key: 'todos', label: 'Todos' },
            { key: 'aprovados', label: 'Aprovados (30d)' },
            { key: 'suspensos', label: 'Suspensos' },
            { key: 'cancelados', label: 'Cancelados' },
            { key: 'solicitacoes', label: 'Solicitações (sem assinatura)' },
          ]}
          counts={filterCounts}
          activeFilter={activeFilter}
          onFilterClick={handleFilterClick}
        />
      </ActionsToolbar>

      {loading ? <Loader /> : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <TableContainerLocal>
          <TableLocal>
            {activeFilter === 'solicitacoes' ? (
              <>
                <thead>
                  <TrLocal>
                    <ThLocal className="assinante">Assinante</ThLocal>
                    <ThLocal className="data">Data da Solicitação</ThLocal>
                    <ThLocal className="acoes">Ações</ThLocal>
                  </TrLocal>
                </thead>
                <tbody>
                  {sortedAssinantes.length > 0 ? (
                    sortedAssinantes.map((assinante) => {
                      const code = (assinante.status_code || '').toLowerCase();
                      const gw = (assinante.gateway_status || '').toLowerCase();
                      const isPending = code === 'pending' || (!code && gw === 'pendente');
                      // Chave única: user_id (preferencial), senão id, senão order_id
                      const rowKey = `pend_${assinante.user_id ?? assinante.id ?? assinante.order_id ?? Math.random()}`;
                      const reqKey = `req_${assinante.user_id ?? assinante.id}`;
                      let showApprove = true, showDelete = true;
                      return (
                        <TrLocal key={rowKey}>
                          <TdLocal className="assinante">
                            <Link
                              to={`/assinantes/${assinante.order_id ?? assinante.user_id ?? assinante.id}`}
                              style={{
                                color: 'var(--color-text, #f8fafc)',
                                fontWeight: 600,
                                textDecoration: 'none'
                              }}
                            >
                              <span title={assinante.user_name || '—'}>
                                {(() => {
                                  const nome = (assinante.user_name || '—').split(' ').slice(0, 2).join(' ');
                                  return nome.length > 22 ? nome.slice(0, 22) + '…' : nome;
                                })()}
                              </span>
                            </Link>
                            {assinante.user_email && (
                              <>
                                <br />
                                <small style={{ color: 'var(--muted)' }}>{assinante.user_email}</small>
                              </>
                            )}
                          </TdLocal>
                          <TdLocal className="data">{assinante.subscription_date ? formatSubscriptionDate(assinante.subscription_date) : '-'}</TdLocal>
                          <TdLocal className="acoes">
                            <ActionGroup>
                              <ActionButtons
                                onView={() => navigate(`/assinantes/${assinante.order_id ?? assinante.user_id ?? assinante.id}`)}
                                onCancel={() => { setUserToDelete(assinante.user_id ?? assinante.id); setIsDeleteModalOpen(true); }}
                                onReactivate={() => handleCreateOrder(assinante.user_id ?? assinante.id, assinante.products_id)}
                                labels={{ view: 'Ver Detalhes', cancel: 'Excluir de vez', reactivate: 'Criar Assinatura' }}
                                ariaContext={assinante.user_name}
                                size="xs"
                                pill
                                tone="soft"
                                loading={{
                                  cancel: !!rowLoading[reqKey]?.delete,
                                  reactivate: !!rowLoading[reqKey]?.approve,
                                }}
                              />
                            </ActionGroup>
                          </TdLocal>
                        </TrLocal>
                      );
                    })
                  ) : (
                    <TrLocal><TdLocal colSpan="3" style={{ textAlign: 'center' }}>Nenhum resultado encontrado.</TdLocal></TrLocal>
                  )}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                      <TrLocal>
                        <ThLocal className="assinante">Assinante</ThLocal>
                        <ThLocal className="plano">Plano</ThLocal>
                        <ThLocal className="data">Data da Assinatura</ThLocal>
                        <ThLocal>Status</ThLocal>
                        <ThLocal className="acoes">Ações</ThLocal>
                      </TrLocal>
                    </thead>
                    <tbody>
                      {sortedAssinantes.length > 0 ? (
                        sortedAssinantes.map((assinante, idx) => {
                          const code = (assinante.status_code || '').toLowerCase();
                          const gw = (assinante.gateway_status || '').toLowerCase();
                          const isActive = code === 'active';
                          const isSuspended = code === 'suspended';
                          const isCanceled = code === 'canceled';
                          const isPending = code === 'pending' || (!code && gw === 'pendente');
                          // Chave única: order_id (preferencial), senão user_id, senão id, e índice para garantir unicidade
                          const rowKey = `assin_${assinante.order_id ?? assinante.user_id ?? assinante.id ?? Math.random()}_${idx}`;
                          let showSuspend = false, showReactivate = false, showCancel = false, showApprove = false, showDelete = false;
                          if (activeFilter === 'suspensos') {
                            showReactivate = true;
                            showCancel = true;
                            showDelete = true;
                          } else if (activeFilter === 'cancelados') {
                            showReactivate = true;
                          } else if (activeFilter === 'aprovados') {
                            showSuspend = isActive;
                            showCancel = isActive;
                          } else {
                            showApprove = isPending;
                            showSuspend = isActive;
                            showReactivate = isSuspended || isCanceled;
                            showCancel = !isCanceled;
                          }
                          return (
                            <TrLocal key={rowKey}>
                              <TdLocal className="assinante">
                                <Link
                                  to={`/assinantes/${assinante.order_id ?? assinante.user_id ?? assinante.id}`}
                                  style={{
                                    color: 'var(--color-text, #f8fafc)',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                  }}
                                >
                                  <span title={assinante.user_name || '—'}>
                                    {(() => {
                                      const nome = (assinante.user_name || '—').split(' ').slice(0, 2).join(' ');
                                      return nome.length > 22 ? nome.slice(0, 22) + '…' : nome;
                                    })()}
                                  </span>
                                </Link>
                                {assinante.user_email && (
                                  <>
                                    <br />
                                    <small style={{ color: 'var(--muted)' }}>{assinante.user_email}</small>
                                  </>
                                )}
                              </TdLocal>
                              <TdLocal>{assinante.plan_name || ''}</TdLocal>
                              <TdLocal className="data">{assinante.subscription_date ? formatSubscriptionDate(assinante.subscription_date) : 'N/A'}</TdLocal>
                              <TdLocal>{renderStatusBadge(code, assinante.status_label)}</TdLocal>
                              <TdLocal className="acoes">
                                <ActionGroup>
                                  <ActionButtons
                                    onView={() => navigate(`/assinantes/${assinante.order_id ?? assinante.user_id ?? assinante.id}`)}
                                    onSuspend={showSuspend ? () => handleStatusChange(assinante.order_id, 'suspenso', {
                                      title: 'Suspender Assinatura',
                                      message: `Tem certeza que deseja suspender a assinatura de ${assinante.user_name}?`,
                                      confirmButtonText: 'Sim, Suspender',
                                      // Motivos específicos para Suspensão
                                      reasons: [
                                        { value: 'pagamento_atrasado', label: 'Pagamento em atraso' },
                                        { value: 'pedido_do_cliente', label: 'Pedido do cliente' },
                                        { value: 'analise_de_fraude', label: 'Análise de fraude' },
                                        { value: 'uso_indevido', label: 'Uso indevido' },
                                        { value: 'ajuste_administrativo', label: 'Ajuste administrativo' },
                                        { value: 'outros', label: 'Outros' },
                                      ],
                                      requireOtherText: true,
                                    }) : undefined}
                                    onCancel={showCancel ? () => handleStatusChange(assinante.order_id, 'cancelado', {
                                      title: 'Cancelar Assinatura',
                                      message: `Tem certeza que deseja CANCELAR a assinatura de ${assinante.user_name}?`,
                                      confirmButtonText: 'Sim, Cancelar',
                                      // Motivos específicos para Cancelamento
                                      reasons: [
                                        { value: 'pedido_do_cliente_encerramento', label: 'Pedido do cliente (encerramento)' },
                                        { value: 'inadimplencia', label: 'Inadimplência' },
                                        { value: 'chargeback_ou_recusa', label: 'Chargeback/Recusa persistente' },
                                        { value: 'violacao_termos', label: 'Violação de termos' },
                                        { value: 'troca_de_plano_provedor', label: 'Troca de plano/provedor' },
                                        { value: 'outros', label: 'Outros' },
                                      ],
                                      requireOtherText: true,
                                    }) : undefined}
                                    onReactivate={(showReactivate || showApprove) ? () => (showApprove
                                      ? handleStatusChange(assinante.order_id, 'ativo')
                                      : handleStatusChange(assinante.order_id, 'reativado', {
                                        title: 'Reativar Assinatura',
                                        message: `Tem certeza que deseja reativar a assinatura de ${assinante.user_name}?`,
                                        confirmButtonText: 'Sim, Reativar',
                                        // Motivos específicos para Reativação (mais condizentes com a ação)
                                        reasons: [
                                          { value: 'regularizacao_pagamento', label: 'Regularização de pagamento' },
                                          { value: 'solicitacao_cliente', label: 'Solicitação do cliente' },
                                          { value: 'erro_operacional_corrigido', label: 'Erro operacional corrigido' },
                                          { value: 'migracao_concluida', label: 'Migração concluída' },
                                          { value: 'outros', label: 'Outros' },
                                        ],
                                        requireOtherText: true,
                                      })
                                    ) : undefined}
                                    labels={{
                                      view: 'Ver Detalhes',
                                      suspend: 'Suspender',
                                      cancel: 'Cancelar',
                                      reactivate: showApprove ? 'Aprovar' : 'Reativar',
                                    }}
                                    loading={rowLoading[assinante.order_id] || {}}
                                    ariaContext={assinante.user_name}
                                    size="xs"
                                    pill
                                    tone="soft"
                                    tones={{ cancel: 'solid', view: 'soft', suspend: 'soft', reactivate: 'soft' }}
                                  />
                                </ActionGroup>
                              </TdLocal>
                            </TrLocal>
                          );
                        })
                      ) : (
                        <TrLocal><TdLocal colSpan="5" style={{ textAlign: 'center' }}>Nenhum resultado encontrado.</TdLocal></TrLocal>
                      )}
                    </tbody>
              </>
            )}
          </TableLocal>
          {paginationInfo && paginationInfo.totalPages > 1 && (
            <Pagination currentPage={paginationInfo.currentPage} totalPages={paginationInfo.totalPages} onPageChange={handlePageChange} />
          )}
        </TableContainerLocal>
      )}
      <ConfirmationModalWithReason
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={(reason) => { if (actionToConfirm?.action) { actionToConfirm.action(reason); } }}
        reasons={[
          { value: 'pagamento_atrasado', label: 'Pagamento atrasado' },
          { value: 'pedido_do_cliente', label: 'Pedido do cliente' },
          { value: 'problema_no_cartao', label: 'Problema no cartão' },
          { value: 'ajuste_administrativo', label: 'Ajuste administrativo' },
          { value: 'uso_irregular', label: 'Uso irregular' },
          { value: 'outros', label: 'Outros' },
        ]}
        {...actionToConfirm}
        tones={{ cancel: 'solid', view: 'soft', reactivate: 'soft' }}
      />
      {/* Modal de confirmação para exclusão de solicitação */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSolicitacao}
        title="Excluir solicitação"
        message="Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita."
      />
      {toast && <Toast message={toast.message} type={toast.type} exit={toastExit} />}
    </>
  );
}

export default AssinantesPage;
