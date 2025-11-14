import api from '../../../services/api';

const dashboardService = {
  getSummary(params = {}) {
    return api.get('/admin/dashboard/summary', { params }).then((response) => response.data);
  },
};

export default dashboardService;
