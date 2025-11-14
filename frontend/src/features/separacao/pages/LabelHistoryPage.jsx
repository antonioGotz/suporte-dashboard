import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';
import DemoShippingLabel from '../components/DemoShippingLabel';
import { FaFilePdf, FaPrint } from 'react-icons/fa';
import { fetchRecentLabels } from '../../../services/shippingService';
import { exportElementToPdf } from '../../../utils/pdf';
import HistoricoEtiquetasTable from '../components/labels/Table.jsx';
import GlobalFilterButton, { FilterContainer as GlobalFilterContainer } from '../../../components/FilterControls.jsx';
import InlineSpinner from '../../../components/InlineSpinner.jsx';
import SearchBar from '../../../components/SearchBar.jsx';

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;
// imports movidos para o topo do arquivo

// Tema escopado apenas para a tabela deste histórico
const LabelHistoryTableTheme = styled.div`
  /* Tokens locais e semânticos aplicados somente nesta tabela */
  --color-text-light: #111827;
  --color-text-muted: #6b7280;
  --border: #e5e7eb;
  --card: #ffffff;
  --color-primary: #16a34a;

  --table-row-zebra: #fafafa;
  --table-row-hover: #f3f4f6;

  table tbody tr:nth-child(even) {
    background-color: var(--table-row-zebra) !important;
  }
  table tbody tr:hover {
    background-color: var(--table-row-hover) !important;
  }
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.38);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #1e293b;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 32px 32px 24px;
  min-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FiltrosRow = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

const FiltersCluster = styled(GlobalFilterContainer)`
  margin-bottom: 0;
  flex-wrap: wrap;
  gap: 0.6rem;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionBtn = styled.button`
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  background: #232b38;
  color: #e5e7eb;
  transition: transform 120ms ease, box-shadow 180ms ease, background 160ms ease, filter 160ms ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 0 rgba(0,0,0,0.25);

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0,0,0,0.28);
    background: #2b3a4e;
    filter: brightness(1.02);
  }

  &:active:not(:disabled) {
    transform: translateY(0px) scale(0.99);
    box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const normalizeText = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

const matchesSearchTerm = (row, normalizedTerm) => {
  if (!normalizedTerm) return true;
  const candidates = [
    row.order_id ? `#${row.order_id}` : '',
    row.order_id,
    row.subscriber_id,
    row.subscriber_name,
    row.subscriber_email,
    row.label_status,
    row.created_at,
    row.label_canceled_at,
    row.tracking,
    row.address,
    row.cep,
    row.cep_formatted,
    row.city,
    row.state,
  ];
  return candidates.some((value) => normalizeText(value).includes(normalizedTerm));
};

const filterRowsByTerm = (rows, term) => {
  if (!Array.isArray(rows)) return [];
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) return rows;
  return rows.filter((row) => matchesSearchTerm(row, normalizedTerm));
};

// Função auxiliar para exportar PDF do modal
function handleExportPdf(row, labelRef) {
  const node = labelRef.current;
  const orderId = row.order_id || '';
  const rawName = row.subscriber_name || 'assinante';
  const safeName = String(rawName)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  const filename = `etiqueta_${safeName}_${orderId}.pdf`;
  if (node) exportElementToPdf(node, filename);
}

// Função auxiliar para exportar PDF direto da linha (tabela)
function handleExportPdfFromRow(row) {
  // Gera PDF da etiqueta usando jsPDF e o modelo DemoShippingLabel
  const doc = new jsPDF({ unit: 'mm', format: [90, 54] }); // formato padrão etiqueta
  // Cabeçalho
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Etiqueta de Envio', 8, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Pedido: #${row.order_id || '-'}`, 8, 20);
  doc.text(`Assinante: ${row.subscriber_name || '-'}`, 8, 26);
  doc.text(`ID: ${row.subscriber_id || '-'}`, 8, 32);
  doc.text(`Endereço: ${row.address || '---'}`, 8, 38, { maxWidth: 74 });
  doc.text(`CEP: ${row.cep || '-'}`, 8, 44);
  doc.text(`Rastreamento: ${row.tracking || '-'}`, 8, 50);
  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text('Etiqueta gerada automaticamente - Não usar para envio real', 8, 53, { maxWidth: 74 });
  // Nome do arquivo
  const rawName = row.subscriber_name || 'assinante';
  const safeName = String(rawName)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  const filename = `etiqueta_${safeName}_${row.order_id || ''}.pdf`;
  doc.save(filename);
}

