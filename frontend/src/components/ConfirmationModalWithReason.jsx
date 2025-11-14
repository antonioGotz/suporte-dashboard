import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideIn = keyframes`from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.7); display: flex;
  justify-content: center; align-items: center; z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;
const ModalContent = styled.div`
  background-color: #2d3748; padding: 2rem; border-radius: 15px;
  width: 450px; max-width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: ${slideIn} 0.4s ease-out; text-align: center;
`;
const ModalHeader = styled.div`
  display: flex; flex-direction: column; align-items: center; margin-bottom: 1rem;
`;
const IconWrapper = styled.div`color: #f6ad55; font-size: 3rem; margin-bottom: 1rem;`;
const ModalTitle = styled.h2`margin: 0; color: #fff; font-size: 1.5rem;`;
const ModalMessage = styled.p`color: #a0aec0; font-size: 1rem; line-height: 1.5; margin: 0;`;
const Field = styled.div`
  margin-top: 1.25rem;
  text-align: left;
`;
const Label = styled.label`
  display: block;
  color: #cbd5e0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;
const Select = styled.select`
  width: 100%;
  background-color: #1a202c;
  border: 1px solid #4a5568;
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus { border-color: #9dd9d2; box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.3); outline: none; }
`;
const TextInput = styled.input`
  width: 100%;
  background-color: #1a202c;
  border: 1px solid ${props => (props.$invalid ? '#f56565' : '#4a5568')};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus { border-color: ${props => (props.$invalid ? '#f56565' : '#9dd9d2')}; box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.3); outline: none; }
`;
const ErrorText = styled.div`
  color: #f56565;
  font-size: 0.85rem;
  margin-top: 0.4rem;
`;
const ModalActions = styled.div`display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;`;
const Button = styled.button`
  border: none; border-radius: 8px; padding: 0.8rem 1.5rem;
  font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  &:hover { transform: translateY(-2px); }
`;
const CancelButton = styled(Button)`
  background-color: #4a5568; color: #fff; &:hover { background-color: #718096; }
`;
const ConfirmButton = styled(Button)`
  background-color: ${props => props.$confirmButtonColor || '#e53e3e'};
  color: #fff;
  &:hover { 
    background-color: ${props => props.$confirmButtonHoverColor || '#c53030'};
  }
`;

const DEFAULT_REASONS = [
  { value: 'pagamento_atrasado', label: 'Pagamento atrasado' },
  { value: 'pedido_do_cliente', label: 'Pedido do cliente' },
  { value: 'problema_no_cartao', label: 'Problema no cartão' },
  { value: 'ajuste_administrativo', label: 'Ajuste administrativo' },
  { value: 'uso_irregular', label: 'Uso irregular' },
  { value: 'outros', label: 'Outros' },
];

const ConfirmationModalWithReason = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirmar',
  confirmButtonColor,
  confirmButtonHoverColor,
  reasons,
  showOtherInputLabel = 'Descreva o motivo',
  requireOtherText = false,
}) => {
  const options = useMemo(() => Array.isArray(reasons) && reasons.length ? reasons : DEFAULT_REASONS, [reasons]);
  const [selected, setSelected] = useState(options[0]?.value || '');
  const [otherText, setOtherText] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setSelected(options[0]?.value || ''); setOtherText(''); }, 200);
    }
  }, [isOpen, options]);

  const effectiveReason = selected === 'outros'
    ? (otherText?.trim() ? `outros: ${otherText.trim()}` : 'outros')
    : selected;

  const handleConfirm = () => { onConfirm(effectiveReason); };
  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) { onClose(); } };

  const isConfirmDisabled = useMemo(() => {
    if (selected !== 'outros') return false;
    if (!requireOtherText) return false;
    return !(otherText && otherText.trim().length > 0);
  }, [selected, otherText, requireOtherText]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <IconWrapper><FaExclamationTriangle /></IconWrapper>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalMessage>{message}</ModalMessage>
        <Field>
          <Label htmlFor="reason-select">Motivo</Label>
          <Select id="reason-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </Field>
        {selected === 'outros' && (
          <Field>
            <Label htmlFor="reason-other">
              {showOtherInputLabel}
              {requireOtherText ? ' (obrigatório)' : ''}
            </Label>
            <TextInput
              id="reason-other"
              placeholder={requireOtherText ? 'Escreva o motivo para confirmar' : 'Especifique o motivo'}
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              $invalid={requireOtherText && (!otherText || !otherText.trim())}
              aria-invalid={requireOtherText && (!otherText || !otherText.trim())}
              aria-describedby={requireOtherText ? 'reason-other-error' : undefined}
            />
            {requireOtherText && (!otherText || !otherText.trim()) && (
              <ErrorText id="reason-other-error">Por favor, descreva o motivo para continuar.</ErrorText>
            )}
          </Field>
        )}
        <ModalActions>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton
            onClick={handleConfirm}
            $confirmButtonColor={confirmButtonColor}
            $confirmButtonHoverColor={confirmButtonHoverColor}
            disabled={isConfirmDisabled}
            title={isConfirmDisabled ? 'Descreva o motivo para confirmar' : undefined}
          >
            {confirmButtonText}
          </ConfirmButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};
export default ConfirmationModalWithReason;
