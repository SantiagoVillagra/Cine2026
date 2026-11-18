import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import { Badge, Button, Card, EmptyState, Input, Loading, PageHeader } from '../../components/common/index.js'
import { getAdminShowtimes } from '../../services/adminShowtimeService.js'
import { getAsyncState } from '../../utils/asyncState.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { formatShowtimeDate, mapAdminShowtimes } from '../../utils/adminShowtimes.js'

const initialFilters = { fecha: '', movieId: '' }

function ShowtimesPage() {
  const [draft, setDraft] = useState(initialFilters)
  const [filters, setFilters] = useState(initialFilters)
  const [filterError, setFilterError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [result, setResult] = useState({ key: null, data: [], error: null })
  const requestKey = `${filters.fecha}|${filters.movieId}|${retryKey}`

  useEffect(() => {
    const controller = new AbortController()
    const movieId = filters.movieId ? Number(filters.movieId) : undefined
    getAdminShowtimes({ fecha: filters.fecha || undefined, movieId, signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, data: mapAdminShowtimes(data), error: null })
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
    if (draft.movieId && (!/^\d+$/.test(draft.movieId) || Number(draft.movieId) < 1)) {
      setFilterError('El ID de película debe ser un entero positivo.')
      return
    }
    setFilterError('')
    setFilters({ ...draft })
  }

  const clearFilters = () => {
    setDraft(initialFilters)
    setFilters(initialFilters)
    setFilterError('')
  }

  return <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <PageHeader title="Funciones" description="Consultá la programación registrada y filtrá por los criterios disponibles en la API."
      actions={<Link className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-text-primary hover:bg-primary-hover" to="/admin/funciones/nueva"><Plus size={16} />Nueva función</Link>} />
    <Card className="space-y-4">
      <div><h2 className="font-semibold text-text-primary">Filtros</h2><p className="mt-1 text-sm text-text-secondary">La API admite fecha e ID de película, de forma individual o combinada.</p></div>
      <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={applyFilters}>
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Input label="Fecha" type="date" value={draft.fecha} onChange={(event) => setDraft((value) => ({ ...value, fecha: event.target.value }))} />
          <Input label="ID de película" type="number" min="1" step="1" value={draft.movieId} onChange={(event) => setDraft((value) => ({ ...value, movieId: event.target.value }))} error={filterError} />
        </div>
        <div className="flex gap-2"><Button type="submit">Aplicar</Button><Button type="button" variant="outline" onClick={clearFilters}>Limpiar</Button></div>
      </form>
    </Card>
    {state === 'loading' && <Card className="flex min-h-64 items-center justify-center"><Loading text="Cargando funciones…" /></Card>}
    {state === 'error' && <EmptyState title="No se pudo cargar la programación" description={getApiErrorMessage(current.error)} action={<Button variant="outline" icon={<RefreshCw size={16} />} onClick={() => setRetryKey((key) => key + 1)}>Reintentar</Button>} />}
    {state === 'empty' && <EmptyState title="No hay funciones para mostrar" description="La API no devolvió funciones para los filtros seleccionados." />}
    {state === 'success' && <Card padding="none" className="overflow-hidden"><div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-surface-secondary text-xs uppercase tracking-wide text-text-secondary"><tr>
        <th className="px-5 py-4">Película</th><th className="px-5 py-4">Fecha y hora</th><th className="px-5 py-4">Sala</th><th className="px-5 py-4">Idioma</th><th className="px-5 py-4">Formato</th>
      </tr></thead><tbody className="divide-y divide-border">{current.data.map((showtime) => <tr key={showtime.idFuncion}>
        <td className="px-5 py-4"><p className="font-semibold text-text-primary">{showtime.tituloPelicula || 'Película'}</p><p className="mt-1 text-xs text-text-secondary">Función #{showtime.idFuncion} · Película #{showtime.idPelicula}</p></td>
        <td className="px-5 py-4 text-text-secondary">{formatShowtimeDate(showtime.fecha)}<p className="mt-1 font-medium text-text-primary">{showtime.hora || 'Horario no informado'}</p></td>
        <td className="px-5 py-4 text-text-secondary">Sala {showtime.idSala}</td><td className="px-5 py-4 text-text-secondary">Idioma #{showtime.idIdioma}</td>
        <td className="px-5 py-4"><Badge variant={showtime.subtitulada ? 'info' : 'default'}>{showtime.subtitulada ? 'Subtitulada' : 'Sin subtítulos'}</Badge></td>
      </tr>)}</tbody></table>
    </div></Card>}
  </main>
}

export default ShowtimesPage
