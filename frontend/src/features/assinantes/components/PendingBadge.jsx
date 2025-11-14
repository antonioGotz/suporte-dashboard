import styled from 'styled-components';

const Badge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1;
  letter-spacing: 0.02em;
  background: var(--info, #60a5fa);
  color: var(--on-info, #0b1220);
`;

export default function PendingBadge({ children }) {
  return <Badge>{children}</Badge>;
}
