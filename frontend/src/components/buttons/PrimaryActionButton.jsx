import styled from 'styled-components'

const PrimaryActionButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(34,197,94,.45);
  background: rgba(34,197,94,.12);
  color: #d1fae5;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: .02em;
  cursor: pointer;
  &:hover { background: rgba(34,197,94,.18); border-color: rgba(34,197,94,.55); }
  &:disabled { opacity: .55; cursor: not-allowed; }
`;

export default PrimaryActionButton;

