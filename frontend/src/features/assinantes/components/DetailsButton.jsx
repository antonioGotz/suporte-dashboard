import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Base = styled(Link)`
  font-weight: 600;
  border-radius: 6px;
  padding: 0.11rem 0.36rem;
  min-width: 62px;
  font-size: 0.68rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  white-space: nowrap;
  border: 2px solid var(--border);
  color: var(--color-bg-dark);
  background-color: var(--color-primary);
  &:hover { border-color: var(--color-primary); transform: translateY(-2px); }
`;

export default Base;

