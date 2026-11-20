import { Card } from '../common/index.js'
import { formatData, getResourceId } from '../../utils/transactionData.js'

const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

function formatMoney(value) {
  return money.format(Number(value) || 0)
}

function formatDateTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date).replace(',', ' ·')
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function formatTime(value) {
  return typeof value === 'string' ? value.slice(0, 5) : ''
}

function seatLabel(detail) {
  if (detail.fila && detail.numeroButaca) return `Fila ${detail.fila} butaca ${detail.numeroButaca}`
  return 'Butaca'
}

// Agrupa los detalles de la factura por función: una factura puede tener entradas de funciones distintas.
function groupByShowtime(details) {
  const groups = new Map()
  details.forEach((detail) => {
    if (!groups.has(detail.idFuncion)) {
      groups.set(detail.idFuncion, {
        key: detail.idFuncion,
        pelicula: detail.pelicula,
        fecha: detail.fecha,
        hora: detail.hora,
        seats: [],
      })
    }
    groups.get(detail.idFuncion).seats.push(detail)
  })
  return [...groups.values()].map((group) => ({
    ...group,
    seats: group.seats.sort((a, b) =>
      String(a.fila).localeCompare(String(b.fila)) || a.numeroButaca - b.numeroButaca),
  }))
}

function InvoiceDetails({ details }) {
  if (!Array.isArray(details) || details.length === 0) return <span>Sin entradas</span>
  return <div className="space-y-3">
    {groupByShowtime(details).map((group) => <div key={group.key} className="rounded-lg border border-border bg-surface-secondary p-3">
      <p className="text-xs text-text-secondary">Función</p>
      <p className="font-semibold text-text-primary">{group.pelicula}</p>
      <p className="text-sm text-text-secondary">{formatDate(group.fecha)} · {formatTime(group.hora)} hs</p>
      <p className="mt-3 text-xs text-text-secondary">Butacas</p>
      <ul className="mt-1 flex flex-wrap gap-2">
        {group.seats.map((seat) => <li
          key={seat.idDetalleFactura ?? `${seat.idFuncion}-${seat.idButaca}`}
          className="rounded-md border border-border px-2 py-1 text-xs font-medium text-text-primary"
        >{seatLabel(seat)}</li>)}
      </ul>
    </div>)}
  </div>
}

function Field({ label, wide = false, children }) {
  return <div className={`min-w-0 ${wide ? 'sm:col-span-2' : ''}`}>
    <dt className="text-xs text-text-secondary">{label}</dt>
    <dd className="mt-1 break-words text-text-primary">{children}</dd>
  </div>
}

function RecordView({ record }) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return <Card>{formatData(record)}</Card>
  const id = getResourceId(record, 'idFactura')

  return <Card className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-semibold text-text-primary">{`Factura ${id ? `#${id}` : ''}`}</h2>
    </div>
    <dl className="grid gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
      <Field label="Cliente">{record.nombreCliente}</Field>
      <Field label="Fecha de emisión">{formatDateTime(record.fechaHoraEmision)}</Field>
      <Field label="Detalle de la compra" wide><InvoiceDetails details={record.detallesFacturas} /></Field>
      <Field label="Precio total">{formatMoney(record.precioTotal)}</Field>
    </dl>
  </Card>
}

export default RecordView