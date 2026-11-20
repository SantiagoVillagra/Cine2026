import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Clapperboard, Ticket } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import SeatMap from '../../components/seats/SeatMap.jsx'
import { Badge, Button, Card, EmptyState, Loading, PageHeader } from '../../components/common/index.js'
import { getShowtimes } from '../../services/publicCatalogService.js'
import { getShowtimeSeats } from '../../services/seatService.js'
import { getAsyncState } from '../../utils/asyncState.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { createInvoice } from '../../services/invoiceService.js'
import { getResourceId, isPositiveInteger } from '../../utils/transactionData.js'
import { formatShowtimeDate, formatShowtimeTime, mapShowtimes } from '../../utils/publicCatalog.js'
import { findShowtimeById, getSelectedSeats, mapSeats, toggleSeatSelection } from '../../utils/seatSelection.js'

function SeatSelectionPage() {
  const { funcionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const routeShowtime = location.state?.showtime
  const hasRouteShowtime = routeShowtime && String(routeShowtime.id) === String(funcionId)
  const [retryKey, setRetryKey] = useState(0)
  const [seatState, setSeatState] = useState({ requestKey: null, isLoading: true, error: null, data: [] })
  const [functionState, setFunctionState] = useState({ requestKey: null, isLoading: true, error: null, notFound: false, data: null })
  const [selectionState, setSelectionState] = useState({ requestKey: null, ids: [] })
  const [submitting, setSubmitting] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const submissionLock = useRef(false)
  const requestKey = `${funcionId}:${retryKey}`

  useEffect(() => {
    const controller = new AbortController()

    getShowtimeSeats(funcionId, { signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return

        const seats = mapSeats(response)
        setSeatState({ requestKey, isLoading: false, error: null, data: seats })
        setSelectionState((current) => ({
          requestKey,
          ids: current.requestKey === requestKey
            ? current.ids.filter((id) => seats.some((seat) => seat.id === id && !seat.occupied))
            : [],
        }))
      })
      .catch((error) => {
        if (!controller.signal.aborted) setSeatState({ requestKey, isLoading: false, error, data: [] })
      })

    if (!hasRouteShowtime) {
      getShowtimes({ signal: controller.signal })
        .then((response) => {
          if (controller.signal.aborted) return

          const showtime = findShowtimeById(mapShowtimes(response), funcionId)
          setFunctionState({ requestKey, isLoading: false, error: null, notFound: !showtime, data: showtime ?? null })
        })
        .catch((error) => {
          if (!controller.signal.aborted) {
            setFunctionState({
              requestKey,
              isLoading: false,
              error,
              notFound: error.response?.status === 404,
              data: null,
            })
          }
        })
    }

    return () => controller.abort()
  }, [funcionId, hasRouteShowtime, requestKey])

  const currentSeatState = seatState.requestKey === requestKey
    ? seatState
    : { isLoading: true, error: null, data: [] }
  const currentFunctionState = hasRouteShowtime
    ? { isLoading: false, error: null, notFound: false, data: routeShowtime }
    : functionState.requestKey === requestKey
      ? functionState
      : { isLoading: true, error: null, notFound: false, data: null }
  const seatStatus = getAsyncState(currentSeatState)
  const selectedSeatIds = selectionState.requestKey === requestKey ? selectionState.ids : []
  const selectedSeats = getSelectedSeats(selectedSeatIds, currentSeatState.data)
  const functionInfo = currentFunctionState.data
  const functionNotFound = currentFunctionState.notFound || currentSeatState.error?.response?.status === 404
  const isLoading = currentSeatState.isLoading || currentFunctionState.isLoading
  const moviePath = functionInfo?.movieId ? `/pelicula/${functionInfo.movieId}#funciones` : '/'

  const toggleSeat = (seat) => {
    setSelectionState((current) => {
      const ids = current.requestKey === requestKey ? current.ids : []
      return { requestKey, ids: toggleSeatSelection(ids, seat, currentSeatState.data) }
    })
  }

  const submitPurchase = async () => {
    if (!selectedSeats.length || submissionLock.current || !isPositiveInteger(funcionId)) return
    submissionLock.current = true
    setSubmitting(true)
    setActionMessage('')
    const body = {
      idFormaPago: 1,
      idCanalVenta: 1,
      detalles: selectedSeats.map((seat) => ({
        idFuncion: Number(funcionId),
        idButaca: seat.id,
        idTipoEntrada: 1,
        precio: 10000,
        idPromocion: null,
      })),
    }
    try {
      const response = await createInvoice(body)
      const resourceId = getResourceId(response, 'idFactura')
      if (resourceId) navigate(`/cliente/facturas/${resourceId}`, { state: { created: true } })
      else setActionMessage('La compra se registró correctamente. La API no incluyó un identificador de factura; podés verificar el resultado en Mis compras.')
    } catch (error) {
      if (error.response?.status === 409) {
        try {
          const freshSeats = mapSeats(await getShowtimeSeats(funcionId))
          setSeatState({ requestKey, isLoading: false, error: null, data: freshSeats })
          setSelectionState((current) => ({
            requestKey,
            ids: current.ids.filter((seatId) => freshSeats.some((seat) => seat.id === seatId && !seat.occupied)),
          }))
          setActionMessage('La disponibilidad cambió. Actualizamos las butacas; revisá tu selección antes de volver a intentar.')
        } catch (refreshError) {
          setActionMessage(`La disponibilidad cambió, pero no se pudo actualizar el mapa. ${getApiErrorMessage(refreshError)}`)
        }
      } else {
        setActionMessage(getApiErrorMessage(error))
      }
    } finally {
      submissionLock.current = false
      setSubmitting(false)
    }
  }

  return (
    <main>
      <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link to={moviePath} className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-offset-4">
          <ArrowLeft size={16} aria-hidden="true" /> Volver a funciones
        </Link>

        <PageHeader
          title="Elegí tus butacas"
          description="Seleccioná una o varias butacas disponibles para esta función."
          actions={<Badge variant="info">Función #{funcionId}</Badge>}
        />

        {functionInfo && (
          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-primary/10 p-2.5 text-primary"><Clapperboard size={19} aria-hidden="true" /></span>
              <div>
                <h2 className="font-semibold text-text-primary">{functionInfo.movieTitle || 'Película'}</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {formatShowtimeDate(functionInfo.date)} · {formatShowtimeTime(functionInfo.time)} · Sala {functionInfo.roomId} · Idioma {functionInfo.languageId}
                  {functionInfo.isSubtitled ? ' · subtitulada' : ''}
                </p>
              </div>
            </div>
            <Badge variant="default">Disponibilidad por función</Badge>
          </Card>
        )}

        {functionNotFound && (
          <EmptyState
            title="No encontramos esa función"
            description={`La función ${funcionId} no existe o ya no está disponible para consultar sus butacas.`}
            action={<Link to={moviePath}><Button variant="outline">Volver a funciones</Button></Link>}
          />
        )}

        {!functionNotFound && isLoading && <div className="flex justify-center py-16"><Loading text="Consultando disponibilidad de butacas…" /></div>}

        {!functionNotFound && !isLoading && seatStatus === 'error' && (
          <EmptyState
            title="No se pudo consultar la disponibilidad"
            description={getApiErrorMessage(currentSeatState.error)}
            action={<Button onClick={() => setRetryKey((key) => key + 1)}>Reintentar</Button>}
          />
        )}

        {!functionNotFound && !isLoading && currentFunctionState.error && seatStatus !== 'error' && (
          <div className="flex flex-col gap-3 rounded-lg border border-warning/50 bg-warning/10 px-4 py-3 text-sm text-text-primary sm:flex-row sm:items-center sm:justify-between" role="status">
            <span>No se pudo recuperar la información completa de la función. Se muestra el identificador y la disponibilidad obtenida.</span>
            <Button variant="outline" size="small" onClick={() => setRetryKey((key) => key + 1)}>Reintentar</Button>
          </div>
        )}

        {!functionNotFound && !isLoading && seatStatus === 'empty' && (
          <EmptyState title="Esta función no tiene butacas para mostrar" description="La API devolvió una lista vacía para esta función." />
        )}

        {!functionNotFound && !isLoading && seatStatus === 'success' && (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <Card className="space-y-7 overflow-hidden p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-text-primary">Mapa de la sala</h2>
                  <p className="mt-1 text-sm text-text-secondary">{currentSeatState.data.filter((seat) => !seat.occupied).length} butacas disponibles</p>
                </div>
                <Badge variant="info">Esquemático</Badge>
              </div>
              <SeatMap seats={currentSeatState.data} selectedIds={selectedSeatIds} onToggle={toggleSeat} />
            </Card>

            <Card className="space-y-5 xl:sticky xl:top-6">
              <div className="flex items-center gap-2">
                <Ticket size={18} className="text-primary" aria-hidden="true" />
                <h2 className="font-semibold text-text-primary">Resumen de selección</h2>
              </div>
              <p className="text-sm text-text-secondary" aria-live="polite">
                {selectedSeats.length === 0
                  ? 'Todavía no seleccionaste butacas.'
                  : `${selectedSeats.length} ${selectedSeats.length === 1 ? 'butaca seleccionada' : 'butacas seleccionadas'}.`}
              </p>
              {selectedSeats.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Butacas seleccionadas">
                  {selectedSeats.map((seat) => <li key={seat.id}><Badge variant="danger">Fila {seat.row} · Butaca {seat.number}</Badge></li>)}
                </ul>
              )}
              <div className="grid gap-4 border-t border-border pt-4">
                {actionMessage && <p className="text-sm text-text-primary" role="status">{actionMessage}</p>}
                <Button loading={submitting} disabled={!selectedSeats.length || submitting || !isPositiveInteger(funcionId)} onClick={submitPurchase}>Comprar entradas</Button>
                <p className="text-xs leading-5 text-text-secondary">La API vuelve a validar disponibilidad. No se procesa un pago externo.</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}

export default SeatSelectionPage
