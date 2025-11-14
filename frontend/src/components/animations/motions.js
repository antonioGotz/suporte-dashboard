import { keyframes } from 'styled-components';

export const fadeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;
