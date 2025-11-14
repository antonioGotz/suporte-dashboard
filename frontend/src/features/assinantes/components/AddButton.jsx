import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AddButton = styled(Link)`
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--color-primary);
  color: var(--color-bg-dark);
  font-weight: 600;
  cursor: pointer;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &:hover {
    filter: brightness(1.05);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--accent-d);
  }
`;
export default AddButton;
