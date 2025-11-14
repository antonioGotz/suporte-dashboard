import styled from 'styled-components';

export const TimelineWrapper = styled.div`
  display: grid;
  gap: 12px;
`;

export const Card = styled.div`
  background: ${({theme})=> theme?.color?.surfaceMuted ?? '#0b1220'};
  border: 1px solid ${({theme})=> theme?.color?.border ?? '#1f2937'};
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.5);
`;

export const Header = styled.div`
  display:flex; justify-content:space-between; align-items:flex-start; gap:12px;
`;

export const Title = styled.div`
  font-weight:700; color:${({theme})=> theme?.color?.text?.primary ?? '#e5e7eb'}; font-size:16px;
`;

export const Meta = styled.div`
  font-size:12px; color:${({theme})=> theme?.color?.text?.secondary ?? '#94a3b8'};
`;

export const Stages = styled.div`
  display:flex; justify-content:space-between; align-items:center; margin-top:12px; font-size:12px; color:${({theme})=> theme?.color?.text?.secondary ?? '#94a3b8'}; position:relative;
  width:100%; box-sizing:border-box;
  /* markers removed: only progress fill remains; markers are not rendered */
`;

export const ProgressBar = styled.div`
  position:relative; height:12px; background:${({theme})=> theme?.color?.border ?? '#1f2937'}; border-radius:999px; overflow:visible; margin-top:8px;
  box-sizing:border-box;
  &::before{ content:''; position:absolute; left:0; top:0; bottom:0; width:100%; border-radius:999px; }
  /* make inner fill absolute and anchored to left to avoid offsets from padding/margins */
  & > div{ position:absolute; left:0; top:0; bottom:0; z-index:2; height:100%; background:${({theme})=> theme?.color?.primaryHover ?? '#0ea5e9'}; width:0%; transition: width 420ms cubic-bezier(.2,.9,.2,1); border-radius:999px; }

  /* markers container (absolute) */
  .markers{ position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); height:0; }
  .marker{ position:absolute; transform:translateX(-50%) translateY(-50%); width:12px; height:12px; border-radius:50%; border:2px solid rgba(0,0,0,0.35); background:#374151; box-shadow:0 2px 6px rgba(0,0,0,0.6);} 
  .marker.past{ box-shadow:0 2px 8px rgba(0,0,0,0.6); }
  .marker.future{ opacity:0.45; background: rgba(148,163,184,0.18); border:1px solid rgba(148,163,184,0.18);} 
  .marker.current{ animation: pulse 1600ms infinite; box-shadow: 0 0 0 6px rgba(14,165,233,0.12); }

  /* tip removed: markers under labels will indicate position; fill ends at center of target marker */

  @keyframes pulse {
    0%{ transform:translateX(-50%) translateY(-50%) scale(1); box-shadow: 0 0 0 0 rgba(14,165,233,0.12); }
    50%{ transform:translateX(-50%) translateY(-50%) scale(1.06); box-shadow: 0 0 0 6px rgba(14,165,233,0.08); }
    100%{ transform:translateX(-50%) translateY(-50%) scale(1); box-shadow: 0 0 0 0 rgba(14,165,233,0.12); }
  }
`;

export const Badge = styled.span`
  display:inline-flex; align-items:center; padding:4px 8px; border-radius:999px; font-size:12px; font-weight:700;
  background: ${({bg})=> bg || 'rgba(148,163,184,0.12)'}; color: ${({fg})=> fg || '#e5e7eb'};
`;

export const Actions = styled.div`
  display:flex; gap:8px; align-items:center; margin-top:12px;
  & > div:last-child{ display:flex; gap:8px; align-items:center; }
  button{ position:relative; z-index:3; padding:6px 10px; border-radius:6px; cursor:pointer; }
  button[disabled]{ opacity:0.5; cursor:not-allowed; }
`;

export const Small = styled.div`
  font-size:12px; color:${({theme})=> theme?.color?.text?.secondary ?? '#94a3b8'};
`;
