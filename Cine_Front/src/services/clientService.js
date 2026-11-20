import { apiClient } from './apiClient.js'

export async function getClientProfile({ signal } = {}) {
  const { data } = await apiClient.get('/api/clientes/perfil', { signal })
  return data
}
