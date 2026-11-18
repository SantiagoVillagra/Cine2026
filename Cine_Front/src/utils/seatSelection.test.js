import assert from 'node:assert/strict'
import test from 'node:test'
import { getAsyncState } from './asyncState.js'
import {
  getSelectedSeats,
  findShowtimeById,
  groupSeatsByRow,
  mapSeats,
  toggleSeatSelection,
} from './seatSelection.js'

const seatResponse = [
  { idButaca: 14, fila: 'B', numero: 2, ocupada: true },
  { idButaca: 12, fila: 'A', numero: 2, ocupada: false },
  { idButaca: 13, fila: 'B', numero: 1, ocupada: false },
  { idButaca: 11, fila: 'A', numero: 1, ocupada: false },
]

test('adapta las butacas usando ocupada como disponibilidad por función', () => {
  assert.deepEqual(mapSeats(seatResponse), [
    { id: 14, row: 'B', number: 2, occupied: true },
    { id: 12, row: 'A', number: 2, occupied: false },
    { id: 13, row: 'B', number: 1, occupied: false },
    { id: 11, row: 'A', number: 1, occupied: false },
  ])
})

test('ordena el mapa por fila y número de butaca', () => {
  const rows = groupSeatsByRow(mapSeats(seatResponse))
  assert.deepEqual(rows.map(({ row, seats }) => [row, seats.map((seat) => seat.number)]), [
    ['A', [1, 2]],
    ['B', [1, 2]],
  ])
})

test('recupera metadatos de función por su id sin asumir un endpoint de detalle', () => {
  const showtimes = [{ id: 52, movieTitle: 'La película', roomId: 1 }]
  assert.deepEqual(findShowtimeById(showtimes, '52'), showtimes[0])
  assert.equal(findShowtimeById(showtimes, '404'), null)
})

test('permite seleccionar y deseleccionar disponibles, pero bloquea ocupadas y no listadas', () => {
  const seats = mapSeats(seatResponse)
  const occupied = seats.find((seat) => seat.occupied)
  const available = seats.find((seat) => seat.id === 12)
  const unknown = { id: 999, occupied: false }

  assert.deepEqual(toggleSeatSelection([], occupied, seats), [])
  assert.deepEqual(toggleSeatSelection([], unknown, seats), [])
  assert.deepEqual(toggleSeatSelection([], available, seats), [12])
  assert.deepEqual(toggleSeatSelection([12], available, seats), [])
})

test('el resumen sólo incluye butacas disponibles seleccionadas', () => {
  const seats = mapSeats(seatResponse)
  assert.deepEqual(getSelectedSeats([14, 13, 12], seats).map((seat) => seat.id), [12, 13])
})

test('el máximo natural de selección es la cantidad de butacas disponibles', () => {
  const seats = mapSeats(seatResponse)
  const available = seats.filter((seat) => !seat.occupied)
  const selected = available.reduce((ids, seat) => toggleSeatSelection(ids, seat, seats), [])

  assert.equal(selected.length, available.length)
  assert.equal(selected.length, 3)
})

test('la consulta contempla carga, error y respuesta sin butacas', () => {
  assert.equal(getAsyncState({ isLoading: true, error: null, data: [] }), 'loading')
  assert.equal(getAsyncState({ isLoading: false, error: new Error('API no disponible'), data: [] }), 'error')
  assert.equal(getAsyncState({ isLoading: false, error: null, data: [] }), 'empty')
})
