import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildDateRangeParams,
  isValidDateRange,
  isValidTopLimit,
  mapStatisticItems,
} from './adminStatistics.js'

test('adapta EstadisticaItemDto sin cambiar etiqueta ni valor', () => {
  assert.deepEqual(mapStatisticItems([
    { etiqueta: '2026-03', valor: 1520000 },
    { etiqueta: '18:00', valor: 71 },
  ]), [
    { label: '2026-03', value: 1520000 },
    { label: '18:00', value: 71 },
  ])
})

test('construye únicamente los parámetros de fecha presentes', () => {
  assert.deepEqual(buildDateRangeParams('2026-01-01', '2026-12-31'), {
    desde: '2026-01-01',
    hasta: '2026-12-31',
  })
  assert.deepEqual(buildDateRangeParams('2026-01-01', ''), { desde: '2026-01-01' })
  assert.deepEqual(buildDateRangeParams('', ''), {})
})

test('valida los límites del top y que el rango no esté invertido', () => {
  assert.equal(isValidTopLimit('1'), true)
  assert.equal(isValidTopLimit('50'), true)
  assert.equal(isValidTopLimit('0'), false)
  assert.equal(isValidTopLimit('51'), false)
  assert.equal(isValidTopLimit('2.5'), false)
  assert.equal(isValidDateRange('2026-01-01', '2026-01-31'), true)
  assert.equal(isValidDateRange('2026-02-01', '2026-01-31'), false)
})
