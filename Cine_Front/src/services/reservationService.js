import { apiClient } from './apiClient.js'

export async function getReservations({ admin = false, signal } = {}) {
  const { data } = await apiClient.get(admin ? '/api/reservas' : '/api/reservas/mis-reservas', { signal })
  return data
}

export async function getReservation(id, { signal } = {}) {
  const { data } = await apiClient.get(`/api/reservas/${id}`, { signal })
  return data
}

export async function createReservation(reservation) {
  const { data } = await apiClient.post('/api/reservas', reservation)
  return data
}

export async function cancelReservation(id) {
  const { data } = await apiClient.patch(`/api/reservas/${id}/cancelar`)
  return data
}

export async function confirmReservation(id, payment) {
  const { data } = await apiClient.post(`/api/reservas/${id}/confirmar`, payment)
  return data
}
