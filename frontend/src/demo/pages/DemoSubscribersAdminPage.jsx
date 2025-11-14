import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ListPageLayout from '../../layouts/ListPageLayout.jsx';
import PrimaryActionButton from '../../components/buttons/PrimaryActionButton.jsx';
import { Table, TableContainer, Th, Tr, Td } from '../../components/StandardTable.jsx';
import {
  getAllDemoSubscribers,
  subscribeDemoSubscribers,
  getStatusLabel,
} from '../demoSubscribersStore.js';

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ $status }) => {
    if ($status === 'active') return 'rgba(34,197,94,0.18)';
    if ($status === 'pending') return 'rgba(56,189,248,0.18)';
    if ($status === 'suspended') return 'rgba(249,115,22,0.18)';
    if ($status === 'cancelled') return 'rgba(244,63,94,0.18)';
    return 'rgba(148,163,184,0.2)';
  }};
  color: ${({ $status }) => {
    if ($status === 'active') return '#bbf7d0';
    if ($status === 'pending') return '#e0f2fe';
    if ($status === 'suspended') return '#fed7aa';
    if ($status === 'cancelled') return '#fecdd3';
    return '#cbd5f5';
  }};
`;

const ActionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: flex-start;
`;

const SmallButton = styled.button`
  background: rgba(148,163,184,0.14);
  color: #e2e8f0;
  border: 1px solid rgba(148,163,184,0.25);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: rgba(148,163,184,0.22); }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Feedback = styled.div`
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(56,178,172,0.12);
  border: 1px solid rgba(56,178,172,0.25);
  color: #bbf7d0;
  font-weight: 600;
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
`;

const statusOrder = ['pending', 'active', 'suspended', 'cancelled'];

export default function DemoSubscribersAdminPage() {
  const [subscribers, setSubscribers] = useState(() => getAllDemoSubscribers());
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeDemoSubscribers(setSubscribers);
    return () => unsub();
  }, []);

  const sortedList = useMemo(() => {
    return [...subscribers].sort((a, b) => {
      if (a.status === b.status) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });
  }, [subscribers]);

  const copyProfileLink = useCallback((id) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/demo-subscriber/${id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        setFeedback('Link do perfil copiado para a área de transferência.');
        setTimeout(() => setFeedback(''), 4000);
      }).catch(() => {
        setFeedback(link);
        setTimeout(() => setFeedback(''), 6000);
      });
    } else {
      setFeedback(link);
      setTimeout(() => setFeedback(''), 6000);
    }
  }, []);

  return (
    <ListPageLayout
      title="Assinantes Demo"
      description="Gerencie os assinantes criados pelo fluxo demonstrativo."
      transparent
    >
      <HeaderActions>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Use o botão abaixo para abrir o fluxo público de cadastro demo.
        </span>
        <PrimaryActionButton onClick={() => navigate('/demo-signup')}>
          Criar novo cadastro demo
        </PrimaryActionButton>
      </HeaderActions>
      {feedback && <Feedback>{feedback}</Feedback>}
      <TableContainer>
        <Table>
          <thead>
            <Tr>
              <Th>Assinante</Th>
              <Th>Plano</Th>
              <Th>Status</Th>
              <Th>Criado em</Th>
              <Th>Ações</Th>
            </Tr>
          </thead>
          <tbody>
            {sortedList.length === 0 ? (
              <Tr>
                <Td colSpan="5" style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                  Nenhum assinante demo foi criado ainda. Gere um teste pelo fluxo 
                  <a href="/demo-signup" style={{ color: '#9dd9d2', marginLeft: 4 }}>Cadastro Demonstrativo</a>.
                </Td>
              </Tr>
            ) : sortedList.map((subscriber) => {
              const created = new Date(subscriber.createdAt).toLocaleString('pt-BR');
              return (
                <Tr key={subscriber.id}>
                  <Td>
                    <div style={{ fontWeight: 700 }}>{subscriber.name || 'Assinante sem nome'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{subscriber.email}</div>
                  </Td>
                  <Td>{subscriber.planLabel || subscriber.plan}</Td>
                  <Td>
                    <StatusBadge $status={subscriber.status}>{getStatusLabel(subscriber.status)}</StatusBadge>
                  </Td>
                  <Td>{created}</Td>
                  <Td>
                    <ActionRow>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Administre o status pelo painel principal de assinantes.
                      </div>
                      <SmallButton onClick={() => copyProfileLink(subscriber.id)}>
                        Copiar Perfil
                      </SmallButton>
                    </ActionRow>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
    </ListPageLayout>
  );
}
