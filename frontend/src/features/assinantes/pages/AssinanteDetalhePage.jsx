import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, Link, useLocation } from "react-router-dom";
import assinantesService from '../services/assinantesService';
import { FaArrowLeft, FaUser, FaBaby, FaFileInvoiceDollar } from "react-icons/fa";

const PageContainer = styled.div`
  background: var(--color-surface, #111827);
  min-height: 100vh;
  padding: 32px 0;
  color: var(--color-text, #e2e8f0);
`;
const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 32px;
  padding: 0 32px;
`;
const BackLink = styled(Link)`
  color: var(--color-primary, #9dd9d2);
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  &:hover { text-decoration: underline; }
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text, #e2e8f0);
`;
const StatusBadge = styled.span`
  background: ${props => props.$isAdimplente ? "#68d391" : "#fc8181"};
  color: #111827;
  border-radius: 8px;
  padding: 0.4em 1em;
  font-weight: 700;
  font-size: 1rem;
  margin-left: 1rem;
  display: inline-block;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 2.5rem;
  padding: 0 32px;
  align-items: flex-start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;
const Card = styled.div`
  background: var(--color-surface2, #1f2937);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  border: 1px solid var(--color-border, #374151);
  padding: 24px 22px;
  margin-bottom: 2rem;
`;
const CardTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;
const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;
const InfoItem = styled.li`
  font-size: 1rem;
  color: var(--color-text, #e2e8f0);
  span { color: var(--color-muted, #a0aec0); margin-left: 0.5em; }
`;
const ChildrenList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;
const ChildItem = styled.li`
  font-size: 1rem;
  color: var(--color-text, #e2e8f0);
  display: flex;
  align-items: center;
  gap: 0.5em;
  span { color: var(--color-muted, #a0aec0); }
`;
const OrdersCard = styled(Card)`
  margin-bottom: 0;
`;
const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
`;
const OrdersTh = styled.th`
  background: var(--color-surface2, #1f2937);
  color: var(--color-muted, #a0aec0);
  font-weight: 600;
  padding: 10px 8px;
  border-bottom: 1.5px solid var(--color-border, #374151);
  text-align: left;
`;
const OrdersTd = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border, #374151);
  color: var(--color-text, #e2e8f0);
  font-size: 1rem;
`;
const PaymentBadge = styled.span`
  background: ${props => props.$approved ? "#68d391" : "#fc8181"};
  color: #111827;
  border-radius: 7px;
  padding: 0.3em 0.8em;
  font-weight: 600;
  font-size: 0.98rem;
  display: inline-block;
`;
const EmptyMsg = styled.div`
  color: var(--color-muted, #a0aec0);
  font-size: 1rem;
  padding: 1.2em 0;
  text-align: center;
`;

const formatDate = date => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("pt-BR");
  } catch {
    return "N/A";
  }
};
const formatMoney = value => {
  if (!value) return "N/A";
  try {
    return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));
  } catch {
    return value;
  }
};

