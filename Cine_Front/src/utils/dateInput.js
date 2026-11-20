export function formatDateForInput(value) {
  if (!isValidIsoDate(value)) return ''
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function parseDateInput(value) {
  const match = typeof value === 'string' ? value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/) : null
  if (!match) return null

  const [, dayText, monthText, yearText] = match
  const day = Number(dayText)
  const month = Number(monthText)
  const year = Number(yearText)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null

  return `${yearText}-${monthText}-${dayText}`
}

function isValidIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}
