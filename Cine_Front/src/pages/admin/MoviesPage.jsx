import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Badge, Button, Card, EmptyState, Loading, PageHeader } from '../../components/common/index.js'
import { getMovies } from '../../services/publicCatalogService.js'
import { setMovieActive } from '../../services/adminMovieService.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { formatMovieDate, mapAdminMovies, updateMovieActive } from '../../utils/adminMovies.js'
import { useAlerts } from '../../hooks/useAlerts.js'

function MoviesPage() {
  const [retryKey, setRetryKey] = useState(0)
  const [result, setResult] = useState({ requestKey: null, data: [], error: null })
  const [pendingId, setPendingId] = useState(null)
  const operationLock = useRef(false)
  const { showAlert } = useAlerts()

  useEffect(() => {
    const controller = new AbortController()
    getMovies({ signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setResult({ requestKey: retryKey, data: mapAdminMovies(data), error: null })
    }).catch((error) => {
      if (!controller.signal.aborted) setResult({ requestKey: retryKey, data: [], error })
    })
    return () => controller.abort()
  }, [retryKey])

  const current = result.requestKey === retryKey ? result : null
  const status = !current ? 'loading' : current.error ? 'error' : current.data.length === 0 ? 'empty' : 'success'

  const applyStatus = async (movie, nextActive) => {
    if (operationLock.current) return
    operationLock.current = true
    setPendingId(movie.idPelicula)
    try {
      await setMovieActive(movie.idPelicula, nextActive)
      setResult((state) => ({ ...state, data: updateMovieActive(state.data, movie.idPelicula, nextActive) }))
    } catch (error) {
      await showAlert({ type: 'error', title: 'No se pudo actualizar la película', message: getApiErrorMessage(error, 'No se pudo actualizar el estado de la película.') })
    } finally {
      operationLock.current = false
      setPendingId(null)
    }
  }

  const requestStatusChange = async (movie, nextActive) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: `${nextActive ? 'Activar' : 'Desactivar'} película`,
      message: `¿Confirmás ${nextActive ? 'activar' : 'desactivar'} «${movie.titulo}»? ${nextActive ? 'Podrá aparecer en la cartelera pública.' : 'Dejará de aparecer en la cartelera pública.'}`,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
    })
    if (confirmed) await applyStatus(movie, nextActive)
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader title="Películas" description="Administrá el catálogo y la disponibilidad en la cartelera pública."
        actions={<Link className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-text-primary hover:bg-primary-hover" to="/admin/peliculas/nueva"><Plus size={16} />Nueva película</Link>} />
      {status === 'loading' && <Card className="flex min-h-64 items-center justify-center"><Loading text="Cargando películas…" /></Card>}
      {status === 'error' && <EmptyState title="No se pudo cargar el catálogo" description={getApiErrorMessage(current.error)} action={<Button variant="outline" icon={<RefreshCw size={16} />} onClick={() => setRetryKey((key) => key + 1)}>Reintentar</Button>} />}
      {status === 'empty' && <EmptyState title="Todavía no hay películas" description="Cuando existan películas registradas, aparecerán en este listado." action={<Link className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-text-primary" to="/admin/peliculas/nueva">Crear película</Link>} />}
      {status === 'success' && <Card padding="none" className="overflow-hidden"><div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-surface-secondary text-xs uppercase tracking-wide text-text-secondary"><tr>
          <th className="px-5 py-4">Película</th><th className="px-5 py-4">Duración</th><th className="px-5 py-4">Clasificación / dirección</th><th className="px-5 py-4">Estreno</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4 text-right">Acción</th>
        </tr></thead><tbody className="divide-y divide-border">{current.data.map((movie) => {
          const knownStatus = typeof movie.activa === 'boolean'
          return <tr key={movie.idPelicula} className="align-middle">
            <td className="px-5 py-4"><p className="font-semibold text-text-primary">{movie.titulo || 'Sin título'}</p><p className="mt-1 text-xs text-text-secondary">ID {movie.idPelicula}</p></td>
            <td className="px-5 py-4 text-text-secondary">{movie.duracion != null ? `${movie.duracion} min` : '—'}</td>
            <td className="px-5 py-4 text-text-secondary">Clasificación {movie.idClasificacion ?? '—'}<br />Director {movie.idDirector ?? '—'}</td>
            <td className="px-5 py-4 text-text-secondary">{formatMovieDate(movie.fechaEstreno)}</td>
            <td className="px-5 py-4">{knownStatus ? <Badge variant={movie.activa ? 'success' : 'danger'}>{movie.activa ? 'Activa' : 'Inactiva'}</Badge> : <Badge variant="warning">Estado no informado</Badge>}</td>
            <td className="px-5 py-4 text-right">{knownStatus ? <Button size="small" variant={movie.activa ? 'outline' : 'secondary'} icon={movie.activa ? <ShieldAlert size={15} /> : <ShieldCheck size={15} />} disabled={pendingId !== null} onClick={() => requestStatusChange(movie, !movie.activa)}>{movie.activa ? 'Desactivar' : 'Activar'}</Button> : <span className="text-xs text-text-secondary">No disponible</span>}</td>
          </tr>
        })}</tbody></table>
      </div></Card>}
    </main>
  )
}

export default MoviesPage
