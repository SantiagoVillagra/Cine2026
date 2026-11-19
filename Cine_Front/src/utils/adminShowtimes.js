function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function mapAdminShowtime(item) {
  return {
    idFuncion: item.idFuncion,
    fecha: item.fecha,
    hora: item.hora,
    subtitulada: item.subtitulada,
    idPelicula: item.idPelicula,
    tituloPelicula: item.tituloPelicula,
    idSala: item.idSala,
    idIdioma: item.idIdioma,
  }
}

export function mapAdminShowtimes(items) {
  return Array.isArray(items) ? items.map(mapAdminShowtime) : []
}

export function validateShowtimeForm(values) {
  const errors = {}
  const ids = ['idHoraFuncion', 'idPelicula', 'idSala', 'idIdioma']
  if (!isValidDate(values.fecha)) errors.fecha = 'Ingresá una fecha válida.'
  for (const key of ids) {
    const value = Number(values[key])
    if (!values[key].trim() || !Number.isInteger(value) || value < 1) {
      errors[key] = 'Ingresá un ID entero positivo.'
    }
  }
  if (!['true', 'false'].includes(values.subtitulada)) {
    errors.subtitulada = 'Seleccioná si la función será subtitulada.'
  }
  if (Object.keys(errors).length) return { errors, payload: null }
  return {
    errors,
    payload: {
      fecha: values.fecha,
      idHoraFuncion: Number(values.idHoraFuncion),
      subtitulada: values.subtitulada === 'true',
      idPelicula: Number(values.idPelicula),
      idSala: Number(values.idSala),
      idIdioma: Number(values.idIdioma),
    },
  }
}

export function formatShowtimeDate(value) {
  const datePart = typeof value === 'string' ? value.slice(0, 10) : ''
  if (!isValidDate(datePart)) return 'Fecha no informada'
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${datePart}T00:00:00.000Z`))
}

export async function requestShowtimeCreation(payload, createRequest) {
  try {
    return { status: 'success', data: await createRequest(payload), error: null }
  } catch (error) {
    return { status: 'error', data: null, error }
  }
}
