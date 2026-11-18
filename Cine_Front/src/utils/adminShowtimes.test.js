import assert from 'node:assert/strict'
import test from 'node:test'
import { getAsyncState } from './asyncState.js'
import { formatShowtimeDate, mapAdminShowtimes, requestShowtimeCreation, validateShowtimeForm } from './adminShowtimes.js'

const validForm = {
  fecha: '2026-11-20',
  idHoraFuncion: '2',
  subtitulada: 'false',
  idPelicula: '12',
  idSala: '2',
  idIdioma: '1',
}

test('adapta únicamente los campos de respuesta documentados', () => {
  assert.deepEqual(mapAdminShowtimes([{
    idFuncion: 250, fecha: '2026-11-20T00:00:00', hora: '18:00:00', subtitulada: false,
    idPelicula: 12, tituloPelicula: 'Los autos locos', idSala: 2, idIdioma: 1,
    detalleInventado: 'se ignora',
  }]), [{
    idFuncion: 250, fecha: '2026-11-20T00:00:00', hora: '18:00:00', subtitulada: false,
    idPelicula: 12, tituloPelicula: 'Los autos locos', idSala: 2, idIdioma: 1,
  }])
  assert.deepEqual(mapAdminShowtimes(null), [])
})

test('valida y construye el body exacto documentado para crear', () => {
  const result = validateShowtimeForm(validForm)
  assert.deepEqual(result.errors, {})
  assert.deepEqual(result.payload, {
    fecha: '2026-11-20', idHoraFuncion: 2, subtitulada: false,
    idPelicula: 12, idSala: 2, idIdioma: 1,
  })
})

test('rechaza fecha inválida, IDs no positivos y subtitulación sin elegir', () => {
  const result = validateShowtimeForm({ ...validForm, fecha: '2026-02-30', idSala: '0', idIdioma: '1.2', subtitulada: '' })
  assert.equal(result.payload, null)
  assert.deepEqual(Object.keys(result.errors).sort(), ['fecha', 'idIdioma', 'idSala', 'subtitulada'])
})

test('formatea fecha ISO de respuesta y cubre estados de consulta', () => {
  assert.match(formatShowtimeDate('2026-11-20T00:00:00'), /2026/)
  assert.equal(getAsyncState({ isLoading: true, error: null, data: [] }), 'loading')
  assert.equal(getAsyncState({ isLoading: false, error: new Error('fallo'), data: [] }), 'error')
  assert.equal(getAsyncState({ isLoading: false, error: null, data: [] }), 'empty')
  assert.equal(getAsyncState({ isLoading: false, error: null, data: [{ idFuncion: 1 }] }), 'success')
})

test('el alta reconoce respuesta exitosa y traduce un rechazo del servicio a estado de error', async () => {
  const payload = validateShowtimeForm(validForm).payload
  const success = await requestShowtimeCreation(payload, async (body) => ({ idFuncion: 250, body }))
  assert.equal(success.status, 'success')
  assert.equal(success.data.idFuncion, 250)
  assert.deepEqual(success.data.body, payload)

  const failure = new Error('Conflicto de horario')
  const failed = await requestShowtimeCreation(payload, async () => { throw failure })
  assert.equal(failed.status, 'error')
  assert.equal(failed.error, failure)
})
