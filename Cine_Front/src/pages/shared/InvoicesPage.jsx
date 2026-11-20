import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, DatePicker, EmptyState, Input, Loading, PageHeader } from '../../components/common/index.js'
import RecordView from '../../components/transactions/RecordView.jsx'
import { getInvoice, getInvoices } from '../../services/invoiceService.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { getResourceId } from '../../utils/transactionData.js'

function normalizeName(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('es-AR')
}

function getInvoiceDateKey(value) {
  if (typeof value !== 'string' || !value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const emptyFilters = { clientName: '', invoiceId: '', from: '', to: '' }

function InvoicesPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const admin = user?.role === 'Admin' || user?.isAdmin
  const root = admin ? '/admin/facturas' : '/cliente/facturas'
  const [retry, setRetry] = useState(0)
  const [state, setState] = useState({ loading: true, data: null, error: null })
  const [filters, setFilters] = useState(emptyFilters)
  const [invalidDates, setInvalidDates] = useState({ from: false, to: false })

  useEffect(() => {
    const controller = new AbortController()
    const request = id ? getInvoice(id, { signal: controller.signal }) : getInvoices({ admin, signal: controller.signal })
    request.then((data) => { if (!controller.signal.aborted) setState({ loading: false, data, error: null }) })
      .catch((error) => { if (!controller.signal.aborted) setState({ loading: false, data: null, error }) })
    return () => controller.abort()
  }, [id, admin, retry])

  if (state.loading) return <main className="mx-auto max-w-7xl px-4 py-10"><Loading text="Cargando facturas…" /></main>
  if (state.error) return <main className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="No se pudieron cargar las facturas" description={getApiErrorMessage(state.error)} action={<Button onClick={() => setRetry((value) => value + 1)}>Reintentar</Button>} /></main>
  if (id) return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader title={`Factura #${getResourceId(state.data, 'idFactura') ?? id}`} description="Detalle devuelto por la API." actions={<Link className="text-sm text-primary hover:underline" to={root}>Volver al listado</Link>} /><RecordView kind="invoice" record={state.data} /></main>

  const records = Array.isArray(state.data) ? state.data : []
  const normalizedClientName = normalizeName(filters.clientName)
  const invoiceIdQuery = filters.invoiceId.trim()
  const rangeInvalid = Boolean(filters.from && filters.to && filters.from > filters.to)
  const filteredRecords = admin
    ? records.filter((invoice) => {
      const invoiceId = String(getResourceId(invoice, 'idFactura') ?? '')
      const invoiceDate = getInvoiceDateKey(invoice.fechaHoraEmision)
      const matchesName = !normalizedClientName || normalizeName(invoice.nombreCliente).includes(normalizedClientName)
      const matchesId = !invoiceIdQuery || invoiceId.includes(invoiceIdQuery)
      const matchesFrom = !filters.from || invoiceDate >= filters.from
      const matchesTo = !filters.to || invoiceDate <= filters.to
      return matchesName && matchesId && matchesFrom && matchesTo
    })
    : records

  const clearFilters = () => {
    setFilters(emptyFilters)
    setInvalidDates({ from: false, to: false })
  }

  return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <PageHeader title={admin ? 'Facturas' : 'Mis facturas'} description={admin ? 'Facturas registradas en el sistema.' : 'Consultá el historial de tus compras.'} />
    {admin && <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="font-semibold text-text-primary">Filtrar facturas</h2><p className="mt-1 text-sm text-text-secondary">Combiná nombre, ID y fecha de emisión.</p></div>
        <Button type="button" variant="outline" onClick={clearFilters}>Limpiar filtros</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="Nombre del cliente" type="search" value={filters.clientName} onChange={(event) => setFilters((current) => ({ ...current, clientName: event.target.value }))} placeholder="Buscar cliente" />
        <Input label="ID de factura" type="search" inputMode="numeric" value={filters.invoiceId} onChange={(event) => setFilters((current) => ({ ...current, invoiceId: event.target.value }))} placeholder="Buscar ID" />
        <DatePicker label="Desde" value={filters.from} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} onValidityChange={(valid) => setInvalidDates((current) => ({ ...current, from: !valid }))} error={invalidDates.from ? 'Ingresá una fecha válida.' : undefined} />
        <DatePicker label="Hasta" value={filters.to} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} onValidityChange={(valid) => setInvalidDates((current) => ({ ...current, to: !valid }))} error={invalidDates.to ? 'Ingresá una fecha válida.' : undefined} />
      </div>
      {rangeInvalid && <p className="text-sm text-danger" role="alert">La fecha “Desde” debe ser anterior o igual a “Hasta”.</p>}
    </Card>}
    {records.length === 0
      ? <EmptyState title="No hay facturas para mostrar" description="La API devolvió una lista vacía." />
      : filteredRecords.length === 0 || rangeInvalid || (admin && (invalidDates.from || invalidDates.to))
        ? <EmptyState title="No hay facturas que coincidan" description="Probá modificar los filtros o limpiarlos para ver todas las facturas." />
        : <div className="grid gap-4">{filteredRecords.map((item, index) => {
          const resourceId = getResourceId(item, 'idFactura')
          return <RecordView key={resourceId ?? index} kind="invoice" record={item} />
        })}</div>}
  </main>
}

export default InvoicesPage
