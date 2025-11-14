import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  getDemoSubscriberById,
  subscribeDemoSubscribers,
  getStatusLabel,
} from '../demoSubscribersStore.js';

const STATUS_THEME = {
  active: {
    background: 'linear-gradient(135deg, rgba(34,197,94,0.32), rgba(22,163,74,0.22))',
    border: 'rgba(74,222,128,0.45)',
    color: '#bbf7d0',
  },
  pending: {
    background: 'linear-gradient(135deg, rgba(56,189,248,0.28), rgba(14,165,233,0.18))',
    border: 'rgba(125,211,252,0.45)',
    color: '#e0f2fe',
  },
  suspended: {
    background: 'linear-gradient(135deg, rgba(249,115,22,0.28), rgba(194,65,12,0.2))',
    border: 'rgba(251,146,60,0.45)',
    color: '#ffedd5',
  },
  cancelled: {
    background: 'linear-gradient(135deg, rgba(244,63,94,0.32), rgba(190,18,60,0.22))',
    border: 'rgba(248,113,113,0.5)',
    color: '#ffe4e6',
  },
};

const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(1000px 600px at 50% 0%, rgba(56,178,172,0.08), rgba(8,15,35,0.95));
  color: #e2e8f0;
  padding: 40px 16px 60px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 960px;
  background: rgba(15,23,42,0.82);
  border-radius: 26px;
  padding: 36px;
  border: 1px solid rgba(148,163,184,0.22);
  box-shadow: 0 24px 60px rgba(2,8,23,0.45);
  backdrop-filter: blur(12px);
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 1.9rem;
  margin: 0;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8rem;
  background: ${({ $status }) => STATUS_THEME[$status]?.background || 'rgba(148,163,184,0.25)'};
  border: 1px solid ${({ $status }) => STATUS_THEME[$status]?.border || 'rgba(148,163,184,0.3)'};
  color: ${({ $status }) => STATUS_THEME[$status]?.color || '#e2e8f0'};
`;

const Section = styled.section`
  margin-top: 28px;
  background: rgba(15,23,42,0.72);
  border-radius: 18px;
  border: 1px solid rgba(148,163,184,0.16);
  padding: 22px 24px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 1.2rem;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: rgba(226,232,240,0.9);
`;

const ALERT_THEME = {
  warning: {
    background: 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(217,119,6,0.12))',
    border: 'rgba(251,191,36,0.45)',
    color: '#fef3c7',
  },
  danger: {
    background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.14))',
    border: 'rgba(248,113,113,0.45)',
    color: '#fee2e2',
  },
};

const Alert = styled.div`
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${({ $tone }) => ALERT_THEME[$tone]?.background || 'rgba(148,163,184,0.18)'};
  border: 1px solid ${({ $tone }) => ALERT_THEME[$tone]?.border || 'rgba(148,163,184,0.28)'};
  color: ${({ $tone }) => ALERT_THEME[$tone]?.color || '#e2e8f0'};
  font-weight: 600;
`;

const PendingBox = styled.div`
  margin-top: 20px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(56,189,248,0.12);
  border: 1px solid rgba(56,189,248,0.2);
  color: #e0f2fe;
`;

const DemoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(148,163,184,0.18);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #cbd5f5;
  font-weight: 700;
`;

export default function DemoSubscriberProfilePage() {
  const { id } = useParams();
  const [subscriber, setSubscriber] = useState(() => getDemoSubscriberById(id));

  useEffect(() => {
    const unsub = subscribeDemoSubscribers(() => {
      setSubscriber(getDemoSubscriberById(id));
    });
    return () => unsub();
  }, [id]);

  if (!subscriber) {
    return (
      <Page>
        <Card>
          <Title>Assinante demo não encontrado</Title>
          <p>Verifique se o link está correto ou solicite um novo link ao time Evolua.</p>
        </Card>
      </Page>
    );
  }

  const status = subscriber.status;
  const statusLabel = getStatusLabel(status);

  return (
    <Page>
      <Card>
        <DemoBadge>Ambiente demonstrativo</DemoBadge>
        <Header>
          <Title>Olá, {subscriber.name || 'assinante Evolua'}!</Title>
          <StatusPill $status={status}>{statusLabel}</StatusPill>
          {subscriber.planLabel && (
            <div style={{ color: '#94a3b8' }}>Plano contratado: <strong>{subscriber.planLabel}</strong></div>
          )}
        </Header>

        {status === 'pending' && (
          <PendingBox>
            Seu acesso está em revisão. Assim que o time Evolua aprovar, você receberá um e-mail com as próximas orientações.
          </PendingBox>
        )}

        {status === 'suspended' && (
          <Alert $tone="warning">
            A sua assinatura está temporariamente suspensa. Entre em contato com nosso suporte para regularizar a situação e reativar o acesso.
          </Alert>
        )}

        {status === 'cancelled' && (
          <Alert $tone="danger">
            Esta assinatura foi cancelada. Caso deseje retomar com a Evolua, fale conosco para avaliarmos um novo início.
          </Alert>
        )}

        {(status === 'active' || status === 'suspended') && (
          <Section>
            <SectionTitle>Próximos brinquedos do kit</SectionTitle>
            <List>
              {subscriber.toys?.map((toy) => (
                <li key={toy}>{toy}</li>
              )) || <li>Kit introdutório em preparação.</li>}
            </List>
          </Section>
        )}

        {status === 'active' && (
          <Section>
            <SectionTitle>Vídeos exclusivos</SectionTitle>
            <List>
              {subscriber.videos?.map((video) => (
                <li key={video}>{video}</li>
              )) || <li>Conteúdo em produção.</li>}
            </List>
          </Section>
        )}

        <Section>
          <SectionTitle>Histórico desta assinatura</SectionTitle>
          <List>
            {subscriber.history?.slice().reverse().map((entry) => (
              <li key={entry.at}>
                <strong>{new Date(entry.at).toLocaleString('pt-BR')}:</strong> {entry.description}
              </li>
            ))}
          </List>
        </Section>
      </Card>
    </Page>
  );
}
