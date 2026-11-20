import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, Input, Loading, PageHeader } from '../../components/common/index.js'
import RecordView from '../../components/transactions/RecordView.jsx'
import { createInvoice, getInvoice, getInvoices } from '../../services/invoiceService.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useAlerts } from '../../hooks/useAlerts.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { getResourceId, isPositiveInteger } from '../../utils/transactionData.js'

function InvoicesPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const admin = user?.role === 'Admin' || user?.isAdmin
  const root = admin ? '/admin/facturas' : '/cliente/facturas'
  const [retry, setRetry] = useState(0)
  const [state, setState] = useState({ loading: true, data: null, error: null })
  const [sale, setSale] = useState({ clientId: '', showtimeId: '', seatId: '' })
  const [saleBusy, setSaleBusy] = useState(false)
  const navigate = useNavigate()
  const { showAlert } = useAlerts()
  useEffect(() => {
    const controller = new AbortController()
    const request = id ? getInvoice(id, { signal: controller.signal }) : getInvoices({ admin, signal: controller.signal })
    request.then((data) => { if (!controller.signal.aborted) setState({ loading: false, data, error: null }) })
      .catch((error) => { if (!controller.signal.aborted) setState({ loading: false, data: null, error }) })
    return () => controller.abort()
  }, [id, admin, retry])
  const updateSale = (field) => (event) => setSale((current) => ({ ...current, [field]: event.target.value }))
  const saleIsValid = (!admin || isPositiveInteger(sale.clientId))
    && isPositiveInteger(sale.showtimeId)
    && isPositiveInteger(sale.seatId)
  const submitSale = async (event) => {
    event.preventDefault()
    if (saleBusy) return
    if (!saleIsValid) {
      const invalidField = admin && !isPositiveInteger(sale.clientId) ? 'ID del cliente'
        : !isPositiveInteger(sale.showtimeId) ? 'ID de función'
          : 'ID de butaca'
      await showAlert({ type: 'error', title: 'Revisá los datos de la venta', message: `Corregí ${invalidField}: debe ser un entero positivo.` })
      return
    }
    setSaleBusy(true)
    const body = {
      ...(admin ? { idCliente: Number(sale.clientId) } : {}),
      idFormaPago: 1,
      idCanalVenta: 1,
      detalles: [{ idFuncion: Number(sale.showtimeId), idButaca: Number(sale.seatId), idTipoEntrada: 1, precio: 10000, idPromocion: null }],
    }
    let response
    try {
      response = await createInvoice(body)
    } catch (error) {
      setSaleBusy(false)
      await showAlert({ type: 'error', title: 'No se pudo registrar la venta', message: getApiErrorMessage(error) })
      return
    }
    const invoiceId = getResourceId(response, 'idFactura')
    if (invoiceId) {
      setSaleBusy(false)
      navigate(root + '/' + invoiceId)
      return
    }
    try {
      const refreshedInvoices = await getInvoices({ admin })
      setState({ loading: false, data: refreshedInvoices, error: null })
      await showAlert({ type: 'success', title: 'Venta registrada', message: 'La factura se registró correctamente y el historial se actualizó.' })
    } catch (error) {
      await showAlert({ type: 'warning', title: 'Venta registrada', message: 'La factura se registró correctamente, pero no se pudo actualizar el historial: ' + getApiErrorMessage(error) })
    } finally {
      setSaleBusy(false)
    }
  }
  if (state.loading) return <main className="mx-auto max-w-7xl px-4 py-10"><Loading text="Cargando facturas…" /></main>
  if (state.error) return <main className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="No se pudieron cargar las facturas" description={getApiErrorMessage(state.error)} action={<Button onClick={() => setRetry((value) => value + 1)}>Reintentar</Button>} /></main>
  if (id) return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader title={`Factura #${getResourceId(state.data, 'idFactura') ?? id}`} description="Detalle devuelto por la API." actions={<Link className="text-sm text-primary hover:underline" to={root}>Volver al listado</Link>} /><RecordView kind="invoice" record={state.data} /></main>
  const records = Array.isArray(state.data) ? state.data : []
  return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <PageHeader title={admin ? 'Facturas' : 'Mis facturas'} description={admin ? 'Facturas registradas en el sistema.' : 'Consultá el historial de tus compras.'} />
    {admin && <Card>
      <form className="space-y-4" onSubmit={submitSale}>
        <div>
          <h2 className="font-semibold text-text-primary">Venta directa</h2>
          <p className="mt-1 text-sm text-text-secondary">Registra una factura; el backend valida sala y disponibilidad.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="ID del cliente" type="number" min="1" step="1" required value={sale.clientId} onChange={updateSale('clientId')} error={!isPositiveInteger(sale.clientId) ? 'Debe ser un entero mayor que cero.' : ''} />
          <Input label="ID de función" type="number" min="1" step="1" required value={sale.showtimeId} onChange={updateSale('showtimeId')} error={!isPositiveInteger(sale.showtimeId) ? 'Debe ser un entero mayor que cero.' : ''} />
          <Input label="ID de butaca" type="number" min="1" step="1" required value={sale.seatId} onChange={updateSale('seatId')} error={!isPositiveInteger(sale.seatId) ? 'Debe ser un entero mayor que cero.' : ''} />
        </div>
        <Button type="submit" loading={saleBusy} disabled={!saleIsValid}>Registrar venta directa</Button>
      </form>
    </Card>}
    {records.length === 0
      ? <EmptyState title="No hay facturas para mostrar" description="La API devolvió una lista vacía." />
      : <div className="grid gap-4">{records.map((item, index) => {
        const resourceId = getResourceId(item, 'idFactura')
        return <RecordView key={resourceId ?? index} kind="invoice" record={item} />
      })}</div>}
  </main>
}

export default InvoicesPage