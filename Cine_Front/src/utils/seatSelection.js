export function mapSeats(seats) {
  if (!Array.isArray(seats)) return []

  return seats.map((seat) => ({
    id: seat.idButaca,
    row: seat.fila,
    number: seat.numero,
    occupied: seat.ocupada,
  }))
}

export function findShowtimeById(showtimes, showtimeId) {
  if (!Array.isArray(showtimes)) return null
  return showtimes.find((showtime) => String(showtime.id) === String(showtimeId)) ?? null
}

export function groupSeatsByRow(seats) {
  const rows = new Map()

  seats.forEach((seat) => {
    if (!rows.has(seat.row)) rows.set(seat.row, [])
    rows.get(seat.row).push(seat)
  })

  return [...rows.entries()]
    .sort(([rowA], [rowB]) => String(rowA).localeCompare(String(rowB), 'es', { numeric: true }))
    .map(([row, rowSeats]) => ({
      row,
      seats: rowSeats.sort((seatA, seatB) => seatA.number - seatB.number),
    }))
}

export function toggleSeatSelection(selectedIds, targetSeat, seats) {
  if (!targetSeat || targetSeat.occupied || !seats.some((seat) => seat.id === targetSeat.id)) {
    return selectedIds
  }

  return selectedIds.includes(targetSeat.id)
    ? selectedIds.filter((id) => id !== targetSeat.id)
    : [...selectedIds, targetSeat.id]
}

export function getSelectedSeats(selectedIds, seats) {
  const selectedSet = new Set(selectedIds)
  return groupSeatsByRow(seats.filter((seat) => !seat.occupied && selectedSet.has(seat.id)))
    .flatMap((row) => row.seats)
}
