import { apiClient } from './apiClient.js'
import { buildDateRangeParams } from '../utils/adminStatistics.js'

export async function getMonthlyRevenue({ desde, hasta, signal } = {}) {
  const { data } = await apiClient.get('/api/estadisticas/ingresos-por-mes', {
    params: buildDateRangeParams(desde, hasta),
    signal,
  })
  return data
}

export async function getTopMovies({ top = 10, signal } = {}) {
  const { data } = await apiClient.get('/api/estadisticas/top-peliculas', {
    params: { top },
    signal,
  })
  return data
}

export async function getOccupancyByHour({ desde, hasta, signal } = {}) {
  const { data } = await apiClient.get('/api/estadisticas/ocupacion-por-horario', {
    params: buildDateRangeParams(desde, hasta),
    signal,
  })
  return data
}

export async function getPromotionUsage({ signal } = {}) {
  const { data } = await apiClient.get('/api/estadisticas/uso-promociones', { signal })
  return data
}
