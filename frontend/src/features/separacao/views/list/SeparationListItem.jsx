import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import { classifySLA, normalizeProductName } from '../separation.utils.js';
import * as S from './SeparationList.styles.js';
import { useDropdownMenu } from '../../../../hooks/useDropdownMenu.js';
import { PrinterIcon } from '../../../../components/icons/PrinterIcon.jsx';

export default function SeparationListItem({
  item,
  statusPipeline,
  stageByCode,
  recentActions,
  labelLocked,
  updatingIds,
  onGenerateLabel,
  onSetStatus,
  index = 0,
}) {
  const navigate = useNavigate();
  const { 
    isMenuOpen, 
    menuItemRefs, 
    activeButtonRef, 
    handleMenuToggle, 
    handleKeyDown, 
    closeMenu 
  } = useDropdownMenu();
  const [menuDirection, setMenuDirection] = React.useState('up');

  const stage = item.status_code ? stageByCode[item.status_code] : undefined;
  const sla = classifySLA(item.next_shipment_date);
  const isUpdating = Boolean(updatingIds[item.order_id]);
  const motherShort = String(item.mother_name || '').split(' ').slice(0, 2).join(' ');
  const babyLabel = (item.baby_name || 'Bebê não informado').split(' ').slice(0, 2).join(' ');
  const rawProduct = item.product_to_send?.name || item.brinquedo?.name || item.product?.name || item.product_name || 'Produto não mapeado';
  const productDisplay = normalizeProductName(rawProduct);

  const isLabelGenerated = labelLocked[item.order_id] || item.label_generated;
  const normalizedStatusCode = String(item.status_code || '').toLowerCase();
  const stageAllowsLabel = stage?.statusCode === 'shipped'
    || stage?.key === 'shipped'
    || normalizedStatusCode === 'shipped';
  const canGenerateLabel = stageAllowsLabel && !isLabelGenerated;
  const printIntent = canGenerateLabel ? 'ready' : (isLabelGenerated ? 'available' : 'default');

  const handlePrintClick = () => {
    if (isLabelGenerated) {
      navigate(`/shipping/labels?order_id=${item.order_id}`);
    } else if (canGenerateLabel) {
      onGenerateLabel?.(item.order_id);
    }
  };

  const getPrintButtonTitle = () => {
    if (isUpdating) return 'Processando...';
    if (isLabelGenerated) return 'Ver etiqueta gerada';
    if (canGenerateLabel) return 'Gerar etiqueta';
    return 'Aguardando status "Enviado"';
  };

  const slaText = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
      const d = new Date(String(item.next_shipment_date || '') + 'T00:00:00');
      const diff = Math.ceil((d - today) / (24 * 60 * 60 * 1000));
      if (Number.isNaN(diff)) return '';
      if (diff < 0) return 'Prazo encerrado';
      if (diff === 0) return 'Envia hoje';
      if (diff === 1) return 'Resta 1 dia';
      return `Restam ${diff} dias`;
    } catch {
      return '';
    }
  })();

  const onToggleWithDirection = () => {
    try {
      const el = activeButtonRef?.current;
      if (el && typeof window !== 'undefined') {
        const rect = el.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setMenuDirection(spaceBelow >= 260 || spaceBelow >= spaceAbove ? 'down' : 'up');
      }
    } catch {}
    handleMenuToggle();
  };

  return (
    <S.Tr $delay={0.08 * (index + 1)}>
      <S.Td>
        <S.SubscriberName title={item.mother_name} to={`/assinantes/${item.subscriber_id || item.user_id || item.id}`}>{motherShort}</S.SubscriberName>
      </S.Td>
      <S.Td>
        <S.SmallMuted>
          <S.BabyName title={babyLabel} to={`/assinantes/${item.subscriber_id || item.user_id || item.id}`}>{babyLabel}</S.BabyName>
        </S.SmallMuted>
      </S.Td>
      <S.TdCenter>
        <S.OrderId>#{item.order_id}</S.OrderId>
        <S.PlanName>{item.plan_name || ''}</S.PlanName>
      </S.TdCenter>
      <S.TdCenterWrap>
        <S.ProductName title={rawProduct}>{productDisplay}</S.ProductName>
        <S.ProductMeta>{slaText}</S.ProductMeta>
      </S.TdCenterWrap>
      
      <S.ActionsCell>
        <S.MenuContainer>
          <S.MenuButton
              ref={activeButtonRef}
              onClick={onToggleWithDirection}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-label="Definir status"
              title={isUpdating ? 'Ação em andamento' : 'Definir status'}
              disabled={isUpdating}
            >
              {isUpdating ? 'Processando...' : 'Definir'}
            </S.MenuButton>
            
            {/* O botão de impressão só aparece quando o status é 'enviado' */}
            <S.MenuButton
              className="icon-only"
              $intent={printIntent}
              onClick={handlePrintClick}
              disabled={isUpdating || (!canGenerateLabel && !isLabelGenerated)}
              title={getPrintButtonTitle()}
            >
              <PrinterIcon size={16} />
            </S.MenuButton>
        </S.MenuContainer>

        {isMenuOpen && (
          <S.MenuList
            $isOpen={isMenuOpen}
            $direction={menuDirection}
            role="menu"
            onKeyDown={handleKeyDown}
          >
            {statusPipeline.filter((s) => !('isFallback' in s)).map((s, i) => (
              <S.MenuItem
                as="button"
                key={s.statusCode}
                role="menuitem"
                tabIndex={0}
                ref={(el) => { menuItemRefs.current[i] = el; }}
                onClick={async () => {
                  closeMenu();
                  await onSetStatus?.(item.order_id, s.statusCode);
                }}
              >
                {s.statusLabel}
              </S.MenuItem>
            ))}
            {isLabelGenerated && (
              <S.MenuItem as={S.MenuLink} to={`/shipping/labels?order_id=${item.order_id}`} onClick={closeMenu}>
                Ver histórico de etiquetas
              </S.MenuItem>
            )}
          </S.MenuList>
        )}
      </S.ActionsCell>

      <S.TdCenter>
        <S.StatusBlock align="flex-start">
          <StatusBadge size="compact" statusCode={item.status_code} label={stage ? stage.statusLabel : (item.status || 'Não definido')} />
          <S.SlaRow>
            <S.Dot intent={sla.intent} />
            <S.SlaText>{slaText || sla?.label}</S.SlaText>
          </S.SlaRow>
        </S.StatusBlock>
        {recentActions && (
          <S.SmallMuted>Recente</S.SmallMuted>
        )}
      </S.TdCenter>
      
      <S.TdCenter>
         <S.SlaRow>
            <S.Dot intent={sla.intent} />
            <S.SlaText>{slaText || sla.label}</S.SlaText>
          </S.SlaRow>
      </S.TdCenter>
    </S.Tr>
  );
}
