import { apiClient } from './apiClient.js'

async function getCatalog(path, { signal } = {}) {
  const { data } = await apiClient.get(path, { signal })
  return Array.isArray(data) ? data.map((item) => ({ id: item.id, nombre: item.nombre })) : []
}

export const getClassifications = (options) => getCatalog('/api/clasificaciones', options)
export const getDirectors = (options) => getCatalog('/api/directores', options)
export const getGenres = (options) => getCatalog('/api/generos', options)
export const getActors = (options) => getCatalog('/api/actores', options)
