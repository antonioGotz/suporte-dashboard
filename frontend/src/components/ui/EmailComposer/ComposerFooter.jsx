import React from 'react';
import { FooterBar, ButtonPrimary, ShortcutHint } from './EmailComposer.styles';

const ComposerFooter = ({ onSend = () => {}, isSending = false }) => {
  return (
    <FooterBar>
      <ShortcutHint>Dica: Ctrl/⌘ + Enter para enviar</ShortcutHint>
      <ButtonPrimary onClick={() => onSend && onSend()} disabled={isSending}>
        {isSending ? 'Enviando...' : 'Enviar E-mail'}
      </ButtonPrimary>
    </FooterBar>
  );
};

export default ComposerFooter;
