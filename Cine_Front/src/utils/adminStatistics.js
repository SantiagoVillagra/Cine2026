export function mapStatisticItems(items) {
  if (!Array.isArray(items)) return []

  return items.map((item) => ({
    label: item.etiqueta,
    value: item.valor,
  }))
}

export function buildDateRangeParams(desde, hasta) {
  return {
    ...(desde ? { desde } : {}),
    ...(hasta ? { hasta } : {}),
  }
}

export function isValidTopLimit(value) {
  const limit = Number(value)
  return Number.isInteger(limit) && limit >= 1 && limit <= 50
}

export function isValidDateRange(desde, hasta) {
  return !desde || !hasta || desde <= hasta
}
