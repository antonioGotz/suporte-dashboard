// ARQUIVO: src/components/ConfirmationModal.jsx
// TÍTULO: Modal de Confirmação Reutilizável
// FUNÇÃO: Apresenta um pop-up para confirmar ações críticas (como deletar).

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

// --- ANIMAÇÕES E ESTILOS ---

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContent = styled.div`
  background-color: #2d3748;
  padding: 2rem;
  border-radius: 15px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: ${slideIn} 0.4s ease-out;
  text-align: center;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  color: #f6ad55; /* Laranja de alerta */
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
`;

const ModalMessage = styled.p`
  color: #a0aec0;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 2rem 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CancelButton = styled(Button)`
  background-color: #4a5568;
  color: #fff;
  &:hover { background-color: #718096; }
`;

const ConfirmButton = styled(Button)`
  background-color: #e53e3e; /* Vermelho de perigo */
  color: #fff;
  &:hover { background-color: #c53030; }
`;

// --- LÓGICA DO COMPONENTE ---

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <IconWrapper>
                        <FaExclamationTriangle />
                    </IconWrapper>
                    <ModalTitle>{title}</ModalTitle>
                </ModalHeader>
                <ModalMessage>{message}</ModalMessage>
                <ModalActions>
                    <CancelButton onClick={onClose}>Cancelar</CancelButton>
                    <ConfirmButton onClick={onConfirm}>Confirmar</ConfirmButton>
                </ModalActions>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ConfirmationModal;