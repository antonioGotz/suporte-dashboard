import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Ring = styled.span`
  display: inline-block;
  width: ${({ $size }) => $size || 16}px;
  height: ${({ $size }) => $size || 16}px;
  border-radius: 50%;
  border: ${({ $thickness }) => $thickness || 2}px solid rgba(255,255,255,0.35);
  border-top-color: ${({ $color }) => $color || 'var(--color-primary, #9dd9d2)'};
  animation: ${spin} .8s linear infinite;
`;

export default function InlineSpinner({ size = 16, color, thickness = 2, ...rest }) {
  return <Ring role="status" aria-label="Carregando" $size={size} $color={color} $thickness={thickness} {...rest} />;
}

