import React from 'react';
import { Link } from 'react-router-dom';
import * as S from './AssinantesPage.styles';
import { formatDate, formatName, resolveEmail } from './AssinantesPage.utils';

/**
 * Componente de linha da tabela para desktop
 * Mantém a estrutura e funcionalidade do arquivo original
 */
const AssinanteTableRow = ({ 
  assinante, 
  activeFilter,
  rowLoading = {},
  onView,
  onSuspend,
  onCancel,
  onReactivate,
  onDelete,
  onCreateOrder,
  renderStatusBadge,
  formatSubscriptionDate,
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

  // Para solicitações, renderizar tabela simplificada
  if (activeFilter === 'solicitacoes') {
    return (
      <S.TableRow>
        <S.TableCell>
          <Link
            to={`/assinantes/${assinanteId}`}
            style={{
              color: 'var(--color-text, #f8fafc)',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <span title={assinante.user_name || '—'}>{nome}</span>
          </Link>
          {email && (
            <>
              <br />
              <small style={{ color: 'var(--muted)' }}>{email}</small>
            </>
          )}
        </S.TableCell>
        <S.TableCell>
          {formatSubscriptionDate ? formatSubscriptionDate(assinante.subscription_date) : formatDate(assinante.subscription_date)}
        </S.TableCell>
        <S.TableCell>
          {/* Ações serão renderizadas pelo componente pai usando ActionButtons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {onView && (
              <S.EditButton onClick={() => onView(assinanteId)}>
                Ver
              </S.EditButton>
            )}
            {showApprove && onCreateOrder && (
              <S.EditButton 
                onClick={() => onCreateOrder(assinante.user_id ?? assinante.id, assinante.products_id)}
                disabled={!!rowLoading[reqKey]?.approve}
                style={{ 
                  background: 'rgba(34, 197, 94, 0.2)',
                  borderColor: 'rgba(34, 197, 94, 0.3)'
                }}
              >
                {rowLoading[reqKey]?.approve ? 'Criando...' : 'Criar'}
              </S.EditButton>
            )}
            {showDelete && onDelete && (
              <S.EditButton 
                onClick={() => onDelete(assinante.user_id ?? assinante.id)}
                disabled={!!rowLoading[reqKey]?.delete}
                style={{ 
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
              >
                {rowLoading[reqKey]?.delete ? 'Excluindo...' : 'Excluir'}
              </S.EditButton>
            )}
          </div>
        </S.TableCell>
      </S.TableRow>
    );
  }

  // Para assinantes normais, renderizar tabela completa
  return (
    <S.TableRow>
      <S.TableCell>
        <Link
          to={`/assinantes/${assinanteId}`}
          style={{
            color: 'var(--color-text, #f8fafc)',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <span title={assinante.user_name || '—'}>{nome}</span>
        </Link>
        {email && (
          <>
            <br />
            <small style={{ color: 'var(--muted)' }}>{email}</small>
          </>
        )}
      </S.TableCell>
      <S.TableCell>{assinante.plan_name || '—'}</S.TableCell>
      <S.TableCell>
        {formatSubscriptionDate ? formatSubscriptionDate(assinante.subscription_date) : formatDate(assinante.subscription_date)}
      </S.TableCell>
      <S.TableCell>
        {renderStatusBadge ? renderStatusBadge(code, assinante.status_label) : (assinante.status_label || code || '—')}
      </S.TableCell>
      <S.TableCell>
        {/* Ações serão renderizadas pelo componente pai usando ActionButtons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {onView && (
            <S.EditButton onClick={() => onView(assinanteId)}>
              Ver
            </S.EditButton>
          )}
          {showSuspend && onSuspend && (
            <S.EditButton 
              onClick={() => onSuspend(assinante.order_id)}
              disabled={!!rowLoading[assinante.order_id]?.suspend}
              style={{ 
                background: 'rgba(251, 191, 36, 0.2)',
                borderColor: 'rgba(251, 191, 36, 0.3)'
              }}
            >
              {rowLoading[assinante.order_id]?.suspend ? 'Suspendo...' : 'Suspender'}
            </S.EditButton>
          )}
          {showReactivate && onReactivate && (
            <S.EditButton 
              onClick={() => onReactivate(assinante.order_id)}
              disabled={!!rowLoading[assinante.order_id]?.reactivate}
              style={{ 
                background: 'rgba(34, 197, 94, 0.2)',
                borderColor: 'rgba(34, 197, 94, 0.3)'
              }}
            >
              {rowLoading[assinante.order_id]?.reactivate ? 'Reativando...' : (showApprove ? 'Aprovar' : 'Reativar')}
            </S.EditButton>
          )}
          {showCancel && onCancel && (
            <S.EditButton 
              onClick={() => onCancel(assinante.order_id)}
              disabled={!!rowLoading[assinante.order_id]?.cancel}
              style={{ 
                background: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            >
              {rowLoading[assinante.order_id]?.cancel ? 'Cancelando...' : 'Cancelar'}
            </S.EditButton>
          )}
        </div>
      </S.TableCell>
    </S.TableRow>
  );
};

export default AssinanteTableRow;

