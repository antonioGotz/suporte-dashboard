import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Toast from '../../../components/Toast.jsx';
import { FaSort, FaSortUp, FaSortDown, FaFilter, FaCaretDown } from 'react-icons/fa';
import styled from "styled-components";
import { getSeparationList, updateSeparationStatus, generateShippingLabel } from "../../../services/separacaoService";
import ListPageLayout from "../../../layouts/ListPageLayout.jsx";
import { TableContainer, Table, Th, Td, Tr } from "../../../components/StandardTable.jsx";
import Pagination from "../../../components/Pagination.jsx";
// Removido useToast
import FiltersBar from "../../../components/filters/FiltersBar";
import SearchBar from "../../../components/SearchBar.jsx";
import KanbanColumn from "../../../components/kanban/KanbanColumn";
import AnimatedEntrance from "../../../components/AnimatedEntrance/AnimatedEntrance";
import SeparationList from "../views/list/SeparationList.jsx";
import TimelineViewSC from "../views/timeline/TimelineViewSC.jsx";
import { Link } from "react-router-dom";
import PrimaryActionButton from "../../../components/buttons/PrimaryActionButton.jsx";

// >>> pipeline compartilhado
import { STATUS_PIPELINE, stageByCode } from "../../../domain/statusPipeline";
import { classifySLA } from '../views/separation.utils';

const KanbanWrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 1.5rem;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  min-width: 0;
`;

const SubscriberName = styled(Link)`
  display: block;
  font-weight: 700;
  color: var(--color-text, #f8fafc);
  text-decoration: none;
  margin-bottom: 2px;
  &:hover { text-decoration: underline; color: var(--color-primary, #9dd9d2); }
`;
const SubscriberEmail = styled.div`font-size: 0.85rem; color: var(--color-muted, #94a3b8);`;
const BabyName = styled(Link)`
  display: block;
  font-size: 0.85rem;
  color: var(--color-muted, #94a3b8);
  text-decoration: none;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover { text-decoration: underline; color: var(--color-primary, #9dd9d2); }
`;
const ProductName = styled.div`
  font-weight: 600;
  color: var(--color-text, #e5e7eb);
  max-width: 36ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const ProductMeta = styled.div`
  font-size: 0.85rem;
  color: var(--color-muted, #94a3b8);
  max-width: 40ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const EmptyTableCell = styled(Td)`text-align: center; color: var(--color-muted, #94a3b8);`;
const ErrorMessage = styled.p`color: var(--color-danger, #ef4444); font-weight: 600;`;
const SmallMuted = styled.span`font-size: 0.8rem; color: var(--color-muted, #94a3b8);`;
const ActionsCell = styled(Td)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border, rgba(148,163,184,.14));
`;
const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(148,163,184,.3);
  background: #1f2937;
  color: var(--color-text, #e5e7eb);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: .02em;
  cursor: pointer;
  transition: all .15s ease;
  &:hover { background: #243042; border-color: rgba(148,163,184,.45); }
`;
const MenuList = styled.ul`
  position: absolute;
  top: 42px;
  right: 0;
  z-index: 20;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #0b1220;
  border: 1px solid rgba(148,163,184,.25);
  border-radius: 12px;
  min-width: 220px;
  max-height: 260px;
  overflow: auto;
  box-shadow: 0 12px 28px rgba(0,0,0,.35);
`;
const MenuItem = styled.li`
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text, #e5e7eb);
  &:hover { background: rgba(148,163,184,.12); }
`;

// Colunas alinhadas
const ThPedido = styled(Th)`
  width: 120px;
  text-align: center;
`;
const ThAcao = styled(Th)`
  width: 160px;
  text-align: center;
`;
const TdCenter = styled(Td)`
  text-align: center;
`;

// Mover styled-components usados na busca para o topo (fora do render)
const SearchRow = styled.div`
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 8px;
`;
const Input = styled.input`
  height: 32px; background: #0f172a; color: #e5e7eb; border: 1px solid rgba(148,163,184,.28); border-radius: 8px; padding: 0 10px;
`;
const Select = styled.select`
  height: 32px; background: #0f172a; color: #e5e7eb; border: 1px solid rgba(148,163,184,.28); border-radius: 8px; padding: 0 10px;
`;
const SmallBtn = styled.button`
  height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid rgba(148,163,184,.28); background: #1f2937; color: #e5e7eb; font-weight: 700; font-size: .8rem;
`;

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 0;
  color: var(--color-text, #e5e7eb);
  font-weight: 700;
  cursor: pointer;
  padding: 4px 6px;
  &:hover { color: var(--color-primary, #9dd9d2); }
`;

// HeaderIcon removed from page - moved into SeparationList

const PLAN_MAP = { petit: "evolua-petit", bebe: "evolua-bebe" };

const SeparacaoPage = () => {
  const [list, setList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("kanban");
  const [planFilter, setPlanFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("proximos-15-dias");
  const [recentActions, setRecentActions] = useState(false);
  const [updatingIds, setUpdatingIds] = useState({});
  const [toast, setToast] = useState(null);
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const fetchController = useRef(null);
  const [searchDisabledUntil, setSearchDisabledUntil] = useState(null);

  // Opções do filtro de status (inclui "Mostrar Todos") vindas do domínio
  const statusOptionsMemo = useMemo(() => {
    const opts = [
      { label: 'Mostrar Todos', value: 'all' },
      ...STATUS_PIPELINE
        .filter((s) => !("isFallback" in s))
        .map((s) => ({ label: s.statusLabel, value: s.statusCode }))
    ];
    return opts;
  }, []);

  // Ao alterar o filtro de status, reseta para a primeira página
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const fetchList = useCallback(
    async (page, date, plan, { showLoading = true, q: explicitQ } = {}) => {
      if (showLoading) {
        setLoading(true);
      }
      setError("");
      try {
        // cancel previous request if exists
        try { if (fetchController.current) fetchController.current.abort(); } catch (e) { }
        fetchController.current = new AbortController();
        // Monta objeto de busca com base no tipo selecionado
        // Permite passar um `q` explícito na chamada (ex.: fetchList(..., { q: '248' }))
        // caso contrário usa o `searchValue` do state.
        let searchParams = { recentActions };
        const rawQ = (typeof explicitQ !== 'undefined' && explicitQ !== null) ? explicitQ : searchValue;
        const finalQ = typeof rawQ === 'string' ? rawQ.trim() : rawQ;
        if (finalQ) {
          searchParams.q = finalQ; // Busca unificada (nome, pedido, produto)
        }
        const hasActiveSearch = Boolean(searchParams.q && String(searchParams.q).trim().length > 0);
        const effectiveDateFilter = hasActiveSearch ? 'todos' : date;
        const effectivePlanFilter = hasActiveSearch ? 'todos' : plan;
        // debug temporário: registrar params de busca
        // eslint-disable-next-line no-console
        console.debug('[SeparacaoPage] fetchList params', { page, date: effectiveDateFilter, plan: effectivePlanFilter, searchParams });
        // Pass statusFilter (if provided) so backend can filter by status_code
        const params = {
          ...searchParams,
          statusCode: statusFilter,
          signal: fetchController.current.signal,
          planOverride: effectivePlanFilter,
          dateOverride: effectiveDateFilter,
        };
        const response = await getSeparationList(page, effectiveDateFilter, effectivePlanFilter, params);
        const payload = response?.data;
        const items = Array.isArray(payload)
          ? payload
          : (Array.isArray(payload?.data)
            ? payload.data
            : (Array.isArray(payload?.results)
              ? payload.results
              : (Array.isArray(payload?.items) ? payload.items : [])));
        try {
          // debug: log ids e tamanho retornado para investigar diferenças entre Kanban e Lista
          // eslint-disable-next-line no-console
          console.debug('[SeparacaoPage] fetchList returned', Array.isArray(items) ? items.length : 0, 'items; sample ids:', Array.isArray(items) ? items.slice(0, 10).map(i => i.order_id) : []);
        } catch (e) { }
        setList(items);
        // Sincroniza o lock do botão com a flag persistida do backend.
        setLabelLocked((prev) => {
          const next = { ...prev };
          items.forEach((it) => {
            const id = it.order_id;
            if (!id) return;
            if (it.label_generated) {
              next[id] = true;
            } else {
              // Se resetou (voltou ao início), libera o botão
              if (next[id]) delete next[id];
            }
          });
          return next;
        });
        const meta = response.data?.meta;
        setPaginationInfo(meta ? {
          currentPage: meta.current_page,
          totalPages: meta.last_page,
        } : null);
        setUpdatingIds({});
      } catch (err) {
        // handle AbortError quietly
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          // request canceled - do not set a global error
          // eslint-disable-next-line no-console
          console.debug('[SeparacaoPage] fetchList aborted');
          return;
        }
        console.error('fetchList failed', err?.response?.status, err?.response?.data || err?.message);
        if (err?.response?.status === 429) {
          // try to read Retry-After header (seconds) and disable search until then
          const retryAfter = err?.response?.headers?.['retry-after'];
          let waitMs = 0;
          if (retryAfter) {
            const seconds = Number(retryAfter);
            if (!Number.isNaN(seconds)) waitMs = seconds * 1000;
            else {
              const dateVal = Date.parse(retryAfter);
              if (!Number.isNaN(dateVal)) waitMs = Math.max(0, dateVal - Date.now());
            }
          }
          if (waitMs > 0) {
            const until = new Date(Date.now() + waitMs).toISOString();
            setSearchDisabledUntil(until);
            setToast({ type: 'error', message: `Muitas requisições. Aguarde ${Math.ceil(waitMs / 1000)}s.` });
            setError('Muitas requisições. Aguarde e tente novamente.');
          } else {
            setError('Muitas requisições. Aguarde um momento e tente novamente.');
          }
        } else {
          setError("Não foi possível carregar a lista de separação.");
        }
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [recentActions, searchValue, statusFilter]
  );

  // Sincroniza viewMode/plan/date/recentes com URL na carga inicial
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const vm = params.get('view');
      if (vm === 'kanban' || vm === 'list' || vm === 'timeline') {
        setViewMode(vm);
      }
      const plan = params.get('plan');
      if (plan && (plan === PLAN_MAP.petit || plan === PLAN_MAP.bebe || plan === 'todos')) {
        setPlanFilter(plan);
      }
      const date = params.get('date');
      if (date) setDateFilter(date);
      const ra = params.get('recent') === '1';
      setRecentActions(ra);
      const q = params.get('q');
      if (q) setSearchValue(q);
    } catch { }
  }, []);

  useEffect(() => {
    fetchList(currentPage, dateFilter, planFilter);
  }, [currentPage, dateFilter, planFilter, recentActions, statusFilter, fetchList]);

  // Debounce searchValue to avoid many requests while typing
  useEffect(() => {
    const id = setTimeout(() => {
      let val = (searchValue || '').trim();
      // normalize leading # (user may type #248)
      const mHash = val.match(/^#(\d+)$/);
      if (mHash) val = mHash[1];
      const isOnlyDigits = val !== '' && /^\d+$/.test(val);
      // require at least 3 chars to search, or empty to clear, OR allow pure numeric searches
      if (val === '' || val.length >= 3 || isOnlyDigits) {
        // if search is temporarily disabled due to server throttle, skip
        if (searchDisabledUntil && new Date() < new Date(searchDisabledUntil)) return;
        setCurrentPage(1);
        // If the search is purely numeric, treat it as a global order-id search: ignore plan/date filters
        if (isOnlyDigits) {
          try { syncUrl({ q: val || null, plan: null, date: null }); } catch { }
          fetchList(1, 'todos', 'todos', { q: val });
        } else {
          try { syncUrl({ q: val || null }); } catch { }
          fetchList(1, dateFilter, planFilter, { q: val });
        }
      }
    }, 600);
    return () => clearTimeout(id);
  }, [searchValue, dateFilter, planFilter, searchDisabledUntil]);

  const handlePageChange = (page) => setCurrentPage(page);

  const syncUrl = (next) => {
    try {
      const params = new URLSearchParams(window.location.search);
      Object.entries(next).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') params.delete(k);
        else params.set(k, String(v));
      });
      const url = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', url);
    } catch { }
  };

  // Agrupa por status usando o pipeline compartilhado
  const groupedByStatus = useMemo(() => {
    // Cria estrutura base + set por coluna para evitar duplicatas por order_id
    const base = STATUS_PIPELINE.reduce((acc, column) => {
      acc[column.key] = [];
      return acc;
    }, {});
    const seenPerColumn = STATUS_PIPELINE.reduce((acc, column) => {
      acc[column.key] = new Set();
      return acc;
    }, {});
    const fallbackKey = "unmapped";

    list.forEach((item) => {
      const stage = item.status_code ? stageByCode[item.status_code] : undefined;
      const resolvedKey = stage && base[stage.key] ? stage.key : fallbackKey;
      const subscriberId = item.subscriber_id ?? item.user_id ?? "?";
      const childKey = item.child_id ?? item.baby_name ?? "";
      const composite = `${subscriberId}_${childKey}`;
      const seen = seenPerColumn[resolvedKey];
      if (!seen.has(composite)) {
        seen.add(composite);
        base[resolvedKey].push(item);
      }
    });

    return base;
  }, [list]);

  // Ordenação client-side (por página atual). Campos suportados: 'mother_name', 'status'
  const filteredList = useMemo(() => {
    if (!statusFilter || statusFilter === 'all') {
      console.log('FILTER_STATUS: Sem filtro ou "all" selecionado.');
      return list;
    }
    const normalized = String(statusFilter).toLowerCase();
    const filtered = (list || []).filter((item) => {
      const code = String(item?.status_code || item?.status || item?.separation_status || '').toLowerCase();
      return code === normalized;
    });
    console.log('FILTER_STATUS: Aplicado filtro', normalized, '=>', filtered.length, 'itens.');
    return filtered;
  }, [list, statusFilter]);

  const sortedList = useMemo(() => {
    console.log('CALC_SORT: Recalculando lista.', { sortBy, sortDir });
    const source = filteredList;
    if (!sortBy) {
      console.log('CALC_SORT: Sem ordenação, retornando lista original.');
      return source;
    }
    const copy = [...(source || [])];
    const dir = sortDir === 'asc' ? 1 : -1;
    copy.sort((a, b) => {
      const get = (it, key) => {
        if (!it) return '';
        // map sort keys to actual fields
        if (key === 'mother_name') return String(it.mother_name || it.user?.name || '').toLowerCase();
        if (key === 'status') return String(it.status || it.separation_status || it.status_code || '').toLowerCase();
        return String(it[key] ?? '').toLowerCase();
      };
      const va = get(a, sortBy);
      const vb = get(b, sortBy);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    console.log('CALC_SORT: Lista ordenada', copy.map(item => `${item?.order_id}-${item?.status_code}`));
    return copy;
  }, [filteredList, sortBy, sortDir]);

  // Mantém a lógica de evitar duplicidade (assinante+bebê) porém aplicando sobre a lista ordenada
  const listForDisplay = useMemo(() => {
    return Array.from(
      new Map((sortedList || []).map(item => [
        `${item.subscriber_id || item.user_id || ''}_${item.child_id || item.baby_name || ''}`,
        item
      ])).values()
    );
  }, [sortedList]);

  const toggleSort = (field) => {
    console.log('TOGGLE_SORT: Chamado', { field });
    console.log('TOGGLE_SORT: Estado ANTES', { sortBy, sortDir });
    if (sortBy !== field) {
      setSortBy(field);
      setSortDir('asc');
      console.log('TOGGLE_SORT: Estado DEPOIS (novo campo)', { sortBy: field, sortDir: 'asc' });
    } else {
      if (sortDir === 'asc') {
        setSortDir('desc');
        console.log('TOGGLE_SORT: Estado DEPOIS (desc)', { sortBy, sortDir: 'desc' });
      } else {
        setSortBy(null);
        setSortDir('asc');
        console.log('TOGGLE_SORT: Estado DEPOIS (reset)', { sortBy: null, sortDir: 'asc' });
      }
    }
    setCurrentPage(1);
  };

  // chave que representa o estado dos filtros/visualização para forçar remount
  const contentKey = `${viewMode || 'vm'}|${planFilter || 'plan'}|${dateFilter || 'date'}|${recentActions ? 'r' : 'n'}|${(searchValue || '').slice(0, 30)}|p${currentPage}`;

  // Envia SEMPRE o CÓDIGO ao backend
  const handleUpdateStatus = async (orderId, currentStatusCode, direction) => {
    const currentStage = currentStatusCode ? stageByCode[currentStatusCode] : undefined;
    if (!currentStage) {
      setToast({ type: "error", message: "Status desconhecido" });
      return;
    }

    const targetStatusLabel =
      direction === "next" ? currentStage.nextStatusLabel : currentStage.prevStatusLabel;
    const targetStatusCode =
      direction === "next" ? currentStage.nextCode : currentStage.prevCode;

    if (!targetStatusCode) {
      setToast({ type: "info", message: "Ação não permitida" });
      return;
    }

    setUpdatingIds((prev) => ({ ...prev, [orderId]: true }));

    try {
      await updateSeparationStatus(orderId, targetStatusCode); // envia { status: <codigo> } no serviço
      setToast({ type: "success", message: `Status do pedido #${orderId} atualizado para ${targetStatusLabel}` });
      await fetchList(currentPage, dateFilter, planFilter, { showLoading: false });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Falha ao atualizar status" });
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [orderId]: false }));
      // manter o toast visível por mais tempo (8s) para alinhar com useToast
      setTimeout(() => setToast(null), 8000);
    }
  };

  const handleViewToggle = (mode) => {
    // debug: log when view toggle is invoked to help trace timeline rendering issue
    try {
      // eslint-disable-next-line no-console
      console.debug('[SeparacaoPage] handleViewToggle called, mode=', mode);
    } catch (e) { }
    setViewMode(mode);
    syncUrl({ view: mode });
  };

  // Unifica comportamento: atualiza filtro, sincroniza URL e reseta paginação
  const handlePlanToggle = (planKey) => {
    const mapped = PLAN_MAP[planKey];
    setPlanFilter((prev) => {
      const next = mapped ? (prev === mapped ? 'todos' : mapped) : 'todos';
      try { syncUrl({ plan: next }); } catch { };
      return next;
    });
    setCurrentPage(1);
  };

  const handleDateToggle = () => {
    setDateFilter((prev) => {
      const next = prev === 'proximos-15-dias' ? 'todos' : 'proximos-15-dias';
      try { syncUrl({ date: next }); } catch { };
      return next;
    });
    setCurrentPage(1);
  };

  // Ao ativar 'Todos' queremos mostrar TODOS os clientes ativos da Aevolua
  // Isso corresponde a requisitar date='todos' e plan='todos' ao backend
  // e também limpar qualquer filtro de "recent".
  const handleTodosToggle = () => {
    // força mostrar todos: plano = todos, janela de datas = todos, limpa recentes
    setPlanFilter('todos');
    setDateFilter('todos');
    setRecentActions(false);
    try { syncUrl({ plan: 'todos', date: 'todos', recent: null }); } catch { }
    setCurrentPage(1);
  };

  // Ação única para gerar etiqueta (reutilizada em Kanban e Lista)
  const handleGenerateLabel = async (orderId) => {
    try {
      setUpdatingIds((prev) => ({ ...prev, [orderId]: true }));
      const res = await generateShippingLabel(orderId);
      const labelUrl = res?.data?.label_url;
      if (labelUrl) {
        window.open(labelUrl, '_blank', 'noopener');
      }
      setLabelLocked((prev) => ({ ...prev, [orderId]: true }));
      await fetchList(currentPage, dateFilter, planFilter, { showLoading: false });
      setToast({ type: 'success', message: 'Etiqueta gerada com sucesso.' });
    } catch (e) {
      console.error(e);
      const message = e?.response?.data?.message || 'Falha ao gerar etiqueta';
      if (e?.response?.status === 409) {
        setLabelLocked((prev) => ({ ...prev, [orderId]: true }));
      }
      setToast({ type: 'error', message });
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Hotfix: permite que Lista/Timeline solicitem atualização por CÓDIGO de status
  // Sem alterar o handler usado pelo Kanban (que trabalha com direção).
  const handleSetStatusByCode = async (orderId, targetStatusCode) => {
    if (!orderId || !targetStatusCode) return;

    setUpdatingIds((prev) => ({ ...prev, [orderId]: true }));

    try {
      await updateSeparationStatus(orderId, targetStatusCode);
      // tenta recuperar label leg vel do pipeline para deixar o toast consistente
      const stage = stageByCode[targetStatusCode];
      const label = stage ? stage.statusLabel : targetStatusCode;
      setToast({ type: 'success', message: `Status do pedido #${orderId} atualizado para ${label}` });
      await fetchList(currentPage, dateFilter, planFilter, { showLoading: false });
    } catch (err) {
      console.error('handleSetStatusByCode error', err);
      setToast({ type: 'error', message: 'Falha ao atualizar status' });
      throw err;
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [orderId]: false }));
      // manter o toast visível por mais tempo (8s) para alinhar com useToast
      setTimeout(() => setToast(null), 8000);
    }
  };

  const filterOptions = useMemo(
    () => [
      { id: "kanban", label: "Kanban", onSelect: () => handleViewToggle("kanban"), isActive: viewMode === "kanban" },
      { id: "list", label: "Lista", onSelect: () => handleViewToggle("list"), isActive: viewMode === "list" },
      { id: "timeline", label: "Linha do Tempo", onSelect: () => handleViewToggle("timeline"), isActive: viewMode === "timeline" },
      { id: "petit", label: "Petit", onSelect: () => handlePlanToggle("petit"), isActive: planFilter === PLAN_MAP.petit },
      { id: "bebe", label: "Bebê", onSelect: () => handlePlanToggle("bebe"), isActive: planFilter === PLAN_MAP.bebe },
      { id: "proximos", label: "Próximos 15 dias", onSelect: handleDateToggle, isActive: dateFilter === "proximos-15-dias" },
      { id: "todos", label: "Todos", onSelect: handleTodosToggle, isActive: dateFilter === "todos" && planFilter === 'todos' },
    ],
    [viewMode, planFilter, dateFilter, recentActions]
  );

  // Options for status filter derived from the shared pipeline
  const statusOptions = useMemo(() => {
    const base = [{ value: 'all', label: 'Mostrar Todos' }];
    const fromPipeline = STATUS_PIPELINE.filter((s) => !("isFallback" in s)).map((s) => ({ value: s.statusCode, label: s.statusLabel }));
    return [...base, ...fromPipeline];
  }, []);

  // status menu logic moved to SeparationList component

  // removidos styled-components dinâmicos (agora no topo do arquivo)

  // Mantém controle local de pedidos com etiqueta gerada nesta sessão
  const [labelLocked, setLabelLocked] = useState({});

  const renderKanban = () => (
    <KanbanWrapper>
      {STATUS_PIPELINE.filter((c) => !("isFallback" in c && c.isFallback)).map((column) => {
        const cards = (groupedByStatus[column.key] || []).map((item) => {
          const currentStage = item.status_code ? stageByCode[item.status_code] : undefined;
          const isUpdating = Boolean(updatingIds[item.order_id]);

          // janela de 14 dias antes do próximo envio
          let deadlineStart = null;
          if (item.next_shipment_date) {
            const endDate = new Date(item.next_shipment_date);
            if (!Number.isNaN(endDate.getTime())) {
              const startDate = new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000);
              deadlineStart = startDate.toISOString().split("T")[0];
            }
          }

          const compositeId = `${item.subscriber_id ?? item.user_id ?? 'u'}_${item.child_id ?? item.baby_name ?? 'c'}`;
          return {
            id: compositeId,
            orderId: item.order_id,
            linkId: item.subscriber_id || item.user_id || item.id,
            title: item.baby_name || "Bebê não informado",
            titleComplement:
              item.product_to_send?.name || item.product?.name || item.product_name || "Produto não mapeado",
            deadline_start: deadlineStart,
            deadline_end: item.next_shipment_date,
            tags: item.baby_age_label ? [{ id: `age-${item.order_id}`, label: item.baby_age_label }] : [],
            assignee: item.mother_name,
            canMoveForward: Boolean(currentStage?.nextCode),
            canMoveBackward: Boolean(currentStage?.prevCode),
            onMove: (direction) => handleUpdateStatus(item.order_id, item.status_code, direction),
            isUpdating,
          };
        });

        return (
          <KanbanColumn
            key={column.key}
            title={column.label}
            count={cards.length}
            recent={recentActions}
            cards={cards.map((c) => {
              if (column.key === 'shipped') {
                return {
                  ...c,
                  extraActionLabel: 'Gerar Etiqueta',
                  extraActionDisabled: Boolean(labelLocked[c.orderId] || c.label_generated),
                  onExtraAction: async () => {
                    try {
                      setUpdatingIds((prev) => ({ ...prev, [c.orderId]: true }));
                      const res = await generateShippingLabel(c.orderId);
                      const labelUrl = res?.data?.label_url;
                      if (labelUrl) {
                        window.open(labelUrl, '_blank', 'noopener');
                      }
                      // Trava o botão para este pedido na sessão atual
                      setLabelLocked((prev) => ({ ...prev, [c.orderId]: true }));
                      await fetchList(currentPage, dateFilter, planFilter, { showLoading: false });
                      setToast({ type: 'success', message: 'Etiqueta gerada com sucesso.' });
                    } catch (e) {
                      console.error(e);
                      const message = e?.response?.data?.message || 'Falha ao gerar etiqueta';
                      // Se backend sinalizar que já foi gerada (409), também trava localmente
                      if (e?.response?.status === 409) {
                        setLabelLocked((prev) => ({ ...prev, [c.orderId]: true }));
                      }
                      setToast({ type: 'error', message });
                    } finally {
                      setUpdatingIds((prev) => ({ ...prev, [c.orderId]: false }));
                    }
                  },
                  // Exibe badge quando já gerada nesta sessão
                  tags: (labelLocked[c.orderId] || c.label_generated)
                    ? [
                      ...(Array.isArray(c.tags) ? c.tags : []),
                      { id: 'label-generated', label: 'Etiqueta gerada' },
                    ]
                    : c.tags,
                };
              }
              return c;
            })}
            emptyState={`Nenhum pedido em ${column.label}.`}
          />
        );
      })}
    </KanbanWrapper>
  );



  const renderList = () => (
    <TableContainer>
      <Table>
        <thead>
          <Tr>
            <Th>
              <SortButton onClick={() => toggleSort('mother_name')} aria-label="Ordenar por nome">
                Assinante / Bebê
                {sortBy === 'mother_name' ? (sortDir === 'asc' ? <FaSortUp size={14} style={{ color: 'var(--color-primary, #9dd9d2)' }} /> : <FaSortDown size={14} style={{ color: 'var(--color-primary, #9dd9d2)' }} />) : <FaSort size={14} style={{ color: 'var(--color-muted, #94a3b8)' }} />}
              </SortButton>
            </Th>
            <ThPedido>Pedido</ThPedido>
            <Th>Brinquedo / Idade</Th>
            <ThAcao>Ação</ThAcao>
            <Th>
              <SortButton onClick={() => toggleSort('status')} aria-label="Ordenar por status">
                Status
                {sortBy === 'status' ? (sortDir === 'asc' ? <FaSortUp size={14} style={{ color: 'var(--color-primary, #9dd9d2)' }} /> : <FaSortDown size={14} style={{ color: 'var(--color-primary, #9dd9d2)' }} />) : <FaSort size={14} style={{ color: 'var(--color-muted, #94a3b8)' }} />}
              </SortButton>
            </Th>
          </Tr>
        </thead>
        <tbody>
          {listForDisplay.length > 0 ? (
            // lista já deduplicada e ordenada (por página)
            listForDisplay.map((item) => {
              const stage = item.status_code ? stageByCode[item.status_code] : undefined;
              const canPrev = Boolean(stage?.prevCode);
              const canNext = Boolean(stage?.nextCode);
              return (
                <Tr key={`${item.subscriber_id || item.user_id || ''}_${item.child_id || item.baby_name || ''}`}>
                  <Td>
                    <SubscriberName to={`/assinantes/${item.subscriber_id || item.user_id || item.id}`}>{item.mother_name}</SubscriberName>
                    <SmallMuted>
                      Criança: <BabyName to={`/assinantes/${item.subscriber_id || item.user_id || item.id}`}>{item.baby_name || 'Bebê não informado'}</BabyName>
                    </SmallMuted>
                  </Td>
                  <TdCenter>
                    <ProductName as="div">#{item.order_id}</ProductName>
                    <SmallMuted>{item.plan_name || ''}</SmallMuted>
                  </TdCenter>
                  <Td>
                    <ProductName>
                      {item.product_to_send?.name || item.brinquedo?.name || item.product?.name || item.product_name || "Produto não mapeado"}
                    </ProductName>
                    <ProductMeta>{item.baby_age_label || "Idade não calculada"}</ProductMeta>
                  </Td>
                  <ActionsCell>
                    <MenuButton onClick={() => setOpenMenuFor(openMenuFor === item.order_id ? null : item.order_id)}>
                      Definir ▾
                    </MenuButton>
                    {stage?.statusCode === 'shipped' && (
                      <PrimaryActionButton
                        style={{ marginLeft: 8 }}
                        disabled={Boolean(labelLocked[item.order_id] || item.label_generated || updatingIds[item.order_id])}
                        onClick={() => handleGenerateLabel(item.order_id)}
                        title={labelLocked[item.order_id] || item.label_generated ? 'Etiqueta já gerada' : 'Gerar etiqueta'}
                      >
                        Gerar Etiqueta
                      </PrimaryActionButton>
                    )}
                    {openMenuFor === item.order_id && (
                      <MenuList>
                        {STATUS_PIPELINE.filter((s) => !("isFallback" in s)).map((s) => (
                          <MenuItem key={s.statusCode} onClick={async () => {
                            setOpenMenuFor(null);
                            // usa handler por c digo passado pela Page para unificar comportamento e toasts
                            try {
                              setUpdatingIds((prev) => ({ ...prev, [item.order_id]: true }));
                              await handleSetStatusByCode(item.order_id, s.statusCode);
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setUpdatingIds((prev) => ({ ...prev, [item.order_id]: false }));
                            }
                          }}>
                            {s.statusLabel}
                          </MenuItem>
                        ))}
                      </MenuList>
                    )}
                  </ActionsCell>
                  <Td>
                    {stage ? stage.statusLabel : (item.status || "Não definido")}
                    {recentActions && (
                      <span style={{
                        marginLeft: 8,
                        padding: '2px 8px',
                        borderRadius: 9,
                        border: '1px solid rgba(148,163,184,.35)',
                        background: 'rgba(148,163,184,.12)',
                        color: '#cbd5e1',
                        fontWeight: 700,
                        fontSize: '0.7rem'
                      }}>Recentes</span>
                    )}
                    {(labelLocked[item.order_id] || item.label_generated) && (
                      <span style={{
                        marginLeft: 8,
                        padding: '2px 8px',
                        borderRadius: 9,
                        border: '1px solid #22c55e',
                        background: 'rgba(34,197,94,.12)',
                        color: '#d1fae5',
                        fontWeight: 700,
                        fontSize: '0.7rem'
                      }}>Etiqueta gerada</span>
                    )}
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr>
                <EmptyTableCell colSpan="5">{(statusFilter && statusFilter !== 'all') ? `Nenhum item encontrado para o status "${(stageByCode[statusFilter] ? stageByCode[statusFilter].statusLabel : statusFilter)}".` : 'Nenhuma separação encontrada.'}</EmptyTableCell>
            </Tr>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <ListPageLayout
        title="Separação de Pedidos"
        description="Painel visual para acompanhar e avançar cada etapa da logística de separação."
        filters={
          <>
            <FiltersBar
              filters={filterOptions}
            />
          </>
        }
        headerRight={(
          <SearchBar
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const raw = (searchValue || '').trim();
                const m = raw.match(/^#?(\d+)$/);
                if (m) {
                  const digits = m[1];
                  setCurrentPage(1);
                  fetchList(1, 'todos', 'todos', { q: digits });
                  try { syncUrl({ q: digits || null, plan: null, date: null }); } catch { }
                } else {
                  setCurrentPage(1);
                  fetchList(1, dateFilter, planFilter, { q: raw });
                  try { syncUrl({ q: raw || null }); } catch { }
                }
              }
            }}
            onSearch={() => {
              const raw = (searchValue || '').trim();
              const m = raw.match(/^#?(\d+)$/);
              if (m) {
                const digits = m[1];
                setCurrentPage(1);
                fetchList(1, 'todos', 'todos', { q: digits });
                try { syncUrl({ q: digits || null, plan: null, date: null }); } catch { }
              } else {
                setCurrentPage(1);
                fetchList(1, dateFilter, planFilter, { q: raw });
                try { syncUrl({ q: raw || null }); } catch { }
              }
            }}
            placeholder="Pesquisar por assinante, bebê, pedido, produto ou status..."
            disabled={Boolean(searchDisabledUntil && new Date() < new Date(searchDisabledUntil))}
            showSearchButton={true}
          />
        )}
        pagination={
          paginationInfo && paginationInfo.totalPages > 1 && (
            <Pagination
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={handlePageChange}
            />
          )
        }
        transparent
      >
        {loading ? (
          <SeparationList
            loading
            items={sortedList}
            statusPipeline={STATUS_PIPELINE}
            stageByCode={stageByCode}
            recentActions={recentActions}
            labelLocked={{}}
            updatingIds={{}}
            presentation="custom"
            statusOptions={statusOptionsMemo}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            sortDir={sortDir}
            toggleSort={toggleSort}
          />
        ) : error ? (
          <div>
            <ErrorMessage>{error}</ErrorMessage>
            {(String(error).toLowerCase().includes('sessão expirada') || (typeof window !== 'undefined' && window.__AUTH_EXPIRED)) && (
              <div style={{ marginTop: 8 }}>
                <PrimaryActionButton onClick={() => { window.location.href = '/login'; }}>
                  Ir para Login
                </PrimaryActionButton>
              </div>
            )}
          </div>
        ) : viewMode === "kanban" ? (
          <AnimatedEntrance key={contentKey} direction="up" duration={420} distance={12}>
            {renderKanban()}
          </AnimatedEntrance>
        ) : viewMode === "list" ? (
          <AnimatedEntrance key={contentKey} direction="up" duration={320} distance={10}>
            <SeparationList
              items={sortedList}
              statusPipeline={STATUS_PIPELINE}
              stageByCode={stageByCode}
              recentActions={recentActions}
              labelLocked={labelLocked}
              updatingIds={updatingIds}
              onGenerateLabel={handleGenerateLabel}
              onSetStatus={handleSetStatusByCode}
              onUpdateStatus={handleUpdateStatus}
              presentation="custom"
              statusOptions={statusOptionsMemo}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              sortDir={sortDir}
              toggleSort={toggleSort}
            />
          </AnimatedEntrance>
        ) : viewMode === "timeline" ? (
          <AnimatedEntrance key={contentKey} direction="up" duration={420} distance={12}>
            <TimelineViewSC orders={list} statusPipeline={STATUS_PIPELINE} stageByCode={stageByCode} classifySLA={classifySLA} onUpdateStatus={(orderId, currentStatusCode, direction) => handleUpdateStatus(orderId, currentStatusCode, direction)} onSetStatus={handleSetStatusByCode} onGenerateLabel={(orderId) => handleGenerateLabel(orderId)} updatingIds={updatingIds} labelLocked={labelLocked} />
          </AnimatedEntrance>
        ) : (
          <div style={{ padding: 16, color: '#94a3b8' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#e5e7eb' }}>Linha do Tempo</p>
            <p style={{ marginTop: 6 }}>Visualização em desenvolvimento. Os filtros e a fonte de dados serão os mesmos da lista.</p>
          </div>
        )}
      </ListPageLayout>
    </>
  );
};

export default SeparacaoPage;
