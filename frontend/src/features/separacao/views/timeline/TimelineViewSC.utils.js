export function stageIndex(code, statusPipeline){
  if(!code) return 0;
  return Math.max(0, statusPipeline.findIndex(s=> s.statusCode === code || s.key === code));
}

export function percentFor(code, statusPipeline){
  const idx = stageIndex(code, statusPipeline);
  const n = statusPipeline.length || 1;
  return Math.round(((idx + 0.5) / n) * 100);
}

export function percentTipFor(code, statusPipeline){
  const idx = stageIndex(code, statusPipeline);
  const n = statusPipeline.length || 1;
  return Math.round(((idx) / n) * 100);
}

export function tooltipFor(code, statusPipeline){
  const idx = stageIndex(code, statusPipeline);
  const label = statusPipeline[idx] ? statusPipeline[idx].label : '—';
  return `${label} (${idx+1}/${statusPipeline.length})`;
}
