import api from "./api";

export async function getSeparationList(page, dateFilter, planFilter, opts = {}) {
  const params = new URLSearchParams();
  if (page) params.set('page', String(page));

  const planOverride = opts.planOverride;
  const dateOverride = opts.dateOverride;
  const effectivePlan = planOverride ?? planFilter;
  const effectiveDate = dateOverride ?? dateFilter;

  if (effectiveDate) params.set('date', effectiveDate);
  if (effectivePlan && effectivePlan !== 'todos') params.set('plan', effectivePlan);
  if (opts.recentActions) params.set('recent_actions', '1');

  const q = opts.searchValue ?? opts.q ?? '';
  if (q) params.set('q', String(q));

  const statusCode = opts.statusCode ?? opts.status_code ?? null;
  if (statusCode && String(statusCode).toLowerCase() !== 'all') {
    params.set('status_code', String(statusCode));
  }

  const axiosConfig = {};
  if (opts.signal) axiosConfig.signal = opts.signal;
  return api.get(`/admin/separation?${params.toString()}`, axiosConfig);
}

/**
 * Atualiza o status de um pedido enviando SEMPRE o código do status.
 * Backend expõe PUT/PATCH /api/admin/separation/{order}.
 */
export async function updateSeparationStatus(orderId, statusCode) {
  return api.patch(`/admin/separation/${orderId}`, { status: statusCode });
}

/**
 * Gera etiqueta de envio para um pedido.
 * Backend: POST /api/admin/orders/{order}/shipping/label
 */
export async function generateShippingLabel(orderId) {
  return api.post(`/admin/orders/${orderId}/shipping/label`);
}
