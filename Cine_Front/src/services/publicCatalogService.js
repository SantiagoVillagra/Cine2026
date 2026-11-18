import { apiClient } from './apiClient.js'

export async function getMovies({ signal } = {}) {
  const { data } = await apiClient.get('/api/peliculas', { signal })
  return data
}

export async function getMovieById(id, { signal } = {}) {
  const { data } = await apiClient.get(`/api/peliculas/${id}`, { signal })
  return data
}

export async function getShowtimes({ movieId, signal } = {}) {
  const params = movieId === undefined ? undefined : { idPelicula: movieId }
  const { data } = await apiClient.get('/api/funciones', { params, signal })
  return data
}
