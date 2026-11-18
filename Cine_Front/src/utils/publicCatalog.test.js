import assert from 'node:assert/strict'
import test from 'node:test'
import { getAsyncState } from './asyncState.js'
import {
  buildShowtimeParams,
  formatShowtimeDate,
  formatShowtimeTime,
  getActiveMovies,
  mapShowtime,
  mapShowtimes,
} from './publicCatalog.js'

test('cartelera conserva sólo películas con activa true y adapta los campos documentados', () => {
  const movies = getActiveMovies([
    {
      idPelicula: 12,
      titulo: 'Los autos locos',
      duracion: 100,
      idClasificacion: 2,
      poster: 'https://cine.test/poster.jpg',
      sinopsis: 'Una historia.',
      activa: true,
    },
    { idPelicula: 13, titulo: 'Inactiva', activa: false },
    { idPelicula: 14, titulo: 'Sin estado', activa: null },
  ])

  assert.deepEqual(movies, [{
    id: 12,
    title: 'Los autos locos',
    duration: 100,
    classificationId: 2,
    poster: 'https://cine.test/poster.jpg',
    synopsis: 'Una historia.',
    active: true,
  }])
})

test('funciones usa sólo los campos del contrato y representa fecha y hora', () => {
  const response = {
    idFuncion: 250,
    fecha: '2026-11-20T00:00:00',
    hora: '18:00:00',
    subtitulada: false,
    idPelicula: 12,
    tituloPelicula: 'Los autos locos',
    idSala: 2,
    idIdioma: 1,
  }

  assert.deepEqual(mapShowtime(response), {
    id: 250,
    date: '2026-11-20T00:00:00',
    time: '18:00:00',
    isSubtitled: false,
    movieId: 12,
    movieTitle: 'Los autos locos',
    roomId: 2,
    languageId: 1,
  })
  assert.equal(mapShowtimes([response]).length, 1)
  assert.equal(formatShowtimeDate(response.fecha).includes('2026'), true)
  assert.equal(formatShowtimeTime(response.hora), '18:00')
})

test('vistas de datos distinguen carga, error, vacío y éxito', () => {
  assert.equal(getAsyncState({ isLoading: true, data: null }), 'loading')
  assert.equal(getAsyncState({ isLoading: false, error: new Error('falló'), data: null }), 'error')
  assert.equal(getAsyncState({ isLoading: false, data: [] }), 'empty')
  assert.equal(getAsyncState({ isLoading: false, data: [{ id: 1 }] }), 'success')
})

test('construye filtros de funciones solo con los parÃ¡metros documentados', () => {
  assert.equal(buildShowtimeParams(), undefined)
  assert.deepEqual(buildShowtimeParams({ fecha: '2026-11-20' }), { fecha: '2026-11-20' })
  assert.deepEqual(buildShowtimeParams({ movieId: 12 }), { idPelicula: 12 })
  assert.deepEqual(buildShowtimeParams({ fecha: '2026-11-20', movieId: 12 }), { fecha: '2026-11-20', idPelicula: 12 })
})
