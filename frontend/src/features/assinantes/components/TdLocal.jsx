import styled from 'styled-components';

const TdLocal = styled.td`
  position: relative;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  font-size: 0.95rem;
  line-height: 1.45;
  vertical-align: middle;
  transition: background 0.18s ease, border-color 0.18s ease;

  &.acoes {
    text-align: center;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

export default TdLocal;
