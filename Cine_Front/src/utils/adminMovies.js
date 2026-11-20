function parsePositiveIdList(value) {
  const normalized = value.trim()
  if (!normalized) return { value: [], error: null }

  const parts = normalized.split(',').map((part) => part.trim())
  if (parts.some((part) => !/^\d+$/.test(part) || Number(part) < 1)) {
    return { value: [], error: 'Ingresá IDs enteros positivos separados por comas.' }
  }

  return { value: parts.map(Number), error: null }
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function mapAdminMovie(movie) {
  return {
    idPelicula: movie.idPelicula,
    titulo: movie.titulo,
    duracion: movie.duracion,
    idClasificacion: movie.idClasificacion,
    idDirector: movie.idDirector,
    fechaEstreno: movie.fechaEstreno,
    poster: movie.poster,
    sinopsis: movie.sinopsis,
    activa: movie.activa,
  }
}

export function mapAdminMovies(movies) {
  return Array.isArray(movies) ? movies.map(mapAdminMovie) : []
}

export function validateMovieForm(values) {
  const errors = {}
  const titulo = values.titulo.trim()
  const poster = values.poster.trim()
  const duration = Number(values.duracion)
  const idClasificacion = Number(values.idClasificacion)
  const idDirector = Number(values.idDirector)
  const genres = parsePositiveIdList(values.idsGeneros)
  const actors = parsePositiveIdList(values.idsActores)

  if (!titulo) errors.titulo = 'Ingresá el título.'
  else if (titulo.length > 200) errors.titulo = 'El título admite hasta 200 caracteres.'

  if (!values.duracion.trim()) errors.duracion = 'Ingresá la duración en minutos.'
  else if (!Number.isInteger(duration) || duration < 1 || duration > 600) {
    errors.duracion = 'La duración debe ser un número entero entre 1 y 600.'
  }

  if (!Number.isInteger(idClasificacion) || idClasificacion < 1) {
    errors.idClasificacion = 'Ingresá un ID de clasificación entero positivo.'
  }

  if (!Number.isInteger(idDirector) || idDirector < 1) {
    errors.idDirector = 'Ingresá un ID de director entero positivo.'
  }

  if (!isValidDate(values.fechaEstreno)) errors.fechaEstreno = 'Ingresá una fecha válida.'

  if (!poster) errors.poster = 'Ingresá la ruta o URL del póster.'
  else if (poster.length > 300) errors.poster = 'La referencia del póster admite hasta 300 caracteres.'

  if (genres.error) errors.idsGeneros = genres.error
  if (actors.error) errors.idsActores = actors.error

  if (Object.keys(errors).length > 0) return { errors, payload: null }

  return {
    errors,
    payload: {
      titulo,
      duracion: duration,
      idClasificacion,
      idDirector,
      fechaEstreno: values.fechaEstreno,
      poster,
      ...(values.sinopsis.trim() ? { sinopsis: values.sinopsis.trim() } : {}),
      idsGeneros: genres.value,
      idsActores: actors.value,
    },
  }
}

export function updateMovieActive(movies, movieId, activa) {
  return movies.map((movie) => movie.idPelicula === movieId ? { ...movie, activa } : movie)
}

export function formatMovieDate(value) {
  if (typeof value !== 'string' || !isValidDate(value)) return value || 'Fecha no informada'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00.000Z`))
}
