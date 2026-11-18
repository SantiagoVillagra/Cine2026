import assert from 'node:assert/strict'
import test from 'node:test'
import {
  mapAdminMovies,
  updateMovieActive,
  validateMovieForm,
} from './adminMovies.js'
import { getAsyncState } from './asyncState.js'

const validForm = {
  titulo: 'Película de prueba',
  duracion: '125',
  idClasificacion: '2',
  idDirector: '8',
  fechaEstreno: '2026-10-01',
  poster: '/posters/pelicula.jpg',
  sinopsis: 'Una sinopsis.',
  idsGeneros: '1, 3',
  idsActores: '4, 9',
}

test('el adaptador de películas conserva los campos documentados del listado', () => {
  const movie = {
    idPelicula: 12,
    titulo: 'Los autos locos',
    duracion: 100,
    idClasificacion: 2,
    idDirector: 3,
    fechaEstreno: '2026-11-15',
    poster: '/poster.jpg',
    sinopsis: 'Sinopsis',
    activa: false,
    peliculasGeneros: [{ estructura: 'no se transforma' }],
  }

  assert.deepEqual(mapAdminMovies([movie]), [{
    idPelicula: 12,
    titulo: 'Los autos locos',
    duracion: 100,
    idClasificacion: 2,
    idDirector: 3,
    fechaEstreno: '2026-11-15',
    poster: '/poster.jpg',
    sinopsis: 'Sinopsis',
    activa: false,
  }])
})

test('valida y construye el request con los nombres y tipos del contrato', () => {
  const result = validateMovieForm(validForm)

  assert.deepEqual(result.errors, {})
  assert.deepEqual(result.payload, {
    titulo: 'Película de prueba',
    duracion: 125,
    idClasificacion: 2,
    idDirector: 8,
    fechaEstreno: '2026-10-01',
    poster: '/posters/pelicula.jpg',
    sinopsis: 'Una sinopsis.',
    idsGeneros: [1, 3],
    idsActores: [4, 9],
  })
})

test('envía las colecciones requeridas vacías cuando no se ingresan IDs', () => {
  const result = validateMovieForm({ ...validForm, idsGeneros: '', idsActores: '', sinopsis: '' })
  assert.deepEqual(result.payload.idsGeneros, [])
  assert.deepEqual(result.payload.idsActores, [])
  assert.equal('sinopsis' in result.payload, false)
})

test('valida campos obligatorios, rangos, fecha y formato de IDs', () => {
  const result = validateMovieForm({
    ...validForm,
    titulo: ' ',
    duracion: '601',
    idClasificacion: '0',
    idDirector: '1.5',
    fechaEstreno: '2026-02-30',
    poster: '',
    idsGeneros: '2, cero',
    idsActores: '-1',
  })

  assert.equal(result.payload, null)
  assert.deepEqual(Object.keys(result.errors).sort(), [
    'duracion', 'fechaEstreno', 'idClasificacion', 'idDirector', 'idsActores', 'idsGeneros', 'poster', 'titulo',
  ])
})

test('el cambio de estado actualiza sólo la película indicada después del éxito', () => {
  const movies = [
    { idPelicula: 1, activa: true },
    { idPelicula: 2, activa: false },
  ]

  assert.deepEqual(updateMovieActive(movies, 2, true), [
    { idPelicula: 1, activa: true },
    { idPelicula: 2, activa: true },
  ])
  assert.deepEqual(movies[1], { idPelicula: 2, activa: false })
})

test('el listado presenta correctamente carga, error, vacío y resultados', () => {
  assert.equal(getAsyncState({ isLoading: true, error: null, data: [] }), 'loading')
  assert.equal(getAsyncState({ isLoading: false, error: new Error('fallo'), data: [] }), 'error')
  assert.equal(getAsyncState({ isLoading: false, error: null, data: [] }), 'empty')
  assert.equal(getAsyncState({ isLoading: false, error: null, data: [{ idPelicula: 1 }] }), 'success')
})
