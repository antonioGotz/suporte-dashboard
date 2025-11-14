import styled, { createGlobalStyle } from 'styled-components';

// Tokens e superfícies base para todo o compositor
export const Card = styled.div`
  max-width: 980px;
  margin: 24px auto;
  background: var(--panel-surface-0, var(--surface-0));
  border-radius: 12px;
  padding: 28px;
  color: var(--panel-text, var(--text));
  box-shadow: 0 10px 30px rgba(3, 6, 12, 0.4);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--panel-surface-2, transparent);
  /* sem efeitos de vidro/blur */
  @media (max-width: 768px) {
    margin: 12px;
    padding: 18px;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 18px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 30px;
  line-height: 1.25;
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

export const Subtitle = styled.p`
  margin: 6px 0 0 0;
  color: var(--panel-text-muted, var(--text-muted));
  font-size: 13px;
`;

export const Content = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
`;

// Layouts
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 13px;
  color: var(--panel-text-muted, rgba(230, 238, 248, 0.8));
`;

export const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--panel-glass-border, rgba(255,255,255,0.08));
  background: var(--panel-glass-bg, rgba(255, 255, 255, 0.04));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  color: var(--panel-text, inherit);
  outline: none;
  min-height: 44px;
  &:focus {
    box-shadow: 0 0 0 3px var(--panel-ring, var(--ring));
    border-color: transparent;
  }
`;

// Wrapper to provide consistent hover/interactive styling for inputs/selects used
// across the EmailComposer. Use to componentize hover effect and keep no translateY.
export const HoverControl = styled.div`
  border-radius: 8px;
  transition: box-shadow 160ms ease, border-color 120ms ease;
  display: block;
  & > * {
    width: 100%;
  }
  &:hover {
    box-shadow: 0 6px 18px rgba(3,6,12,0.45);
    /* no translateY on hover - keep subtle */
    border-color: rgba(111,62,248,0.14);
  }
  /* react-select control inside this wrapper (when using classNamePrefix 'ec') */
  .ec__control {
    border-radius: 8px !important;
    border: 1px solid var(--panel-glass-border, var(--panel-surface-2)) !important;
    background: var(--panel-glass-bg, var(--panel-surface-1)) !important;
    -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px)) !important;
    backdrop-filter: blur(var(--panel-glass-blur, 10px)) !important;
    box-shadow: none !important;
  }
`;

