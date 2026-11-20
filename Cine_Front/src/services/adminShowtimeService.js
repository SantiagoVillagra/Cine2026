import { apiClient } from './apiClient.js'
import { getShowtimes } from './publicCatalogService.js'

export async function getAdminShowtimes({ fecha, movieId, signal } = {}) {
  return getShowtimes({ fecha, movieId, signal })
}

export async function createShowtime(showtime) {
  const { data } = await apiClient.post('/api/funciones', showtime)
  return data
}

export async function deleteShowtime(idFuncion) {
  await apiClient.delete(`/api/Funciones/${idFuncion}`)
}
