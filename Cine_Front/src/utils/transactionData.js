export const emptyCatalogIds = { ticketType: '', paymentMethod: '', salesChannel: '' }

export function isPositiveInteger(value) {
  const normalized = String(value ?? '').trim()
  return /^\d+$/.test(normalized) && Number.isSafeInteger(Number(normalized)) && Number(normalized) > 0
}

export function isValidPrice(value) {
  const normalized = String(value ?? '').trim()
  return normalized !== '' && Number.isFinite(Number(normalized)) && Number(normalized) >= 0
}

export function getResourceId(value, key) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value[key] ?? null
}

export function getReservationStatus(value) {
  if (value?.estado === false) return { label: 'Cancelada', variant: 'danger' }
  if (value?.fechaHoraConfirmacion) return { label: 'Confirmada', variant: 'success' }
  if (value?.estado === true) return { label: 'Pendiente', variant: 'warning' }
  return { label: 'Estado informado por API', variant: 'default' }
}

export function formatData(value) {
  if (value === null) return 'Sin dato'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (Array.isArray(value)) return value.map((item) => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function readableLabel(value) {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^id/, 'ID ').replace(/^./, (letter) => letter.toUpperCase())
}
