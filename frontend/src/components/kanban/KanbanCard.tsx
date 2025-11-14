import React, { useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import PrimaryActionButton from "../buttons/PrimaryActionButton";
import { FaRegCalendarAlt, FaChevronLeft, FaChevronRight, FaBullseye, FaHashtag } from "react-icons/fa";
import { Link } from "react-router-dom";

export interface KanbanTag { id: string; label: string; }

export interface KanbanCardProps {
  id: string;
  orderId?: number | string;
  linkId?: number | string;
  title: string;
  titleComplement?: string;
  deadline_start?: string | null;
  deadline_end?: string | null;
  tags?: KanbanTag[];
  assignee?: string;
  isUpdating?: boolean;
  canMoveForward?: boolean;
  canMoveBackward?: boolean;
  onMove?: (direction: "next" | "prev") => void;
  extraActionLabel?: string;
  onExtraAction?: () => void;
  extraActionDisabled?: boolean;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CardReset = styled.div`
  all: unset;
  display: block;
  width: 100%;
`;

// sheen removido conforme solicitação

const Card = styled.article<{ $updating?: boolean }>`
  background: #0f172a;
  color: var(--color-text, #e5e7eb);
  border-radius: 14px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1.5px solid rgba(148,163,184,.22);
  box-shadow: 0 6px 18px rgba(0,0,0,.22);
  width: 100%;
  max-width: 100%;
  min-height: 210px;
  overflow: hidden;
  position: relative;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
  & *, & *::before, & *::after { box-sizing: border-box; min-width: 0; }

  /* Hover: elevação sutil + brilho suave */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0,0,0,.28), 0 2px 10px rgba(99,102,241,.12);
    border-color: rgba(148,163,184,.32);
  }

  /* Sheen removido */

  /* Estado atualizando: borda pulsante sutil */
  ${({ $updating }) => $updating && css`
    border-color: rgba(99,102,241,.45);
    box-shadow: 0 0 0 2px rgba(99,102,241,.12) inset, 0 6px 18px rgba(0,0,0,.22);
  `}
`;

const TitleLink = styled(Link)`
  all: unset;
  display: block;
  cursor: pointer;
  color: inherit !important;
  text-decoration: none !important;
`;

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Subtitle = styled.p`
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: var(--color-muted, #94a3b8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 100%;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 3px 8px;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 9px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-red-danger, #ef4444);
  border: 1px solid var(--color-red-danger, #ef4444);
  background: rgba(239,68,68,.08);
`;

const InnerPanel = styled.div`
  background: rgba(30,41,59,.6);
  border: 1px solid var(--color-border, #2d3b4f);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted, #b6c2cf);
  font-size: 0.82rem;
`;

const RowText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusPill = styled.div<{ $tone?: "ok" | "warn" | "danger" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: .01em;
  color: ${({ $tone }) => ($tone === "danger" ? '#f87171' : $tone === "warn" ? '#facc15' : '#34d399')};
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid rgba(148,163,184,.15);
  margin: 4px 0 0;
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding-top: 6px;
`;

const Assignee = styled.span`
  flex: 1 1 auto;
  color: var(--color-text-muted, #b6c2cf);
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionsWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex: 0 0 auto;
  align-items: center;
`;

const MoveButton = styled.button`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(148,163,184,.25);
  background: rgba(30,41,59,.7);
  color: var(--color-text, #e5e7eb);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,.25) inset;
  &:hover:not(:disabled) {
    background: rgba(139,92,246,.18);
    border-color: rgba(139,92,246,.45);
  }
  &:disabled {
    opacity: .55;
    cursor: not-allowed;
  }
  svg { opacity: .95; }
`;


const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(148,163,184,.4);
  border-top-color: rgba(148,163,184,1);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const PlaceholderText = styled.p`
  font-size: 0.78rem;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
  font-style: italic;
`;

const KanbanCard: React.FC<KanbanCardProps> = ({
  orderId,
  linkId,
  title,
  titleComplement,
  deadline_start,
  deadline_end,
  tags = [],
  assignee,
  isUpdating = false,
  canMoveForward = false,
  canMoveBackward = false,
  onMove = () => {},
  extraActionLabel,
  onExtraAction,
  extraActionDisabled,
}) => {
  // Exibe no máximo dois nomes da pessoa, conforme solicitado
  const assigneeShort = useMemo(() => {
    if (!assignee) return "Não atribuido";
    const parts = String(assignee).trim().split(/\s+/);
    return parts.slice(0, 2).join(" ");
  }, [assignee]);
  const { tone, statusText } = useMemo(() => {
    if (!deadline_start || !deadline_end) {
      return { tone: "warn" as "ok" | "warn" | "danger", statusText: "Sem prazo definido" };
    }
    const start = new Date(deadline_start);
    const end = new Date(deadline_end);
    const today = new Date();
    [start, end, today].forEach((d) => d.setHours(0, 0, 0, 0));
    const remainingDays = Math.ceil((end.getTime() - today.getTime()) / 86_400_000);

    if (remainingDays < 0) return { tone: "danger", statusText: "Prazo encerrado" } as const;
    if (remainingDays <= 3) return { tone: "danger", statusText: `Restam ${remainingDays} ${remainingDays === 1 ? "dia" : "dias"}` } as const;
    if (remainingDays <= 7) return { tone: "warn", statusText: `Restam ${remainingDays} dias` } as const;
    return { tone: "ok", statusText: `Restam ${remainingDays} dias` } as const;
  }, [deadline_start, deadline_end]);

  const ariaLabel = titleComplement ? `${title} - ${titleComplement}` : title;

  const renderIcon = (direction: "next" | "prev") => {
    if (isUpdating) {
      return <Spinner aria-hidden />;
    }

    return direction === "next" ? <FaChevronRight size="0.85em" /> : <FaChevronLeft size="0.85em" />;
  };

  return (
    <CardReset>
      <Card aria-label={ariaLabel} $updating={isUpdating}>
        <TitleLink to={linkId ? `/assinantes/${linkId}` : "#"} aria-label={ariaLabel}>
          <Title title={title}>{title}</Title>
          {titleComplement && <Subtitle title={titleComplement}>{titleComplement}</Subtitle>}
        </TitleLink>

        {tags.length > 0 ? (
          <TagsRow>
            {tags.map((tag) => (
              <Tag key={tag.id} title={tag.label}>{tag.label}</Tag>
            ))}
          </TagsRow>
        ) : (
          <></>
        )}

        <InnerPanel>
          {orderId && (
            <Row>
              <FaHashtag />
              <RowText>Pedido: #{String(orderId)}</RowText>
            </Row>
          )}
          {deadline_start && (
            <Row>
              <FaRegCalendarAlt />
              <RowText>Inicio: {new Date(deadline_start).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</RowText>
            </Row>
          )}
          {deadline_end && (
            <Row>
              <FaBullseye />
              <RowText>Limite: {new Date(deadline_end).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</RowText>
            </Row>
          )}
          <StatusPill $tone={tone}>
            <Dot /> {statusText}
          </StatusPill>
        </InnerPanel>

        <Divider />

        <Footer>
          <Assignee title={assignee || "Nao atribuido"}>{assigneeShort}</Assignee>
          <ActionsWrapper>
            {extraActionLabel && onExtraAction && (
              <PrimaryActionButton onClick={onExtraAction} aria-label={extraActionLabel} disabled={extraActionDisabled}>
                {extraActionDisabled ? (
                  <>
                    <Spinner aria-hidden style={{ marginRight: 8 }} />
                    Gerando...
                  </>
                ) : (
                  extraActionLabel
                )}
              </PrimaryActionButton>
            )}
            <MoveButton onClick={() => onMove("prev")} disabled={!canMoveBackward || isUpdating} aria-label="Mover para etapa anterior">
              {renderIcon("prev")}
            </MoveButton>
            <MoveButton onClick={() => onMove("next")} disabled={!canMoveForward || isUpdating} aria-label="Mover para proxima etapa">
              {renderIcon("next")}
            </MoveButton>
          </ActionsWrapper>
        </Footer>
      </Card>
    </CardReset>
  );
};

export default KanbanCard;
