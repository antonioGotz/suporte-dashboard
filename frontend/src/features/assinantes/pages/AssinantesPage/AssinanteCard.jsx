import React from 'react';
import { Link } from 'react-router-dom';
import * as S from './AssinantesPage.styles';
import { formatDate, formatName, resolveEmail } from './AssinantesPage.utils';

/**
 * Componente de card para exibição mobile
 * @param {object} assinante - Dados do assinante
 * @param {function} onEdit - Função chamada ao clicar em editar
 * @param {string} activeFilter - Filtro ativo ('todos', 'aprovados', etc)
 * @param {object} rowLoading - Estado de loading por ação
 * @param {function} onView - Função para ver detalhes
 * @param {function} onSuspend - Função para suspender (se disponível)
 * @param {function} onCancel - Função para cancelar (se disponível)
 * @param {function} onReactivate - Função para reativar (se disponível)
 * @param {function} onDelete - Função para deletar (se disponível)
 * @param {function} onCreateOrder - Função para criar assinatura (se disponível)
 */
const AssinanteCard = ({ 
  assinante, 
  onEdit,
  activeFilter,
  rowLoading = {},
  onView,
  onSuspend,
  onCancel,
  onReactivate,
  onDelete,
  onCreateOrder,
}) => {
  const email = resolveEmail(assinante);
  const nome = formatName(assinante.user_name || assinante.name || '—');
  const code = (assinante.status_code || '').toLowerCase();
  const isPending = code === 'pending' || (!code && (assinante.gateway_status || '').toLowerCase() === 'pendente');
  const isActive = code === 'active';
  const isSuspended = code === 'suspended';
  const isCanceled = code === 'canceled';
  
  // Determinar quais ações mostrar baseado no filtro
  let showSuspend = false, showReactivate = false, showCancel = false, showApprove = false, showDelete = false;
  
  if (activeFilter === 'solicitacoes') {
    showApprove = true;
    showDelete = true;
  } else if (activeFilter === 'suspensos') {
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

  const assinanteId = assinante.order_id ?? assinante.user_id ?? assinante.id;
  const reqKey = `req_${assinante.user_id ?? assinante.id}`;

  return (
    <S.Card>
      <S.CardHeader>
        <S.CardAvatar>
          <S.CardAvatarPlaceholder>
            {nome.charAt(0).toUpperCase()}
          </S.CardAvatarPlaceholder>
        </S.CardAvatar>
        <S.CardName>{nome}</S.CardName>
      </S.CardHeader>

      <S.CardBody>
        {email && (
          <S.CardRow>
            <S.CardLabel>Email:</S.CardLabel>
            <S.CardValue>{email}</S.CardValue>
          </S.CardRow>
        )}

        <S.CardRow>
          <S.CardLabel>Plano:</S.CardLabel>
          <S.CardValue>{assinante.plan_name || '—'}</S.CardValue>
        </S.CardRow>

        <S.CardRow>
          <S.CardLabel>Data da Assinatura:</S.CardLabel>
          <S.CardValue>{formatDate(assinante.subscription_date) || '—'}</S.CardValue>
        </S.CardRow>

        {activeFilter !== 'solicitacoes' && (
          <S.CardRow>
            <S.CardLabel>Status:</S.CardLabel>
            <S.CardValue>{assinante.status_label || code || '—'}</S.CardValue>
          </S.CardRow>
        )}
      </S.CardBody>

      <S.CardFooter>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {onView && (
            <S.CardEditButton 
              onClick={() => onView(assinanteId)}
              style={{ marginBottom: '4px' }}
            >
              Ver Detalhes
            </S.CardEditButton>
          )}
          
          {activeFilter === 'solicitacoes' ? (
            <>
              {showApprove && onCreateOrder && (
                <S.CardEditButton 
                  onClick={() => onCreateOrder(assinante.user_id ?? assinante.id, assinante.products_id)}
                  disabled={!!rowLoading[reqKey]?.approve}
                  style={{ 
                    background: 'rgba(34, 197, 94, 0.2)',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    marginBottom: '4px'
                  }}
                >
                  {rowLoading[reqKey]?.approve ? 'Criando...' : 'Criar Assinatura'}
                </S.CardEditButton>
              )}
              {showDelete && onDelete && (
                <S.CardEditButton 
                  onClick={() => onDelete(assinante.user_id ?? assinante.id)}
                  disabled={!!rowLoading[reqKey]?.delete}
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderColor: 'rgba(239, 68, 68, 0.3)'
                  }}
                >
                  {rowLoading[reqKey]?.delete ? 'Excluindo...' : 'Excluir'}
                </S.CardEditButton>
              )}
            </>
          ) : (
            <>
              {showSuspend && onSuspend && (
                <S.CardEditButton 
                  onClick={() => onSuspend(assinante.order_id)}
                  disabled={!!rowLoading[assinante.order_id]?.suspend}
                  style={{ 
                    background: 'rgba(251, 191, 36, 0.2)',
                    borderColor: 'rgba(251, 191, 36, 0.3)',
                    marginBottom: '4px'
                  }}
                >
                  {rowLoading[assinante.order_id]?.suspend ? 'Suspendo...' : 'Suspender'}
                </S.CardEditButton>
              )}
              {showReactivate && onReactivate && (
                <S.CardEditButton 
                  onClick={() => onReactivate(assinante.order_id)}
                  disabled={!!rowLoading[assinante.order_id]?.reactivate}
                  style={{ 
                    background: 'rgba(34, 197, 94, 0.2)',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    marginBottom: '4px'
                  }}
                >
                  {rowLoading[assinante.order_id]?.reactivate ? 'Reativando...' : (showApprove ? 'Aprovar' : 'Reativar')}
                </S.CardEditButton>
              )}
              {showCancel && onCancel && (
                <S.CardEditButton 
                  onClick={() => onCancel(assinante.order_id)}
                  disabled={!!rowLoading[assinante.order_id]?.cancel}
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderColor: 'rgba(239, 68, 68, 0.3)'
                  }}
                >
                  {rowLoading[assinante.order_id]?.cancel ? 'Cancelando...' : 'Cancelar'}
                </S.CardEditButton>
              )}
            </>
          )}
        </div>
      </S.CardFooter>
    </S.Card>
  );
};

export default AssinanteCard;

