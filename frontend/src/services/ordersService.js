import api from './api';

export async function getMaxOrderId() {
  const response = await api.get('/admin/orders/max-id');
  return response.data?.maxId || 0;
}
