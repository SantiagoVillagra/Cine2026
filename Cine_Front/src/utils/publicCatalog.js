export function mapMovie(movie) {
  return {
    id: movie.idPelicula,
    title: movie.titulo,
    duration: movie.duracion,
    classificationId: movie.idClasificacion,
    poster: movie.poster,
    synopsis: movie.sinopsis,
    active: movie.activa,
  }
}

export function mapShowtime(showtime) {
  return {
    id: showtime.idFuncion,
    date: showtime.fecha,
    time: showtime.hora,
    isSubtitled: showtime.subtitulada,
    movieId: showtime.idPelicula,
    movieTitle: showtime.tituloPelicula,
    roomId: showtime.idSala,
    languageId: showtime.idIdioma,
  }
}

export function getShowtimeFormat(showtime) {
  const roomId = Number(showtime?.roomId)
  if (roomId === 1 || roomId === 2) return '2D'
  if (roomId === 3) return '3D'
  return null
}

export function getActiveMovies(movies) {
  return Array.isArray(movies)
    ? movies.filter((movie) => movie?.activa === true).map(mapMovie)
    : []
}

export function mapShowtimes(showtimes) {
  return Array.isArray(showtimes) ? showtimes.map(mapShowtime) : []
}

export function filterFutureShowtimes(showtimes, now = new Date()) {
  if (!Array.isArray(showtimes)) return []

  return showtimes.filter((showtime) => {
    if (typeof showtime.date !== 'string' || typeof showtime.time !== 'string') return false

    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(showtime.date)
    const timeMatch = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/.exec(showtime.time)
    if (!dateMatch || !timeMatch) return false

    const [, year, month, day] = dateMatch
    const [, hours, minutes, seconds = '0', fraction = ''] = timeMatch
    const milliseconds = Number((fraction + '000').slice(0, 3))
    const showtimeDate = new Date(
      Number(year), Number(month) - 1, Number(day),
      Number(hours), Number(minutes), Number(seconds), milliseconds,
    )

    if (
      showtimeDate.getFullYear() !== Number(year)
      || showtimeDate.getMonth() !== Number(month) - 1
      || showtimeDate.getDate() !== Number(day)
      || Number(hours) > 23
      || Number(minutes) > 59
      || Number(seconds) > 59
    ) return false

    return showtimeDate > now
  })
}

export function filterMoviesWithFutureShowtimes(movies, showtimes) {
  if (!Array.isArray(movies) || !Array.isArray(showtimes)) return []

  return movies.map((movie) => ({
    ...movie,
    showtimes: showtimes.filter((showtime) => showtime.movieId === movie.id),
  })).filter((movie) => movie.showtimes.length > 0)
}

export function buildShowtimeParams({ movieId, fecha } = {}) {
  const params = {
    ...(fecha ? { fecha } : {}),
    ...(movieId === undefined ? {} : { idPelicula: movieId }),
  }
  return Object.keys(params).length ? params : undefined
}

export function formatShowtimeDate(value) {
  if (typeof value !== 'string') return ''
  const datePart = value.slice(0, 10)
  const date = new Date(`${datePart}T12:00:00`)
  if (Number.isNaN(date.getTime())) return datePart

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatShowtimeTime(value) {
  return typeof value === 'string' ? value.slice(0, 5) : ''
}
