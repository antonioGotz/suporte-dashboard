import styled from 'styled-components';
import breakpoints from '../../../../styles/breakpoints';

// Container principal
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
  color: var(--color-text-light, #f8fafc);
`;

export const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #e74c3c;
`;

// Header
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-light, #f8fafc);
  margin: 0;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    font-size: 24px;
    text-align: center;
  }
`;

export const Subtitle = styled.p`
  color: var(--muted, #94a3b8);
  margin: 4px 0 0;
  font-size: 14px;
`;

export const AddButton = styled.a`
  background-color: #9dd9d2;
  color: #1a202c;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &:hover {
    background-color: #86c7bf;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${breakpoints.mobile - 1}px) {
    width: 100%;
    justify-content: center;
    padding: 14px;
  }
`;

// Toolbar
export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SortContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const SortButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  background-color: ${({ $active }) => ($active ? '#9dd9d2' : '#2d3748')};
  color: ${({ $active }) => ($active ? '#1a202c' : '#a0aec0')};
  border: 1px solid #4a5568;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #9dd9d2;
    color: #fff;
  }

  @media (max-width: ${breakpoints.mobile - 1}px) {
    flex: 1;
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    display: none; /* Esconder toggle em mobile - sempre cards */
  }
`;

export const ViewButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  background-color: ${({ $active }) => ($active ? '#9dd9d2' : '#2d3748')};
  color: ${({ $active }) => ($active ? '#1a202c' : '#a0aec0')};
  border: 1px solid #4a5568;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #9dd9d2;
    color: #fff;
  }
`;

// Desktop views
export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    display: none;
  }
`;

export const ListContainer = styled.div`
  background-color: #2d3748;
  border-radius: 15px;
  overflow: hidden;

  @media (max-width: ${breakpoints.mobile - 1}px) {
    display: none;
  }
`;

// Mobile Cards
export const CardsContainer = styled.div`
  display: none; /* Escondido por padrão (desktop) */

  @media (max-width: ${breakpoints.mobile - 1}px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-light, #f8fafc);
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

export const CardValueHighlight = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #27ae60;
`;

export const CardFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 12px;
`;

export const CardEditButton = styled.button`
  flex: 1;
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

export const CardDeleteButton = styled.button`
  flex: 1;
  padding: 12px;
  background: rgba(239, 68, 68, 0.2);
  color: var(--color-text-light, #f8fafc);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
    background: rgba(239, 68, 68, 0.3);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--muted, #94a3b8);
  font-size: 16px;
`;
