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

function getShowtimeInstant(fecha, hora) {
  const dateParts = typeof fecha === 'string' ? fecha.slice(0, 10).split('-').map(Number) : []
  const timeParts = typeof hora === 'string' ? hora.match(/^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/) : null
  if (dateParts.length !== 3 || dateParts.some(Number.isNaN) || !timeParts) return null

  const [year, month, day] = dateParts
  const [, hours, minutes, seconds = '0'] = timeParts
  const target = Date.UTC(year, month - 1, day, Number(hours), Number(minutes), Number(seconds))
  if (Number.isNaN(target)) return null

  // The API returns date and TimeSpan separately, without a UTC offset. Interpret
  // both as wall-clock time in the cinema's configured Argentina timezone.
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  })
  let instant = target
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const zoned = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(({ type, value }) => [type, value]))
    const represented = Date.UTC(Number(zoned.year), Number(zoned.month) - 1, Number(zoned.day), Number(zoned.hour), Number(zoned.minute), Number(zoned.second))
    instant += target - represented
  }
  return instant
}

export function filterUpcomingActiveShowtimes(showtimes, movies, now = Date.now()) {
  const activeMovieIds = new Set(
    (Array.isArray(movies) ? movies : [])
      .filter((movie) => movie?.activa === true)
      .map((movie) => movie.idPelicula),
  )
  return (Array.isArray(showtimes) ? showtimes : []).filter((showtime) => {
    if (!activeMovieIds.has(showtime.idPelicula)) return false
    const start = getShowtimeInstant(showtime.fecha, showtime.hora)
    return start !== null && start > now
  })
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
