import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, Input, Loading, PageHeader } from '../../components/common/index.js'
import RecordView from '../../components/transactions/RecordView.jsx'
import { createInvoice, getInvoice, getInvoices } from '../../services/invoiceService.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { emptyCatalogIds, getResourceId, isPositiveInteger, isValidPrice } from '../../utils/transactionData.js'

function InvoicesPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const admin = user?.role === 'Admin' || user?.isAdmin
  const root = admin ? '/admin/facturas' : '/cliente/facturas'
  const [retry, setRetry] = useState(0)
  const [state, setState] = useState({ loading: true, data: null, error: null })
  const [sale, setSale] = useState({ clientId: '', showtimeId: '', seatId: '', ticketType: emptyCatalogIds.ticketType, price: '', promotion: '', payment: emptyCatalogIds.paymentMethod, channel: emptyCatalogIds.salesChannel })
  const [saleState, setSaleState] = useState({ busy: false, message: '', error: false })
  const navigate = useNavigate()
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
    && isPositiveInteger(sale.ticketType)
    && isValidPrice(sale.price)
    && (!sale.promotion.trim() || isPositiveInteger(sale.promotion))
    && isPositiveInteger(sale.payment)
    && isPositiveInteger(sale.channel)
  const submitSale = async (event) => {
    event.preventDefault()
    if (!saleIsValid) {
      const invalidField = admin && !isPositiveInteger(sale.clientId) ? 'ID del cliente'
        : !isPositiveInteger(sale.showtimeId) ? 'ID de función'
          : !isPositiveInteger(sale.seatId) ? 'ID de butaca'
            : !isPositiveInteger(sale.ticketType) ? 'ID de tipo de entrada'
              : !isValidPrice(sale.price) ? 'precio'
                : sale.promotion.trim() && !isPositiveInteger(sale.promotion) ? 'ID de promoción'
                  : !isPositiveInteger(sale.payment) ? 'ID de forma de pago' : 'ID de canal de venta'
      setSaleState({ busy: false, message: `Corregí ${invalidField}: debe ser válido y, para los IDs, un entero positivo.`, error: true })
      return
    }
    setSaleState({ busy: true, message: '', error: false })
    const body = {
      ...(admin ? { idCliente: Number(sale.clientId) } : {}),
      idFormaPago: Number(sale.payment),
      idCanalVenta: Number(sale.channel),
      detalles: [{ idFuncion: Number(sale.showtimeId), idButaca: Number(sale.seatId), idTipoEntrada: Number(sale.ticketType), precio: Number(sale.price), idPromocion: sale.promotion ? Number(sale.promotion) : null }],
    }
    let response
    try {
      response = await createInvoice(body)
    } catch (error) {
      setSaleState({ busy: false, message: getApiErrorMessage(error), error: true })
      return
    }
    const invoiceId = getResourceId(response, 'idFactura')
    if (invoiceId) {
      setSaleState({ busy: false, message: 'La factura se registró correctamente.', error: false })
      navigate(root + '/' + invoiceId)
      return
    }
    setSaleState({ busy: true, message: 'La factura se registró correctamente. Actualizando el historial…', error: false })
    try {
      const refreshedInvoices = await getInvoices({ admin })
      setState({ loading: false, data: refreshedInvoices, error: null })
      setSaleState({ busy: false, message: 'La factura se registró correctamente y el historial se actualizó.', error: false })
    } catch (error) {
      setSaleState({ busy: false, message: 'La factura se registró correctamente, pero no se pudo actualizar el historial: ' + getApiErrorMessage(error), error: false })
    }
  }
  if (state.loading) return <main className="mx-auto max-w-7xl px-4 py-10"><Loading text="Cargando facturas…" /></main>
  if (state.error) return <main className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="No se pudieron cargar las facturas" description={getApiErrorMessage(state.error)} action={<Button onClick={() => setRetry((value) => value + 1)}>Reintentar</Button>} /></main>
  if (id) return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader title={`Factura #${getResourceId(state.data, 'idFactura') ?? id}`} description="Detalle devuelto por la API." actions={<Link className="text-sm text-primary hover:underline" to={root}>Volver al listado</Link>} /><RecordView kind="invoice" record={state.data} /></main>
  const records = Array.isArray(state.data) ? state.data : []
  return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><PageHeader title={admin ? 'Facturas' : 'Mis facturas'} description={admin ? 'Facturas registradas en el sistema.' : 'Consultá el historial de tus compras.'} />
    <Card><form className="space-y-4" onSubmit={submitSale}><div><h2 className="font-semibold text-text-primary">Venta directa</h2><p className="mt-1 text-sm text-text-secondary">Registra una factura sin reserva previa; el backend valida sala y disponibilidad.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{admin && <Input label="ID del cliente" type="number" min="1" step="1" required value={sale.clientId} onChange={updateSale('clientId')} error={!isPositiveInteger(sale.clientId) ? "Debe ser un entero mayor que cero." : ""} />}
        <Input label="ID de función" type="number" min="1" step="1" required value={sale.showtimeId} onChange={updateSale('showtimeId')} error={!isPositiveInteger(sale.showtimeId) ? "Debe ser un entero mayor que cero." : ""} />
        <Input label="ID de butaca" type="number" min="1" step="1" required value={sale.seatId} onChange={updateSale('seatId')} error={!isPositiveInteger(sale.seatId) ? "Debe ser un entero mayor que cero." : ""} />
        <Input label="ID de tipo de entrada" type="number" min="1" step="1" required value={sale.ticketType} onChange={updateSale('ticketType')} helperText="Catálogo sin endpoint; ingresá un ID existente." error={!isPositiveInteger(sale.ticketType) ? "Debe ser un entero mayor que cero." : ""} />
        <Input label="Precio" type="number" min="0" step="0.01" required value={sale.price} onChange={updateSale('price')} error={!isValidPrice(sale.price) ? "Ingresá un precio válido igual o mayor que cero." : ""} />
        <Input label="ID de promoción (opcional)" type="number" min="1" step="1" value={sale.promotion} onChange={updateSale('promotion')} error={sale.promotion && !isPositiveInteger(sale.promotion) ? "Debe ser un entero mayor que cero o quedar vacío." : ""} />
        <Input label="ID de forma de pago" type="number" min="1" step="1" required value={sale.payment} onChange={updateSale('payment')} helperText="Catálogo sin endpoint; ingresá un ID existente." error={!isPositiveInteger(sale.payment) ? "Debe ser un entero mayor que cero." : ""} />
        <Input label="ID de canal de venta" type="number" min="1" step="1" required value={sale.channel} onChange={updateSale('channel')} helperText="Catálogo sin endpoint; ingresá un ID existente." error={!isPositiveInteger(sale.channel) ? "Debe ser un entero mayor que cero." : ""} />
      </div>{saleState.message && <p role={saleState.error ? 'alert' : 'status'} className="text-sm text-text-primary">{saleState.message}</p>}<Button type="submit" loading={saleState.busy} disabled={!saleIsValid}>Registrar venta directa</Button>
    </form></Card>
    {records.length === 0 ? <EmptyState title="No hay facturas para mostrar" description="La API devolvió una lista vacía." /> : <div className="grid gap-4">{records.map((item, index) => {
      const resourceId = getResourceId(item, 'idFactura')
      return <div key={resourceId ?? index} className="space-y-2"><RecordView kind="invoice" record={item} compact />{resourceId ? <Link className="inline-flex min-h-9 items-center text-sm font-medium text-primary hover:underline" to={`${root}/${resourceId}`}>Ver detalle de factura #{resourceId}</Link> : <p className="text-xs text-text-secondary">El DTO no incluyó idFactura; no es posible abrir el detalle desde esta fila.</p>}</div>
    })}</div>}
  </main>
}

export default InvoicesPage
