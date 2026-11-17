// Datos de demostración del dashboard. No representan operaciones reales ni un contrato de API.
const makePeriod = (summary, sales, activity, movies, showtimes) => ({
  summary,
  sales,
  activity,
  movies,
  showtimes,
})

export const dashboardPeriods = {
  day: makePeriod(
    { movies: 4, showtimes: 7, tickets: 186, salesAmount: 1488000 },
    [
      { label: '10 h', amount: 96000 },
      { label: '12 h', amount: 168000 },
      { label: '14 h', amount: 144000 },
      { label: '16 h', amount: 240000 },
      { label: '18 h', amount: 312000 },
      { label: '20 h', amount: 528000 },
    ],
    [
      { label: '10 h', tickets: 12 },
      { label: '12 h', tickets: 21 },
      { label: '14 h', tickets: 18 },
      { label: '16 h', tickets: 30 },
      { label: '18 h', tickets: 39 },
      { label: '20 h', tickets: 66 },
    ],
    [
      { title: 'La última luz', tickets: 62, salesAmount: 496000 },
      { title: 'Órbita de papel', tickets: 51, salesAmount: 408000 },
      { title: 'La ciudad sumergida', tickets: 43, salesAmount: 344000 },
    ],
    [
      { time: '18:20', movie: 'La última luz', room: 'Sala 1', format: '2D', tickets: 48 },
      { time: '20:00', movie: 'Órbita de papel', room: 'Sala 3', format: '3D', tickets: 36 },
      { time: '21:10', movie: 'La ciudad sumergida', room: 'Sala 2', format: '2D', tickets: 42 },
    ],
  ),
  week: makePeriod(
    { movies: 4, showtimes: 42, tickets: 1124, salesAmount: 8992000 },
    [
      { label: 'Lun', amount: 960000 },
      { label: 'Mar', amount: 1080000 },
      { label: 'Mié', amount: 1240000 },
      { label: 'Jue', amount: 1160000 },
      { label: 'Vie', amount: 1480000 },
      { label: 'Sáb', amount: 1760000 },
      { label: 'Dom', amount: 1312000 },
    ],
    [
      { label: 'Lun', tickets: 120 },
      { label: 'Mar', tickets: 135 },
      { label: 'Mié', tickets: 155 },
      { label: 'Jue', tickets: 145 },
      { label: 'Vie', tickets: 185 },
      { label: 'Sáb', tickets: 220 },
      { label: 'Dom', tickets: 164 },
    ],
    [
      { title: 'La última luz', tickets: 374, salesAmount: 2992000 },
      { title: 'Órbita de papel', tickets: 310, salesAmount: 2480000 },
      { title: 'La ciudad sumergida', tickets: 258, salesAmount: 2064000 },
    ],
    [
      { time: '18:20', movie: 'La última luz', room: 'Sala 1', format: '2D', tickets: 48 },
      { time: '20:00', movie: 'Órbita de papel', room: 'Sala 3', format: '3D', tickets: 36 },
      { time: '21:10', movie: 'La ciudad sumergida', room: 'Sala 2', format: '2D', tickets: 42 },
    ],
  ),
  month: makePeriod(
    { movies: 4, showtimes: 168, tickets: 4380, salesAmount: 35040000 },
    [
      { label: 'Sem. 1', amount: 7440000 },
      { label: 'Sem. 2', amount: 8160000 },
      { label: 'Sem. 3', amount: 9360000 },
      { label: 'Sem. 4', amount: 10080000 },
    ],
    [
      { label: 'Sem. 1', tickets: 930 },
      { label: 'Sem. 2', tickets: 1020 },
      { label: 'Sem. 3', tickets: 1170 },
      { label: 'Sem. 4', tickets: 1260 },
    ],
    [
      { title: 'La última luz', tickets: 1458, salesAmount: 11664000 },
      { title: 'Órbita de papel', tickets: 1200, salesAmount: 9600000 },
      { title: 'La ciudad sumergida', tickets: 1007, salesAmount: 8056000 },
    ],
    [
      { time: '18:20', movie: 'La última luz', room: 'Sala 1', format: '2D', tickets: 48 },
      { time: '20:00', movie: 'Órbita de papel', room: 'Sala 3', format: '3D', tickets: 36 },
      { time: '21:10', movie: 'La ciudad sumergida', room: 'Sala 2', format: '2D', tickets: 42 },
    ],
  ),
  year: makePeriod(
    { movies: 4, showtimes: 2016, tickets: 51240, salesAmount: 409920000 },
    [
      { label: 'Ene', amount: 28800000 },
      { label: 'Feb', amount: 31200000 },
      { label: 'Mar', amount: 33600000 },
      { label: 'Abr', amount: 32400000 },
      { label: 'May', amount: 36000000 },
      { label: 'Jun', amount: 38400000 },
      { label: 'Jul', amount: 40800000 },
      { label: 'Ago', amount: 36000000 },
      { label: 'Sep', amount: 33600000 },
      { label: 'Oct', amount: 36000000 },
      { label: 'Nov', amount: 36000000 },
      { label: 'Dic', amount: 40800000 },
    ],
    [
      { label: 'Ene', tickets: 3600 },
      { label: 'Feb', tickets: 3900 },
      { label: 'Mar', tickets: 4200 },
      { label: 'Abr', tickets: 4050 },
      { label: 'May', tickets: 4500 },
      { label: 'Jun', tickets: 4800 },
      { label: 'Jul', tickets: 5100 },
      { label: 'Ago', tickets: 4500 },
      { label: 'Sep', tickets: 4200 },
      { label: 'Oct', tickets: 4500 },
      { label: 'Nov', tickets: 4500 },
      { label: 'Dic', tickets: 5100 },
    ],
    [
      { title: 'La última luz', tickets: 17080, salesAmount: 136640000 },
      { title: 'Órbita de papel', tickets: 14000, salesAmount: 112000000 },
      { title: 'La ciudad sumergida', tickets: 11785, salesAmount: 94280000 },
    ],
    [
      { time: '18:20', movie: 'La última luz', room: 'Sala 1', format: '2D', tickets: 48 },
      { time: '20:00', movie: 'Órbita de papel', room: 'Sala 3', format: '3D', tickets: 36 },
      { time: '21:10', movie: 'La ciudad sumergida', room: 'Sala 2', format: '2D', tickets: 42 },
    ],
  ),
}

export const dashboardPeriodOptions = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
]
