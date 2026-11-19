import { apiClient } from './apiClient.js'

export async function getShowtimeSeats(showtimeId, { signal } = {}) {
  const { data } = await apiClient.get(`/api/funciones/${showtimeId}/butacas`, { signal })
  return data
}
