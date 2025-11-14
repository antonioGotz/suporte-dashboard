import api from './api'

export async function fetchRecentLabels(page = 1, perPage = 20, filters = {}) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (filters.start_date) params.set('start_date', filters.start_date)
  if (filters.end_date) params.set('end_date', filters.end_date)
  return api.get(`/admin/shipping/labels/recent?${params.toString()}`)
}