const AssinanteDetalhePage = () => {
  const { id } = useParams();
  const [assinante, setAssinante] = useState(null);
  const [envios, setEnvios] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssinante = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await assinantesService.getAssinanteById(id);
        const payload = response?.data?.data ?? response?.data ?? null;
        setAssinante(payload);
        // Tentativa best-effort de buscar histórico; ignora erro se rota não existir
        try {
          const historyResp = await assinantesService.getHistorico ? await assinantesService.getHistorico(id) : null;
          setEnvios(historyResp && Array.isArray(historyResp.data?.data) ? historyResp.data.data : (historyResp?.data || []));
        } catch (_) {
          setEnvios([]);
        }
      } catch (err) {
        setError("Não foi possível carregar os dados do assinante.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssinante();
  }, [id]);

  // Badge status: pelo pedido mais recente
  const getStatus = () => {
    // Se veio do filtro de solicitações, sempre mostrar pendente de aprovação
    if (location?.state?.fromSolicitacoes) return 'pending-approval';
    if (!assinante?.orders?.length) return false;
    const sorted = [...assinante.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return sorted[0].gateway_status === "approved";
  };

  return (
    <PageContainer>
      <TopBar>
        <BackLink to="/assinantes"><FaArrowLeft /> Voltar</BackLink>
        {assinante && <>
          <Title>{assinante.name}</Title>
          {getStatus() === 'pending-approval' ? (
            <StatusBadge $isAdimplente={false} style={{background:'#fbbf24',color:'#111827'}}>
              Pendente de aprovação de assinatura
            </StatusBadge>
          ) : (
            <StatusBadge $isAdimplente={getStatus()}>{getStatus() ? "Adimplente" : "Inadimplente"}</StatusBadge>
          )}
        </>}
      </TopBar>
      {loading ? (
        <EmptyMsg>Carregando…</EmptyMsg>
      ) : error ? (
        <EmptyMsg>{error}</EmptyMsg>
      ) : !assinante ? (
        <EmptyMsg>Nenhum dado encontrado.</EmptyMsg>
      ) : (
        <Grid>
          <div>
            <Card>
              <CardTitle><FaUser /> Dados Pessoais</CardTitle>
              <InfoList>
                <InfoItem>Email: <span>{assinante.email || "N/A"}</span></InfoItem>
                <InfoItem>Telefone: <span>{assinante.phone || "N/A"}</span></InfoItem>
                <InfoItem>Documento: <span>{assinante.document || "N/A"}</span></InfoItem>
                <InfoItem>Endereço: <span>{assinante.address || "N/A"}</span></InfoItem>
                <InfoItem>Número: <span>{assinante.number || "N/A"}</span></InfoItem>
                <InfoItem>Cidade: <span>{assinante.city || "N/A"}</span></InfoItem>
                <InfoItem>Estado: <span>{assinante.state || "N/A"}</span></InfoItem>
              </InfoList>
            </Card>
            <Card>
              <CardTitle><FaBaby /> Filho(s)</CardTitle>
              {assinante.children && assinante.children.length > 0 ? (
                <ChildrenList>
                  {Array.from(
                    new Map(
                      assinante.children.map(c => [
                        // chave composta robusta para evitar duplicados de mesmo filho
                        `${c.id || ''}_${c.name || ''}_${c.birth || ''}`,
                        c
                      ])
                    ).values()
                  ).map(child => (
                    <ChildItem key={`${child.id || child.name}_${child.birth || ''}`}>
                      {child.name} <span>({formatDate(child.birth)})</span>
                    </ChildItem>
                  ))}
                </ChildrenList>
              ) : (
                <EmptyMsg>Nenhum filho cadastrado.</EmptyMsg>
              )}
            </Card>
          </div>
          <OrdersCard>
            <CardTitle><FaFileInvoiceDollar /> Histórico de Pedidos</CardTitle>
            {assinante.orders && assinante.orders.length > 0 ? (
              <OrdersTable>
                <thead>
                  <tr>
                    <OrdersTh>ID</OrdersTh>
                    <OrdersTh>Plano</OrdersTh>
                    <OrdersTh>Valor</OrdersTh>
                    <OrdersTh>Status Pagamento</OrdersTh>
                    <OrdersTh>Data</OrdersTh>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Map(
                    [...assinante.orders]
                      .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
                      .map(o => [String(o.id), o])
                  ).values()).map(order => (
                    <tr key={order.id}>
                      <OrdersTd>{order.id}</OrdersTd>
                      <OrdersTd>{order.product?.name || "N/A"}</OrdersTd>
                      <OrdersTd>{formatMoney(order.amount)}</OrdersTd>
                      <OrdersTd>
                        <PaymentBadge $approved={order.gateway_status === "approved"}>
                          {order.gateway_status === "approved" ? "Aprovado" : "Cancelado"}
                        </PaymentBadge>
                      </OrdersTd>
                      <OrdersTd>{formatDate(order.created_at)}</OrdersTd>
                    </tr>
                  ))}
                </tbody>
              </OrdersTable>
            ) : (
              <EmptyMsg>Nenhum pedido encontrado.</EmptyMsg>
            )}
          </OrdersCard>
          <div>
            <Card>
              <CardTitle>Histórico de Envios</CardTitle>
              {(() => {
                const shipped = (Array.isArray(envios) ? envios : []);
                if (shipped.length === 0) {
                  return <EmptyMsg>Nenhum envio encontrado.</EmptyMsg>;
                }
                return (
                  <OrdersTable>
                    <thead>
                      <tr>
                        <OrdersTh>Pedido</OrdersTh>
                        <OrdersTh>Produto</OrdersTh>
                        <OrdersTh>Rastreamento</OrdersTh>
                        <OrdersTh>Status</OrdersTh>
                        <OrdersTh>Data</OrdersTh>
                      </tr>
                    </thead>
                    <tbody>
                      {shipped.map(envio => (
                        <tr key={envio.id}>
                          <OrdersTd>#{envio.order_id || envio.id}</OrdersTd>
                          <OrdersTd>{envio.product_name || envio.product?.name || (envio.product_id ? `#${envio.product_id}` : '—')}</OrdersTd>
                          <OrdersTd>
                            {envio.tracking_code ? (
                              <a
                                href={`https://www.muambator.com.br/pacotes/${encodeURIComponent(envio.tracking_code)}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                style={{ color: '#9dd9d2', textDecoration: 'none', fontWeight: 600 }}
                                title="Abrir rastreio em nova aba"
                              >
                                {envio.tracking_code}
                              </a>
                            ) : (
                              '—'
                            )}
                          </OrdersTd>
                          <OrdersTd>{envio.status_label || 'Enviado/Coletado'}</OrdersTd>
                          <OrdersTd>{formatDate(envio.created_at)}</OrdersTd>
                        </tr>
                      ))}
                    </tbody>
                  </OrdersTable>
                );
              })()}
            </Card>
          </div>
        </Grid>
      )}
    </PageContainer>
  );
};

export default AssinanteDetalhePage;
