import styled from 'styled-components';
import breakpoints from '../../../../styles/breakpoints';

// ========== CONTAINER PRINCIPAL ==========
export const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    padding: 16px;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #666;
`;

export const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #e74c3c;
`;

// ========== HEADER ==========
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const HeaderContent = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-light, #f8fafc);
  margin: 0;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  color: var(--muted, #94a3b8);
  margin: 4px 0 0;
  font-size: 14px;
`;

export const HeaderActions = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;

  /* Igualar larguras em desktop */
  > div, > button {
    width: 220px;
  }

  @media (max-width: ${breakpoints.mobile - 1}px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    > div, > button { width: 100%; }
  }
`;

// ========== BUSCA ==========
export const SearchContainer = styled.div`
  margin-bottom: 24px;
`;

// ========== TABELA DESKTOP ==========
export const TableContainer = styled.div`
  background: var(--color-sidebar-bg, #1e293b);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: linear-gradient(135deg, rgba(56, 178, 172, 0.2) 0%, rgba(56, 178, 172, 0.1) 100%);
`;

export const TableBody = styled.tbody`
  background: var(--color-sidebar-bg, #1e293b);
`;

export const TableRow = styled.tr`
  transition: background 0.18s ease;

  &:nth-child(even) td {
    background-color: rgba(148, 163, 184, 0.03);
  }

  @media (hover: hover) {
    &:hover td {
      background-color: rgba(56, 178, 172, 0.1);
      border-color: rgba(56, 178, 172, 0.28);
    }
  }
`;

export const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text-light, #f8fafc);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: var(--color-text-light, #f8fafc);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(56, 178, 172, 0.3) 0%, rgba(56, 178, 172, 0.2) 100%);
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(56, 178, 172, 0.4) 0%, rgba(56, 178, 172, 0.3) 100%);
  color: var(--color-text-light, #f8fafc);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
`;

export const EditButton = styled.button`
  padding: 8px 16px;
  background: rgba(56, 178, 172, 0.2);
  color: var(--color-text-light, #f8fafc);
  border: 1px solid rgba(56, 178, 172, 0.3);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(56, 178, 172, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ========== CARDS MOBILE ==========
export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: ${breakpoints.mobile}px) {
    display: none;
  }
`;

export const Card = styled.div`
  background: var(--color-sidebar-bg, #1e293b);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:active {
    transform: scale(0.98);
  }
`;

export const CardHeader = styled.div`
  background: linear-gradient(135deg, rgba(56, 178, 172, 0.2) 0%, rgba(56, 178, 172, 0.1) 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CardAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(56, 178, 172, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, rgba(56, 178, 172, 0.3) 0%, rgba(56, 178, 172, 0.2) 100%);
`;

export const CardAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CardAvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(56, 178, 172, 0.4) 0%, rgba(56, 178, 172, 0.3) 100%);
  color: var(--color-text-light, #f8fafc);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
`;

export const CardName = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-light, #f8fafc);
  text-align: center;
`;

export const CardBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CardLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--muted, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CardValue = styled.span`
  font-size: 15px;
  color: var(--color-text-light, #f8fafc);
  word-break: break-word;
`;

export const CardFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
`;

export const CardEditButton = styled.button`
  width: 100%;
  padding: 12px;
  background: rgba(56, 178, 172, 0.2);
  color: var(--color-text-light, #f8fafc);
  border: 1px solid rgba(56, 178, 172, 0.3);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
    background: rgba(56, 178, 172, 0.3);
  }
`;

// ========== PAGINAÇÃO ==========
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    gap: 12px;
  }
`;

export const PaginationButton = styled.button`
  padding: 10px 20px;
  background: var(--color-sidebar-bg, #1e293b);
  border: 2px solid rgba(56, 178, 172, 0.3);
  color: var(--color-text-light, #f8fafc);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(56, 178, 172, 0.2);
    border-color: rgba(56, 178, 172, 0.5);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile - 1}px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

export const PageInfo = styled.span`
  font-size: 14px;
  color: var(--color-text-light, #f8fafc);
  font-weight: 500;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    font-size: 13px;
  }
`;

