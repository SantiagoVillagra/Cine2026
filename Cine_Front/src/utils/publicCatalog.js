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

export function getActiveMovies(movies) {
  return Array.isArray(movies)
    ? movies.filter((movie) => movie?.activa === true).map(mapMovie)
    : []
}

export function mapShowtimes(showtimes) {
  return Array.isArray(showtimes) ? showtimes.map(mapShowtime) : []
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
