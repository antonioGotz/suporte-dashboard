import styled from 'styled-components';

const Th = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid var(--border);
`;

const Button = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-weight: 600;
`;

export default function SortableHeader({ children, onClick, onKeyDown, ...thProps }) {
  return (
    <Th {...thProps}>
      <Button onClick={onClick} onKeyDown={onKeyDown}>{children}</Button>
    </Th>
  );
}
