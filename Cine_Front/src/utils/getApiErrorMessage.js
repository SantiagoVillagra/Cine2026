const statusMessages = {
  400: 'Revisá los datos ingresados e intentá nuevamente.',
  401: 'La sesión venció o las credenciales no son válidas. Iniciá sesión nuevamente.',
  403: 'Tu usuario no tiene permisos para realizar esta acción.',
  404: 'No se encontró el recurso solicitado.',
  409: 'La operación entra en conflicto con el estado actual.',
}

export function getApiErrorMessage(error, fallback = 'No se pudo completar la solicitud.') {
  const { response } = error
  if (!response) return 'No se pudo conectar con el servidor. Verificá la conexión e intentá nuevamente.'

  const data = response.data
  if (typeof data === 'string' && data.trim()) return data

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string' && data.message.trim()) return data.message
    if (typeof data.detail === 'string' && data.detail.trim()) return data.detail
    if (data.errors && typeof data.errors === 'object') {
      const validationMessage = Object.values(data.errors)
        .flat()
        .find((message) => typeof message === 'string' && message.trim())
      if (validationMessage) return validationMessage
    }
  }

  return statusMessages[response.status] ?? fallback
}
