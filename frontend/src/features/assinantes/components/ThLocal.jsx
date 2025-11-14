import styled from 'styled-components';

const ThLocal = styled.th`
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--muted);
  user-select: none;

  &.acoes {
    text-align: center;
  }

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 0.82rem;
  }
`;

export default ThLocal;
