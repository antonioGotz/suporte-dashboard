export function stageIndex(stage, statusPipeline) {
  if (!stage) return -1;
  return Math.max(0, statusPipeline.findIndex(s => (s.statusCode || s.key) === stage));
}

export function percentFor(stage, statusPipeline) {
  const visible = statusPipeline.filter(s=>!('isFallback' in s));
  const idx = stageIndex(stage, statusPipeline);
  if (idx < 0) return 0;
  // queremos centrar no meio da etapa: each step occupies equal fraction; position = (idx + 0.5)/n
  const pos = ((idx + 0.5) / visible.length) * 100;
  // return with one decimal to avoid pixel rounding artefacts in narrow containers
  return Math.round(pos * 10) / 10;
}

export function tooltipFor(stage, statusPipeline) {
  const idx = stageIndex(stage, statusPipeline);
  const visible = statusPipeline.filter(s=>!('isFallback' in s));
  const total = visible.length;
  const pct = idx < 0 ? 0 : Math.round(((idx + 0.5)/ total) * 100);
  return `Etapa ${Math.max(1, idx+1)} de ${total} — ${pct}%`;
}

export function percentTipFor(stage, statusPipeline) {
  // posição da ponta do preenchimento: fim da etapa => (idx+1)/n
  const visible = statusPipeline.filter(s=>!('isFallback' in s));
  const idx = stageIndex(stage, statusPipeline);
  if (idx < 0) return 0;
  const pos = ((idx + 1) / visible.length) * 100;
  return Math.round(pos * 10) / 10;
}
