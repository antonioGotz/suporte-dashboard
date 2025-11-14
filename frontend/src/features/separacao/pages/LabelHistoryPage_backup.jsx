import React, { useEffect, useState, useCallback } from 'react'
import DemoShippingLabel from '../components/DemoShippingLabel'
import { FaFilePdf, FaPrint, FaTimes } from 'react-icons/fa';
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
import styled from 'styled-components'
import { fetchRecentLabels } from '../../../services/shippingService'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #0b1220;
  border: 1px solid rgba(148,163,184,.18);
  border-radius: 12px;
  overflow: hidden;
`

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid rgba(148,163,184,.14);
  color: #cbd5e1;
  font-weight: 700;
  background: #0f172a;
`

const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid rgba(148,163,184,.12);
  color: #e5e7eb;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button`
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(148,163,184,.28);
  background: rgba(99,102,241,.12);
  color: #e5e7eb;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: .02em;
  cursor: pointer;
  &:hover { background: rgba(99,102,241,.18); border-color: rgba(99,102,241,.45); }
`

const Pagination = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const DateInput = styled.input`
  height: 30px;
  background: #0f172a;
  color: #e5e7eb;
  border: 1px solid rgba(148,163,184,.28);
  border-radius: 8px;
  padding: 0 8px;
`;

const LabelHistoryPage = () => {
  const [rows, setRows] = useState([])
  const [showDemo, setShowDemo] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ start_date: '', end_date: '' })

  const load = useCallback(async (p = 1, f = filters) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchRecentLabels(p, perPage, f)
      const data = res?.data?.data || []
      const meta = res?.data
      setRows(data)
      if (meta && meta.last_page) setTotalPages(meta.last_page)
    } catch (e) {
      console.error(e)
      const status = e?.response?.status
      if (status === 401) {
        setError('Sessão expirada. Faça login novamente.')
      } else if (status === 403) {
        setError('Sem permissão para ver o histórico de etiquetas.')
      } else if (status === 404) {
        setError('Endpoint de histórico não encontrado. Verifique as rotas (/api/admin/shipping/labels/recent).')
      } else {
        setError('Não foi possível carregar o histórico de etiquetas')
      }
    } finally {
      setLoading(false)
    }
  }, [perPage, filters])

  useEffect(() => {
    load(page, filters)
  }, [page, filters, load])

  return (
    <Container>
      <h2>Histórico de Etiquetas</h2>
      <FiltersBar>
        <Button onClick={() => setFilters(() => {
          const today = new Date().toISOString().slice(0,10)
          return { start_date: today, end_date: today }
        })}>Hoje</Button>
        <Button onClick={() => setFilters(() => {
          const end = new Date();
          const start = new Date(); start.setDate(end.getDate() - 6);
          return { start_date: start.toISOString().slice(0,10), end_date: end.toISOString().slice(0,10) }
        })}>Últimos 7 dias</Button>
        <Button onClick={() => setFilters(() => {
          const end = new Date();
          const start = new Date(); start.setDate(end.getDate() - 29);
          return { start_date: start.toISOString().slice(0,10), end_date: end.toISOString().slice(0,10) }
        })}>Últimos 30 dias</Button>
        <DateInput type="date" value={filters.start_date} onChange={(e) => setFilters(f => ({ ...f, start_date: e.target.value }))} />
        <span style={{ color: '#94a3b8' }}>até</span>
        <DateInput type="date" value={filters.end_date} onChange={(e) => setFilters(f => ({ ...f, end_date: e.target.value }))} />
        <Button onClick={() => load(1, filters)}>Aplicar</Button>
        <Button onClick={() => setFilters({ start_date: '', end_date: '' })}>Limpar</Button>
      </FiltersBar>

      {loading ? (
        <p>Carregando…</p>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Pedido</Th>
                <Th>Assinante</Th>
                <Th>Gerada em</Th>
                <Th>Ação</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><Td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8' }}>Sem etiquetas recentes</Td></tr>
              ) : rows.map((r, i) => (
                <tr key={`${r.order_id ?? 'o'}_${new Date(r.created_at || Date.now()).getTime()}_${i}`}>
                  <Td>#{r.order_id}</Td>
                  <Td>{r.subscriber_name || r.subscriber_id || '-'}</Td>
                  <Td>{r.created_at ? new Date(r.created_at).toLocaleString('pt-BR') : '-'}</Td>
                  <Td>
                    <Actions>
                      <Button
                        onClick={() => { if (r.view_allowed) { setSelectedRow(r); setShowDemo(true); } }}
                        disabled={!r.view_allowed}
                        title={r.view_allowed ? 'Abrir etiqueta' : 'Etiqueta indisponível (fluxo reiniciado)'}
                      >
                        {r.view_allowed ? 'Abrir etiqueta' : 'Indisponível'}
                      </Button>
                    </Actions>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
            <span style={{ color: '#94a3b8' }}>Página {page} de {totalPages}</span>
            <Button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Próxima</Button>
          </Pagination>
        </>
      )}
      {showDemo && selectedRow && (
        <ModalBg onClick={() => { setShowDemo(false); setSelectedRow(null); }}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <DemoShippingLabel
              destinatario={selectedRow.subscriber_name || 'Destinatário Exemplo'}
              pedido={`#${selectedRow.order_id}`}
              cep={selectedRow.cep_formatted || selectedRow.cep || '00000-000'}
              address={selectedRow.address_line || selectedRow.address}
              number={''}
              complete={selectedRow.complete}
              neighborhood={''}
              city={selectedRow.city}
              state={selectedRow.state}
              userId={selectedRow.subscriber_id}
            />
            {selectedRow.label_status === 'cancelada' && (
              <div style={{
                background: '#fee2e2',
                color: '#b91c1c',
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
              <Button onClick={() => window.print()} title="Imprimir" disabled={selectedRow.label_status === 'cancelada'}><FaPrint style={{ marginRight: 6 }} />Imprimir</Button>
              <Button onClick={() => window.print()} title="Gerar PDF" disabled={selectedRow.label_status === 'cancelada'}><FaFilePdf style={{ marginRight: 6 }} />PDF</Button>
              <Button onClick={() => { setShowDemo(false); setSelectedRow(null); }} title="Fechar"><FaTimes style={{ marginRight: 6 }} />Fechar</Button>
            </div>
            <div style={{fontSize:13, color:'#64748b', marginTop:8, textAlign:'center'}}>
              Dica: ao clicar em PDF, escolha "Salvar como PDF" na janela de impressão para gerar o arquivo.
            </div>
          </ModalBox>
        </ModalBg>
      )}
    </Container>
  )
}

export default LabelHistoryPage
