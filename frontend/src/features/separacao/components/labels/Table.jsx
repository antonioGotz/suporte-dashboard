import React from "react";
import { FaEye } from "react-icons/fa";
import { TableWrap, Shell, Header, List, Row, Cell, Actions, IconBtn, PdfBtn, Responsive, StatusBadge, CanceledBadge, ValidBadge, SkeletonRow, EmptyState } from "./TableStyles";

export default function HistoricoEtiquetasTable({ data = [], onView, onPdf, onPrint, loading = false }) {
  const rows = Array.isArray(data) ? data : [];

  const handleView = (row) => onView && onView(row);
  const handlePdf = (row) => onPdf && onPdf(row);
  const handlePrint = (row) => onPrint && onPrint(row);

  return (
    <TableWrap>
      <Responsive>
        <Shell role="table" aria-label="Historico de Etiquetas">
          <Header role="row">
            <Cell className="muted col1" role="columnheader">Pedido</Cell>
            <Cell className="muted col2" role="columnheader">Assinante</Cell>
            <Cell className="muted col3" role="columnheader">Gerada em</Cell>
            <Cell className="muted right acoes" role="columnheader">Ações</Cell>
          </Header>

          <List>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (<SkeletonRow key={`sk-${i}`} />))
            ) : rows.length === 0 ? (
              <EmptyState>Sem etiquetas recentes</EmptyState>
            ) : rows.map((r, idx) => {
              const isCanceled = r.label_status === 'cancelada';
              const canView = !!r.view_allowed && !isCanceled;
              const viewTitle = canView ? 'Visualizar etiqueta' : 'Visualizar (prévia bloqueada)';
              const rowKey = r.id ?? `${r.order_id || 'o'}-${r.created_at || 't'}-${idx}`;
              return (
                <Row role="row" key={rowKey} className={isCanceled ? 'is-canceled' : undefined}>
                  <Cell className="col1" title={String(r.order_id || "-")}>#{r.order_id}</Cell>
                  <Cell className="col2" title={r.subscriber_email || r.subscriber_name || "-"}>
                    {r.subscriber_name || r.subscriber_id || "-"}
                    {isCanceled ? <CanceledBadge>Cancelada</CanceledBadge> : <ValidBadge>Válida</ValidBadge>}
                  </Cell>
                  <Cell className="col3">{r.created_at ? new Date(r.created_at).toLocaleString('pt-BR') : '-'}</Cell>
                  <Cell className="right acoes">
                    <Actions>
                      <IconBtn
                        aria-label={viewTitle}
                        title={viewTitle}
                        onClick={() => { handleView(r); }}
                        aria-disabled={!canView}
                        >
                        <FaEye size={18} />
                      </IconBtn>
                    </Actions>
                  </Cell>
                </Row>
              );
            })}
          </List>
        </Shell>
      </Responsive>
    </TableWrap>
  );
}