export const Textarea = styled.textarea`
  min-height: 180px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--panel-glass-border, rgba(255,255,255,0.08));
  background: var(--panel-glass-bg, rgba(255,255,255,0.04));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  color: var(--panel-text, inherit);
  outline: none;
  @media (max-width: 768px) {
    min-height: 140px;
  }
  &:focus {
    box-shadow: 0 0 0 3px var(--ring);
    border-color: transparent;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// Botões
export const ButtonPrimary = styled.button`
  background: var(--accent);
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: filter 0.15s ease, opacity 0.2s ease;
  &:hover { filter: brightness(1.05); }
  &:active { filter: brightness(0.96); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const ButtonSecondary = styled.button`
  background: transparent;
  color: var(--panel-text, rgba(230, 238, 248, 0.92));
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--panel-surface-2, rgba(255, 255, 255, 0.08));
  cursor: pointer;
`;

export const ButtonGhost = styled.button`
  background: transparent;
  color: var(--panel-text, rgba(230, 238, 248, 0.9));
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--panel-surface-2, rgba(255, 255, 255, 0.06));
  cursor: pointer;
`;

// Cartões auxiliares
export const CardSection = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: var(--panel-glass-bg, var(--panel-surface-1));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  border: 1px solid var(--panel-glass-border, transparent);
`;

export const InfoCard = styled(CardSection)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoTitle = styled.div`
  font-weight: 600;
  color: var(--panel-text, var(--text));
`;

export const InfoBody = styled.div`
  padding: 8px;
  border-radius: 8px;
  background: var(--panel-glass-bg, #041025);
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  border: 1px solid var(--panel-glass-border, transparent);
`;

export const Pill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(106, 62, 255, 0.12);
  border: 1px solid rgba(106, 62, 255, 0.22);
  color: var(--panel-text, #F0F0F0);
  font-size: 12px;
`;

export const Muted = styled.span`
  color: var(--panel-text-muted, var(--text-muted));
`;

// Editor
export const EditorShell = styled.div`
  border-radius: 10px;
  border: 1px solid var(--panel-glass-border, transparent);
  background: var(--panel-glass-bg, var(--panel-surface-1));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  overflow: hidden;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-bottom: 1px solid var(--panel-surface-2, var(--surface-2));
`;

export const ToolbarButton = styled.button`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--panel-surface-2, var(--surface-2));
  background: ${(p) => (p.$active ? 'rgba(111,62,248,0.15)' : 'transparent')};
  cursor: pointer;
  color: inherit;
`;

export const EditorBody = styled.div`
  padding: 8px;
`;

// Dropzone / anexos
export const Dropzone = styled.div`
  border: 1px dashed var(--panel-glass-border, transparent);
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  background: var(--panel-glass-bg, var(--panel-surface-1));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
`;

export const DropHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AttachList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const AttachItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AttachName = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Footer
export const FooterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  position: sticky;
  bottom: 0;
  padding-top: 8px;
  background: var(--panel-surface-0, var(--surface-0));
`;

export const ShortcutHint = styled.span`
  font-size: 12px;
  color: var(--panel-text-muted, var(--text-muted));
`;

// Modal (Preview)
export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ModalTitle = styled.strong``;

export const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

// react-select option label helpers
export const OptionLabelWrap = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

export const OptionName = styled.span`
  font-weight: 700;
  font-size: 15px;
  color: var(--panel-text, var(--text));
`;

export const OptionEmail = styled.span`
  font-size: 13px;
  color: var(--panel-text-muted, var(--text-muted));
`;

// Dropdown custom para autocomplete (fallback ao react-select)
export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  z-index: 2147483647;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--panel-surface-0, var(--surface-0));
  border: 1px solid var(--panel-surface-2, var(--surface-2));
  border-radius: 8px;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  max-height: 280px;
  overflow: auto;
  box-shadow: 0 10px 30px rgba(3,6,12,0.6);
`;

export const DropdownItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid var(--panel-surface-2, rgba(255,255,255,0.03));
  transition: background 120ms ease;
  &:hover {
    background: rgba(111,62,248,0.06);
  }
  &.highlighted {
    background: rgba(111,62,248,0.12);
  }
  &:last-child {
    border-bottom: none;
  }
`;

// Email icon used instead of avatar to avoid overflow/stacking issues
export const EmailIcon = styled.div`
  width: 28px;
  height: 28px;
  min-width: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--panel-text, var(--text));
  flex: 0 0 28px;
  svg { width: 18px; height: 18px; color: var(--panel-text-muted, var(--text-muted)); }
`;

// Selected value presentation (inside the input area)
export const SelectedBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--panel-surface-2, transparent);
  background: var(--panel-surface-1, rgba(0,0,0,0.02));
  color: var(--panel-text, inherit);
  min-height: 48px;
  cursor: pointer;
  transition: box-shadow 160ms ease, border-color 120ms ease;
  position: relative; /* allow absolutely-positioned chevron */
  padding-right: 56px; /* room for chevron + clear */
  &:hover {
    box-shadow: 0 6px 18px rgba(3,6,12,0.45);
    /* no translateY movement on hover - keep it subtle */
    border-color: rgba(111,62,248,0.14);
  }
`;

export const SelectedName = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: var(--panel-text, var(--text));
`;

export const SelectedEmail = styled.span`
  font-size: 12px;
  color: var(--panel-text-muted, var(--text-muted));
`;

export const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: var(--panel-text-muted, var(--text-muted));
  cursor: pointer;
  padding: 6px;
  margin-left: 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  svg { width: 12px; height: 12px; }
  &:hover { background: rgba(255,255,255,0.02); color: var(--panel-text, var(--text)); svg { color: var(--panel-text, var(--text)); } }
`;

export const Chevron = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%) rotate(${(p) => (p.$open ? '180deg' : '0deg')});
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--panel-text-muted, var(--text-muted));
  transition: transform 180ms ease, color 120ms ease;
  &:hover { color: var(--panel-text, var(--text)); }
