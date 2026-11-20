import { apiClient } from './apiClient.js'

export async function getInvoices({ admin = false, signal } = {}) {
  const { data } = await apiClient.get(admin ? '/api/facturas' : '/api/facturas/mis-facturas', { signal })
  return data
}

export async function getInvoice(id, { signal } = {}) {
  const { data } = await apiClient.get(`/api/facturas/${id}`, { signal })
  return data
}

export async function createInvoice(invoice) {
  const { data } = await apiClient.post('/api/facturas', invoice)
  return data
}
