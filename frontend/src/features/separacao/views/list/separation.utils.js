// Utilitários para a apresentação da lista
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

export function normalizeProductName(value) {
  const raw = String(value || '');
  const noCode = raw.replace(/^\s*[0-9]+[\.\-\s]+/, '').trim();
  const lower = noCode.toLowerCase();
  return lower.replace(/\b\w/g, (c) => c.toUpperCase());
}