`;

// Container temático: aplica variações de paleta via data-theme
export const ComposerContainer = styled.div`
  /* tema padrão (roxo/azul atual) */
  --surface-0: #0b1220;
  --surface-1: rgba(255, 255, 255, 0.03);
  --surface-2: rgba(255, 255, 255, 0.06);
  --text: #e6eef8;
  --text-muted: rgba(230, 238, 248, 0.7);
  --ring: rgba(111, 62, 248, 0.18);
  --accent: linear-gradient(90deg, #6f3ef8, #5b2be6);

  /* Panel (EmailComposer content) - Tema Misto: painel claro sobre casca escura */
  /* Panel variables for Soft Dark Mode */
  --panel-surface-0: #1E1E1E; /* main panel background (darker) */
  --panel-surface-1: #2A2A2A; /* component surfaces (inputs, cards, editor) */
  --panel-surface-2: transparent; /* no light borders for dark mode */
  --panel-text: #F0F0F0; /* main text */
  --panel-text-muted: #8B8B8B; /* labels/secondary text */
  --panel-ring: rgba(106, 62, 255, 0.18); /* accent ring (keeps purple accent) */
  --panel-accent: linear-gradient(90deg, #6a3eff, #5b2be6);
  /* Glass variables for Camada 2 */
  --panel-glass-bg: rgba(255, 255, 255, 0.04);
  --panel-glass-border: rgba(255, 255, 255, 0.08);
  --panel-glass-blur: 10px;

  &[data-theme='green'] {
    --surface-0: #0a0e14;
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(232, 236, 243, 0.62);
    --ring: rgba(16,185,129,0.18);
    --accent: linear-gradient(90deg, #10b981, #059669);
  }
  &[data-theme='amber'] {
    --surface-0: #100c06;
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(244, 234, 210, 0.62);
    --ring: rgba(245,158,11,0.2);
    --accent: linear-gradient(90deg, #f59e0b, #d97706);
  }
  &[data-theme='graphite'] {
    --surface-0: #0f172a; /* slate-800 */
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(210, 218, 230, 0.62);
    --ring: rgba(148,163,184,0.22);
    --accent: linear-gradient(90deg, #94a3b8, #64748b);
  }
  &[data-theme='rose'] {
    --surface-0: #14080c;
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(245, 224, 230, 0.66);
    --ring: rgba(244,114,182,0.20);
    --accent: linear-gradient(90deg, #f472b6, #ec4899);
  }
  &[data-theme='teal'] {
    --surface-0: #061214;
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(220, 240, 240, 0.66);
    --ring: rgba(20,184,166,0.20);
    --accent: linear-gradient(90deg, #14b8a6, #0d9488);
  }
  &[data-theme='slate'] {
    --surface-0: #0c1016;
    --surface-2: rgba(255, 255, 255, 0.055);
    --text-muted: rgba(224, 232, 242, 0.64);
    --ring: rgba(100,116,139,0.20);
    --accent: linear-gradient(90deg, #64748b, #475569);
  }
  &[data-theme='purple'] {
    --surface-0: #090a18;
    --surface-2: rgba(255, 255, 255, 0.06);
    --text-muted: rgba(230, 238, 248, 0.7);
    --ring: rgba(139,92,246,0.20);
    --accent: linear-gradient(90deg, #8b5cf6, #7c3aed);
  }
`;

// Troca de tema – UI
// Switcher removido a pedido do usuário

// Global styles specifically for react-select dropdown used in this composer.
// We prefix the react-select classnames with `ec` (see RecipientSearch.jsx) so
// these rules only affect the select instance inside the EmailComposer.
export const SelectGlobalStyles = createGlobalStyle`
  /* Strong overlay rules to ensure react-select menu appears above everything.
     We use a very large z-index and fixed positioning to escape stacking contexts.
     Keep !important to override third-party styles used elsewhere. */
  .ec__menu,
  .ec__menu-portal,
  .ec__menu-list {
    z-index: 2147483647 !important;
    position: fixed !important;
    pointer-events: auto !important;
    -webkit-transform: none !important;
    transform: none !important;
  }
  /* Ensure the portal container (if present) is placed on top */
  .ec__menu-portal {
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
  }
`;
