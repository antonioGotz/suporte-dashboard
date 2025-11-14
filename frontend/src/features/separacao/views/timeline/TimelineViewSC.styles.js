import styled, { keyframes } from 'styled-components';

export const TimelineWrapper = styled.div`
  display: grid;
  gap: 12px;
`;

export const Card = styled.div`
  border-radius: 12px;
  padding: 16px;
  /* dark card to match screenshot */
  background: ${({theme})=> theme?.color?.surfaceDark ?? '#0b1220'};
  border: 1px solid ${({theme})=> theme?.color?.border ?? 'rgba(255,255,255,0.04)'};
  box-shadow: 0 6px 18px rgba(2,6,23,0.6);
  display:flex;
  flex-direction:column;
  gap:12px;
`;

export const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
`;

export const Title = styled.div`
  font-weight:700;
  color: ${({theme})=> theme?.color?.text?.primary ?? '#e5e7eb'};
`;

export const Meta = styled.div`
  font-size:12px;
  color: ${({theme})=> theme?.color?.text?.secondary ?? '#94a3b8'};
`;

export const Stages = styled.div`
  display:flex;
  gap:8px;
  font-size:13px;
  color:${({theme})=> theme?.color?.text?.secondary ?? '#94a3b8'};
  user-select:none;
  align-items:center;
  width:100%; box-sizing:border-box;
`;

export const progressPulse = keyframes`
  0% { opacity: 1; transform: scaleX(1); }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
`;

export const ProgressBar = styled.div`
  height: 12px;
  border-radius: 999px;
  /* dark track */
  background: ${({theme})=> theme?.color?.trackDark ?? '#0f172a'};
  position:relative;
  overflow:visible;
  margin-top:8px;

  &>div{
    height:100%;
    background: linear-gradient(90deg,#06b6d4 0%, #3b82f6 100%);
    border-radius:999px;
    box-shadow: 0 6px 18px rgba(59,130,246,0.12);
    /* make absolutely positioned to avoid offset accumulation */
    position: absolute;
    left:0; top:0; bottom:0;
    overflow: visible;
    transition: width 900ms cubic-bezier(.2,.9,.2,1);
  }

  &>div.fill[data-pulse="true"]::after{
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #06b6d4; /* bright cyan */
    box-shadow: 0 0 0 0 rgba(6,182,212,0.22);
    animation: pulse 1600ms infinite ease-out;
  }
`;

export const Badge = styled.span`
  display:inline-flex; align-items:center; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700;
  background: ${({bg})=> bg || '#06132a'}; color: ${({fg})=> fg || '#ffffff'};
`;

export const Actions = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  & > div:last-child{ display:flex; gap:8px; align-items:center; }
  button{ position:relative; z-index:3; padding:6px 10px; border-radius:6px; cursor:pointer; }
  button[disabled]{ opacity:0.5; cursor:not-allowed; }
`;

export const Small = styled.div`
  font-size:12px;
  color:${({theme})=> theme?.color?.text?.secondary ?? '#6b7280'};
`;
