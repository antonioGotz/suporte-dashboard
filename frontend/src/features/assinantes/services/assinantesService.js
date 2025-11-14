// Retorna os contadores globais dos filtros de assinantes
export const getCounts = () => {
  return api.get('/admin/subscribers/counts').then(res => res.data);
};

import api from '../../../services/api';

/**
 * ATUALIZADO: Agora aceita um termo de busca no objeto de filtros.
 */
export const getAssinantes = (page = 1, limit = 15, filters = {}) => {
  const params = { page, limit, unique: 1, ...filters };
  return api.get(`/admin/subscribers`, { params });
};

export const createAssinante = (assinanteData) => {
  return api.post(`/admin/subscribers`, assinanteData);
};

export const updateStatusAssinatura = (orderId, newStatus, reason) => {
  // Envia tanto 'status' quanto 'action' para máxima compatibilidade com o backend
  return api.put(`/admin/subscribers/${orderId}/status`, { status: newStatus, action: newStatus, reason });
};

export const createOrderForUser = (userId, productId, amount, orderId) => {
  const payload = {};
  if (productId !== undefined && productId !== null && `${productId}` !== '') {
    const numericProductId = Number(productId);
    if (Number.isFinite(numericProductId)) {
      payload.products_id = numericProductId;
    }
  }
  if (amount !== undefined && amount !== null && `${amount}` !== '') {
    const numericAmount = Number(amount);
    if (Number.isFinite(numericAmount)) {
      payload.amount = numericAmount;
    }
  }
  if (orderId !== undefined && orderId !== null && `${orderId}` !== '') {
    const numericOrderId = Number(orderId);
    if (Number.isFinite(numericOrderId)) {
      payload.order_id = numericOrderId;
    }
  }
  return api.post(`/admin/subscribers/${userId}/orders`, payload);
};

export const getAssinanteById = (id) => {
  return api.get(`/admin/subscribers/${id}`);
};

export const deleteAssinante = (userId) => {
  return api.delete(`/admin/subscribers/${userId}`);
};

// Compatibilidade: export default no formato esperado pela página
const assinantesService = {
  getAll: (options = {}) => {
    // Aceita objeto com page, limit e demais filtros
    const {
      page = 1,
      limit = 15,
      ...filters
    } = options || {};
    const params = { page, limit, unique: 1, ...filters };
    return api.get(`/admin/subscribers`, { params });
  },
  updateStatusAssinatura,
  createOrderForUser,
  getAssinanteById,
  deleteAssinante,
  getCounts,
};

export default assinantesService;
