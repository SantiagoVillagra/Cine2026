import { apiClient } from './apiClient.js'

export async function createMovie(movie) {
  const { data } = await apiClient.post('/api/peliculas', movie)
  return data
}

export async function setMovieActive(id, activa) {
  await apiClient.put(`/api/peliculas/${id}/estado`, { activa })
}