function LabelHistoryPage() {
  const [period, setPeriod] = useState('all');
  // Controla se o filtro deve ser disparado automaticamente ao trocar o período
  const isFirstRender = useRef(true);

  function getDateRange(period) {
    const today = new Date();
    let start = '', end = '';
    end = today.toISOString().slice(0, 10);
    if (period === 'today') {
      start = end;
    } else if (period === '7d') {
      const d = new Date(today); d.setDate(d.getDate() - 6);
      start = d.toISOString().slice(0, 10);
    } else if (period === '30d') {
      const d = new Date(today); d.setDate(d.getDate() - 29);
      start = d.toISOString().slice(0, 10);
    } else if (period === 'all') {
      start = '';
      end = '';
    }
    return { start, end };
  }

  // Função de filtro centralizada
  const handleFilter = useCallback(() => {
    setLoading(true);
    const { start, end } = getDateRange(period);
    const filters = {};
    if (period !== 'all') {
      if (start) filters.start_date = start;
      if (end) filters.end_date = end;
    }
    fetchRecentLabels(1, 20, filters)
      .then(res => {
        setRows(res.data?.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar etiquetas");
        setLoading(false);
      });
  }, [period]);

  // Dispara filtro automaticamente ao trocar o período, exceto no primeiro render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    handleFilter();
  }, [period, handleFilter]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const labelRef = useRef();

  // Carrega dados iniciais (primeiro render)
  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Garante que rows sempre será array
  const safeRows = Array.isArray(rows) ? rows : [];
  const filteredRows = useMemo(() => filterRowsByTerm(safeRows, searchTerm), [safeRows, searchTerm]);

  const triggerSearch = useCallback(() => {
    setSearchTerm(searchInput.trim());
  }, [searchInput]);

  const handleSearchSubmit = useCallback((event) => {
    if (event) event.preventDefault();
    triggerSearch();
  }, [triggerSearch]);

  useEffect(() => {
    if (searchInput.trim() === '' && searchTerm !== '') {
      setSearchTerm('');
    }
  }, [searchInput, searchTerm]);

  return (
    <Container>
  {/* O filtro agora é automático, mas mantém o form para acessibilidade */}
  <FiltrosRow onSubmit={handleSearchSubmit}>
        <FiltersCluster>
          <GlobalFilterButton $isActive={period==='all'} onClick={() => setPeriod('all')}>Todos</GlobalFilterButton>
          <GlobalFilterButton $isActive={period==='today'} onClick={() => setPeriod('today')}>Hoje</GlobalFilterButton>
          <GlobalFilterButton $isActive={period==='7d'} onClick={() => setPeriod('7d')}>7 dias</GlobalFilterButton>
          <GlobalFilterButton $isActive={period==='30d'} onClick={() => setPeriod('30d')}>30 dias</GlobalFilterButton>
        </FiltersCluster>
        <SearchBox>
          <SearchBar
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={triggerSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                triggerSearch();
              }
            }}
            placeholder="Buscar por pedido, assinante ou data"
            showSearchButton
          />
        </SearchBox>
      </FiltrosRow>

      {/* Texto de apoio do período atual */}
      {(() => {
        const { start, end } = getDateRange(period);
        const fmt = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '';
        const msg = period === 'all' ? 'Exibindo todos os registros' : `Filtrando de ${fmt(start)} até ${fmt(end)}`;
        return (
          <p style={{ color: '#94a3b8', margin: '4px 2px 8px' }}>{msg}</p>
        );
      })()}

      {searchTerm && !loading && filteredRows.length === 0 && (
        <p style={{ color: '#f87171', margin: '0 2px 8px' }}>
          Nenhuma etiqueta encontrada para "{searchTerm}".
        </p>
      )}

      {loading ? (
        <div role="status" aria-live="polite">Carregando…</div>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : (
        <HistoricoEtiquetasTable
          data={filteredRows}
          loading={loading}
          onView={(row) => { if (row?.view_allowed) { setSelectedRow(row); setShowDemo(true); } }}
          onPrint={(row) => handleExportPdfFromRow(row)}
        />
      )}

      {/* Modal de visualização da etiqueta */}
      {showDemo && selectedRow && (
        <ModalBg onClick={(e) => { if (e.target === e.currentTarget) { setShowDemo(false); setSelectedRow(null); } }}>
          <ModalBox>
            <DemoShippingLabel
              ref={labelRef}
              destinatario={selectedRow.subscriber_name || '-'}
              pedido={`#${selectedRow.order_id || ''}`}
              cep={selectedRow.cep_formatted || selectedRow.cep || '-'}
              address={selectedRow.address}
              number={selectedRow.number}
              neighborhood={selectedRow.neighborhood}
              complete={selectedRow.complete}
              city={selectedRow.city}
              state={selectedRow.state}
              userId={selectedRow.subscriber_id}
            />
            {selectedRow.label_status === 'cancelada' && (
              <div style={{
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: 8,
                padding: '10px 14px',
                marginTop: 14,
                fontSize: 15,
                fontWeight: 600,
                textAlign: 'center',
                maxWidth: 340
              }}>
                Esta etiqueta foi cancelada automaticamente.<br />
                Data do cancelamento: {selectedRow.label_canceled_at ? new Date(selectedRow.label_canceled_at).toLocaleString('pt-BR') : '-'}
              </div>
            )}
            {(!(selectedRow.address_line || selectedRow.address) || !selectedRow.city || !selectedRow.state || !(selectedRow.cep_formatted || selectedRow.cep)) && (
              <div style={{
                background: '#fffbe6',
                color: '#b45309',
                border: '1px solid #fde68a',
                borderRadius: 8,
                padding: '10px 14px',
                marginTop: 14,
                fontSize: 15,
                fontWeight: 500,
                textAlign: 'center',
                maxWidth: 340
              }}>
                Atenção: endereço do assinante incompleto ou ausente. Por favor, revise os dados antes de postar.
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 22, justifyContent: 'center' }}>
              <ActionBtn
                onClick={async () => {
                  if (selectedRow.label_status === 'cancelada') return;
                  setActionLoading(true);
                  try {
                    // impressão do navegador; exibimos loading apenas para feedback
                    window.print();
                  } finally {
                    // pequeno atraso só para dar sensação de ação
                    setTimeout(() => setActionLoading(false), 300);
                  }
                }}
                title="Imprimir"
                disabled={selectedRow.label_status === 'cancelada' || actionLoading}
              >
                {actionLoading ? <InlineSpinner size={16} /> : <FaPrint style={{ marginRight: 6 }} />}
                {actionLoading ? 'Preparando…' : 'Imprimir'}
              </ActionBtn>
              <ActionBtn
                onClick={async () => {
                  if (selectedRow.label_status === 'cancelada') return;
                  setActionLoading(true);
                  try {
                    await handleExportPdf(selectedRow, labelRef);
                  } finally {
                    setActionLoading(false);
                  }
                }}
                title="Gerar PDF"
                disabled={selectedRow.label_status === 'cancelada' || actionLoading}
              >
                {actionLoading ? <InlineSpinner size={16} /> : <FaFilePdf style={{ marginRight: 6 }} />}
                {actionLoading ? 'Gerando…' : 'PDF'}
              </ActionBtn>
            </div>
            {/* Aviso de "Salvar como PDF" removido: agora o PDF é gerado automaticamente */}
          </ModalBox>
        </ModalBg>
      )}
    </Container>
  )
}

export default LabelHistoryPage

