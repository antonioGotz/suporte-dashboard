import React from 'react';
import styled from 'styled-components';
import breakpoints from '../../styles/breakpoints';

const Button = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001; /* Acima do Canvas (que é 1000) */
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: rgba(29, 44, 47, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0;
  transition: background 0.2s ease, transform 0.1s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(29, 44, 47, 1);
  }

  &:active {
    transform: scale(0.95);
  }

  /* Apenas visível em mobile */
  @media (min-width: ${breakpoints.mobile}px) {
    display: none;
  }

  /* Acessibilidade */
  &:focus-visible {
    outline: 2px solid rgba(56, 178, 172, 0.6);
    outline-offset: 2px;
  }
`;

const Line = styled.span`
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text-light);
  border-radius: 2px;
  transition: transform 0.3s cubic-bezier(0.4, 1.4, 0.6, 1),
              opacity 0.3s ease,
              transform-origin 0.3s ease;
  transform-origin: center;

  /* Primeira linha: rotaciona para formar X */
  &:nth-child(1) {
    transform: ${props => props.isOpen 
      ? 'translateY(8px) rotate(45deg)' 
      : 'translateY(0) rotate(0deg)'};
  }

  /* Segunda linha: desaparece */
  &:nth-child(2) {
    opacity: ${props => props.isOpen ? 0 : 1};
    transform: ${props => props.isOpen ? 'scaleX(0)' : 'scaleX(1)'};
  }

  /* Terceira linha: rotaciona para formar X */
  &:nth-child(3) {
    transform: ${props => props.isOpen 
      ? 'translateY(-8px) rotate(-45deg)' 
      : 'translateY(0) rotate(0deg)'};
  }
`;

/**
 * Botão hambúrguer para abrir/fechar menu mobile
 * 
 * @param {boolean} isOpen - Estado se o menu está aberto
 * @param {function} onClick - Função chamada ao clicar
 */
const HamburgerButton = ({ isOpen, onClick }) => {
  return (
    <Button
      onClick={onClick}
      aria-label="Menu"
      aria-expanded={isOpen}
      type="button"
    >
      <Line isOpen={isOpen} />
      <Line isOpen={isOpen} />
      <Line isOpen={isOpen} />
    </Button>
  );
};

export default HamburgerButton;

