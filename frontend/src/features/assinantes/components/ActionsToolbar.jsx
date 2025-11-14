import styled from 'styled-components';
const ActionsToolbar = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;
export default ActionsToolbar;
