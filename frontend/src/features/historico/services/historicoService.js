import api from '../../../services/api';

/**
 * Busca a lista de logs de histórico com base no filtro.
 */
export const getHistorico = (page = 1, filter = 'todos', limit = 20, extra = {}) => {
    const params = { page, filter, limit, ...extra };
    return api.get(`/admin/history`, { params });
};

/**
 * Busca a contagem de cada tipo de ação.
 */
export const getHistoricoCounts = () => {
    return api.get(`/admin/history/counts`);
};
