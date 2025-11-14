import styled from 'styled-components';

const Badge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1;
  letter-spacing: 0.02em;
  background: var(--success, #10b981);
  color: var(--on-success, #0b1220);
`;

export default function ActiveBadge({ children }) {
  return <Badge>{children}</Badge>;
}
