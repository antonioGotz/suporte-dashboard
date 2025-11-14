export function toYMD(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function classifySLA(ymd) {
  if (!ymd) return { intent: 'neutral', label: '-' };
  const today = new Date();
  const now = toYMD(today);
  if (ymd < now) return { intent: 'danger', label: 'Atrasado' };
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (ymd <= toYMD(tomorrow)) return { intent: 'warn', label: 'Prazo curto' };
  return { intent: 'info', label: 'Em prazo' };
}

// Stub util para Lista2Teste (não usado)
export function normalizeProductName(name) {
  if (!name) return '—';
  return String(name);
}
