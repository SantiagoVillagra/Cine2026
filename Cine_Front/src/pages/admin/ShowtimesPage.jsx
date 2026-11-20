import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Badge, Button, Card, DatePicker, EmptyState, Loading, PageHeader } from '../../components/common/index.js'
import { deleteShowtime, getAdminShowtimes } from '../../services/adminShowtimeService.js'
import { getMovies } from '../../services/publicCatalogService.js'
import { getAsyncState } from '../../utils/asyncState.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { filterUpcomingActiveShowtimes, formatShowtimeDate, mapAdminShowtimes } from '../../utils/adminShowtimes.js'
import { useAlerts } from '../../hooks/useAlerts.js'

const initialFilters = { fecha: '' }

function ShowtimesPage() {
  const [draft, setDraft] = useState(initialFilters)
  const [filters, setFilters] = useState(initialFilters)
  const [invalidDate, setInvalidDate] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [result, setResult] = useState({ key: null, data: [], error: null })
  const [pendingId, setPendingId] = useState(null)
  const operationLock = useRef(false)
  const { showAlert } = useAlerts()
  const requestKey = `${filters.fecha}|${retryKey}`

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      getAdminShowtimes({ fecha: filters.fecha || undefined, signal: controller.signal }),
      getMovies({ signal: controller.signal }),
    ])
      .then(([showtimes, movies]) => {
        if (!controller.signal.aborted) {
          const mappedShowtimes = mapAdminShowtimes(showtimes)
          setResult({ key: requestKey, data: filterUpcomingActiveShowtimes(mappedShowtimes, movies), error: null })
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, data: [], error })
      })
    return () => controller.abort()
  }, [filters, retryKey, requestKey])

  const current = result.key === requestKey ? result : null
  const state = !current ? 'loading' : getAsyncState({ isLoading: false, error: current.error, data: current.data })

  const applyFilters = (event) => {
    event.preventDefault()
    if (invalidDate) {
      return
    }
    setFilters({ ...draft })
  }

  const clearFilters = () => {
    setDraft(initialFilters)
    setFilters(initialFilters)
    setInvalidDate(false)
  }

  const requestShowtimeDeletion = async (showtime) => {
    if (operationLock.current) return
    operationLock.current = true
    setPendingId(showtime.idFuncion)

    try {
      const confirmed = await showAlert({
        type: 'confirm',
        title: 'Dar de baja función',
        message: `¿Confirmás dar de baja la función #${showtime.idFuncion} de «${showtime.tituloPelicula || 'Película'}», programada para el ${formatShowtimeDate(showtime.fecha)} a las ${showtime.hora}?`,
        confirmLabel: 'Confirmar baja',
        cancelLabel: 'Cancelar',
      })
      if (!confirmed) return

      await deleteShowtime(showtime.idFuncion)
      setResult((state) => ({
        ...state,
        data: state.data.filter((item) => item.idFuncion !== showtime.idFuncion),
      }))
      await showAlert({
        type: 'success',
        title: 'Función dada de baja',
        message: `La función #${showtime.idFuncion} se eliminó correctamente.`,
      })
    } catch (error) {
      await showAlert({
        type: 'error',
        title: 'No se pudo dar de baja la función',
        message: getApiErrorMessage(error, 'No se pudo eliminar la función.'),
      })
    } finally {
      operationLock.current = false
      setPendingId(null)
    }
  }

  return <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <PageHeader title="Funciones" description="Consultá la programación registrada y filtrá por los criterios disponibles en la API."
      actions={<Link className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-text-primary hover:bg-primary-hover" to="/admin/funciones/nueva"><Plus size={16} />Nueva función</Link>} />
    <Card className="space-y-4">
      <div><h2 className="font-semibold text-text-primary">Filtros</h2><p className="mt-1 text-sm text-text-secondary">Filtrá las funciones por fecha.</p></div>
      <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={applyFilters}>
        <div className="w-full max-w-sm"><DatePicker label="Fecha" value={draft.fecha} onChange={(event) => setDraft((value) => ({ ...value, fecha: event.target.value }))} onValidityChange={(valid) => setInvalidDate(!valid)} error={invalidDate ? 'Ingresá una fecha válida.' : undefined} showFormatHint={false} /></div>
        <div className="flex gap-2"><Button type="submit">Aplicar</Button><Button type="button" variant="outline" onClick={clearFilters}>Limpiar</Button></div>
      </form>
    </Card>
    {state === 'loading' && <Card className="flex min-h-64 items-center justify-center"><Loading text="Cargando funciones…" /></Card>}
    {state === 'error' && <EmptyState title="No se pudo cargar la programación" description={getApiErrorMessage(current.error)} action={<Button variant="outline" icon={<RefreshCw size={16} />} onClick={() => setRetryKey((key) => key + 1)}>Reintentar</Button>} />}
    {state === 'empty' && <EmptyState title="No hay funciones para mostrar" description="La API no devolvió funciones para los filtros seleccionados." />}
    {state === 'success' && <Card padding="none" className="overflow-hidden"><div className="overflow-x-auto">
      <table className="w-full min-w-[950px] text-left text-sm"><thead className="bg-surface-secondary text-xs uppercase tracking-wide text-text-secondary"><tr>
        <th className="px-5 py-4">Película</th><th className="px-5 py-4">Fecha y hora</th><th className="px-5 py-4">Sala</th><th className="px-5 py-4">Idioma</th><th className="px-5 py-4">Formato</th><th className="px-5 py-4 text-right">Acción</th>
      </tr></thead><tbody className="divide-y divide-border">{current.data.map((showtime) => <tr key={showtime.idFuncion}>
        <td className="px-5 py-4"><p className="font-semibold text-text-primary">{showtime.tituloPelicula || 'Película'}</p><p className="mt-1 text-xs text-text-secondary">Función #{showtime.idFuncion} · Película #{showtime.idPelicula}</p></td>
        <td className="px-5 py-4 text-text-secondary">{formatShowtimeDate(showtime.fecha)}<p className="mt-1 font-medium text-text-primary">{showtime.hora || 'Horario no informado'}</p></td>
        <td className="px-5 py-4 text-text-secondary">Sala {showtime.idSala}</td><td className="px-5 py-4 text-text-secondary">Idioma #{showtime.idIdioma}</td>
        <td className="px-5 py-4"><Badge variant={showtime.subtitulada ? 'info' : 'default'}>{showtime.subtitulada ? 'Subtitulada' : 'Sin subtítulos'}</Badge></td>
        <td className="px-5 py-4 text-right"><Button size="small" variant="danger" icon={<Trash2 size={15} />} loading={pendingId === showtime.idFuncion} disabled={pendingId !== null} onClick={() => requestShowtimeDeletion(showtime)}>Dar de baja</Button></td>
      </tr>)}</tbody></table>
    </div></Card>}
  </main>
}

export default ShowtimesPage
