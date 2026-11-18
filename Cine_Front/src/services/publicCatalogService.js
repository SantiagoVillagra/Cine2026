import { apiClient } from './apiClient.js'
import { buildShowtimeParams } from '../utils/publicCatalog.js'

export async function getMovies({ signal } = {}) {
  const { data } = await apiClient.get('/api/peliculas', { signal })
  return data
}

export async function getMovieById(id, { signal } = {}) {
  const { data } = await apiClient.get(`/api/peliculas/${id}`, { signal })
  return data
}

export async function getShowtimes({ movieId, fecha, signal } = {}) {
  const params = buildShowtimeParams({ movieId, fecha })
  const { data } = await apiClient.get('/api/funciones', { params, signal })
  return data
}
