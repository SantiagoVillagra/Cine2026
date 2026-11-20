import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, EmptyState, Input, Loading, PageHeader } from '../../components/common/index.js'
import RecordView from '../../components/transactions/RecordView.jsx'
import { cancelReservation, confirmReservation, getReservation, getReservations } from '../../services/reservationService.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { getReservationStatus, getResourceId, isPositiveInteger } from '../../utils/transactionData.js'

function ReservationsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const admin = user?.role === 'Admin' || user?.isAdmin
  const root = admin ? '/admin/reservas' : '/cliente/reservas'
  const [retry, setRetry] = useState(0)
  const [state, setState] = useState({ loading: true, data: null, error: null })
  const [busy, setBusy] = useState('')
  const [feedback, setFeedback] = useState('')
  const [completedAction, setCompletedAction] = useState(null)
  const [payment, setPayment] = useState('')
  const [channel, setChannel] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const request = id ? getReservation(id, { signal: controller.signal }) : getReservations({ admin, signal: controller.signal })
    request.then((data) => { if (!controller.signal.aborted) setState({ loading: false, data, error: null }) })
      .catch((error) => { if (!controller.signal.aborted) setState({ loading: false, data: null, error }) })
    return () => controller.abort()
  }, [id, admin, retry])

  const runAction = async (action) => {
    setBusy(action)
    setFeedback('')
    try {
      if (action === 'cancel') {
        await cancelReservation(id)
      } else {
        await confirmReservation(id, { idFormaPago: Number(payment), idCanalVenta: Number(channel) })
      }
    } catch (error) {
      setFeedback(getApiErrorMessage(error))
      setBusy('')
      return
    }

    setCompletedAction({ id: String(id), action })
    setFeedback(action === 'cancel'
      ? 'La cancelación se procesó correctamente.'
      : 'La reserva se confirmó y la factura fue generada.')
    try {
      const updated = await getReservation(id)
      setState({ loading: false, data: updated, error: null })
    } catch (error) {
      setFeedback((message) => message + ' No se pudieron actualizar los datos: ' + getApiErrorMessage(error))
    } finally { setBusy('') }
  }
  if (state.loading) return <main className="mx-auto max-w-7xl px-4 py-10"><Loading text="Cargando reservas…" /></main>
  if (state.error) return <main className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="No se pudieron cargar las reservas" description={getApiErrorMessage(state.error)} action={<Button onClick={() => setRetry((value) => value + 1)}>Reintentar</Button>} /></main>
  if (id) {
    const reservation = state.data
    const status = getReservationStatus(reservation)
    const actionCompleted = completedAction?.id === String(id) ? completedAction.action : null
    const canConfirm = status.label === 'Pendiente' && actionCompleted !== 'confirm' && actionCompleted !== 'cancel'
    const canCancel = ['Pendiente', 'Confirmada'].includes(status.label) && actionCompleted !== 'cancel'
    const invoiceId = getResourceId(reservation?.factura, 'idFactura') ?? reservation?.idFactura
    return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title={`Detalle de reserva #${getResourceId(reservation, 'idReserva') ?? id}`} description="Datos devueltos por la API para esta reserva." actions={<Link className="text-sm text-primary hover:underline" to={root}>Volver al listado</Link>} />
      <RecordView kind="reservation" record={reservation} />
      {feedback && <p role="status" className="rounded-md border border-border bg-surface p-3 text-sm text-text-primary">{feedback}</p>}
      {(canConfirm || canCancel) && <Card className="space-y-4"><h2 className="font-semibold">Acciones de reserva</h2>
        {canConfirm && <div className="grid gap-4 sm:grid-cols-2"><Input label="ID de forma de pago" type="number" min="1" step="1" value={payment} onChange={(event) => setPayment(event.target.value)} helperText="Catálogo sin endpoint. Ingresá un ID existente." error={!isPositiveInteger(payment) ? "Debe ser un entero mayor que cero." : ""} />
          <Input label="ID de canal de venta" type="number" min="1" step="1" value={channel} onChange={(event) => setChannel(event.target.value)} helperText="Catálogo sin endpoint. Ingresá un ID existente." error={!isPositiveInteger(channel) ? "Debe ser un entero mayor que cero." : ""} /></div>}
        <div className="flex flex-wrap gap-3">{canConfirm && <Button loading={busy === 'confirm'} disabled={Boolean(busy) || !isPositiveInteger(payment) || !isPositiveInteger(channel)} onClick={() => runAction('confirm')}>Confirmar y generar factura</Button>}
          {canCancel && <Button variant="danger" loading={busy === 'cancel'} disabled={Boolean(busy)} onClick={() => runAction('cancel')}>Cancelar reserva</Button>}</div>
      </Card>}
      {invoiceId && <Link className="text-primary hover:underline" to={`${admin ? '/admin' : '/cliente'}/facturas/${invoiceId}`}>Abrir factura #{invoiceId}</Link>}
    </main>
  }
  const records = Array.isArray(state.data) ? state.data : []
  return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <PageHeader title={admin ? 'Reservas' : 'Mis reservas'} description={admin ? 'Reservas registradas en el sistema.' : 'Consultá y administrá tus reservas.'} />
    {records.length === 0 ? <EmptyState title="No hay reservas para mostrar" description="La API devolvió una lista vacía." /> : <div className="grid gap-4">{records.map((item, index) => {
      const resourceId = getResourceId(item, 'idReserva')
      return <div key={resourceId ?? index} className="space-y-2"><RecordView kind="reservation" record={item} compact />
        {resourceId ? <Link className="inline-flex min-h-9 items-center text-sm font-medium text-primary hover:underline" to={`${root}/${resourceId}`}>Ver detalle de reserva #{resourceId}</Link> : <p className="text-xs text-text-secondary">El DTO no incluyó idReserva; no es posible abrir el detalle desde esta fila.</p>}
      </div>
    })}</div>}
  </main>
}

export default ReservationsPage
