import React from 'react';
import styled from 'styled-components';

const DemoLabel = styled.div`
  width: 380px;
  min-height: 230px;
  background: #fff;
  border: 2px dashed #94a3b8;
  border-radius: 10px;
  box-shadow: 0 6px 28px rgba(2,6,23,0.35);
  padding: 18px;
  color: #0f172a;
  font-family: Inter, 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  overflow: hidden; /* garante que nada extrapole a etiqueta */
`;

const Barcode = styled.div`
  width: 100%;
  height: 44px;
  background: repeating-linear-gradient(90deg, #111 0 3px, #fff 3px 9px);
  border-radius: 3px;
  margin-top: 8px;
`;

const HeaderRow = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 10px;
  flex-wrap: wrap; /* evita que o badge force overflow */
`;

const Small = styled.div`
  font-size: 12px; color: #475569;
`;

const BigTracking = styled.div`
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 1.5px;
  margin-top: 6px;
  color: #0b1220;
  line-height: 1.1;
  overflow-wrap: anywhere; /* quebra códigos longos dentro da caixa */
`;

const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 10px;
  align-items:start;
`;

const Box = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #e6eef6;
  max-width: 100%;
  box-sizing: border-box;
`;

const QRBox = styled.div`
  width: 96px; height: 96px; background: linear-gradient(45deg,#fff,#f3f4f6); border: 1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; color:#64748b; font-size:10px; border-radius:6px;
`;

const Badge = styled.span`
  display:inline-block; padding:4px 8px; border-radius:6px; font-weight:800; font-size:12px; background:#fef3c7; color:#92400e; border:1px solid #fde68a;
`;

function formatEndereco({ address, number, complete, neighborhood, city, state }) {
  let parts = [];
  if (address) parts.push(address);
  if (number) parts.push(number);
  if (complete) parts.push(complete);
  if (neighborhood) parts.push(neighborhood);
  let line1 = parts.join(', ');
  let line2 = [];
  if (city) line2.push(city);
  if (state) line2.push(state);
  return [line1, line2.join(' / ')].filter(Boolean).join(' - ');
}

const DemoShippingLabel = React.forwardRef(({ 
  destinatario = 'João da Silva',
  pedido = '#123456',
  cep = '01000-000',
  address, number, complete, neighborhood, city, state,
  userId
}, ref) => {
  const enderecoCompleto = formatEndereco({ address, number, complete, neighborhood, city, state });
  const tracking = `TRK${String(pedido).replace(/[^0-9]/g,'').padStart(9,'0')}`;
  return (
    <DemoLabel ref={ref}>
      <HeaderRow>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>Etiqueta de Envio (DEMO)</div>
          <Small>Remetente: Loja Exemplo Ltda • São Paulo - SP</Small>
        </div>
        <Badge>PAC - Simulado</Badge>
      </HeaderRow>

      <TwoCols>
        <div>
          <div style={{ fontWeight: 700 }}>Destinatário</div>
          <div style={{ marginTop: 4 }}>{destinatario}</div>
          <Small style={{ marginTop: 6 }}>ID Assinante: <b>{userId || '-'}</b></Small>
          <div style={{ marginTop: 8 }}><b>Endereço:</b> {enderecoCompleto || 'Endereço não informado'}</div>
          <div style={{ marginTop: 6 }}><b>CEP:</b> {cep}</div>
          <div style={{ marginTop: 8 }}><b>Pedido:</b> {pedido}</div>
        </div>
        <div>
          <Box>
            <Small>Rastreamento</Small>
            <BigTracking>{tracking}</BigTracking>
            <Small style={{ marginTop: 6 }}>Status: <b>Pré-visualização</b></Small>
          </Box>
        </div>
      </TwoCols>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Barcode />
          <div style={{ marginTop: 6, color: '#475569', fontSize: 12 }}>Objeto registrado - Simulação</div>
        </div>
        <QRBox>QR</QRBox>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Small>Dimensões: 20 × 15 × 8 cm</Small>
        <Small>Peso: 0,350 kg</Small>
      </div>

      <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>Esta é uma etiqueta de demonstração. Não imprima para envio real.</div>
    </DemoLabel>
  );
});

export default DemoShippingLabel;
