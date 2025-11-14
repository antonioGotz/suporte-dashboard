import React from 'react';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import { ButtonPrimary, ButtonSecondary, ModalHeader, ModalTitle, ModalActions } from './EmailComposer.styles';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Box = styled.div`
  width: min(960px, 95%);
  max-height: 80vh;
  overflow: auto;
  background: #071024;
  border-radius: 8px;
  padding: 18px;
  color: #e6eef8;
`;


const MessagePreview = ({ html = '', onClose = () => {}, onConfirm = () => {} }) => {
  const safe = DOMPurify.sanitize(html || '');

  return (
    <Overlay>
      <Box>
        <ModalHeader>
          <ModalTitle>Pré-visualização</ModalTitle>
          <div />
        </ModalHeader>
        <div dangerouslySetInnerHTML={{ __html: safe }} />
        <ModalActions style={{ marginTop: 12 }}>
          <ButtonSecondary onClick={onClose}>Fechar</ButtonSecondary>
          <ButtonPrimary onClick={onConfirm}>Confirmar Envio</ButtonPrimary>
        </ModalActions>
      </Box>
    </Overlay>
  );
};

export default MessagePreview;
