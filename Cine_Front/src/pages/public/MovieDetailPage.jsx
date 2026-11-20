import { useEffect, useState } from 'react'
import { ArrowLeft, Clapperboard, Clock3 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Loading, PageHeader } from '../../components/common/index.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useAlerts } from '../../hooks/useAlerts.js'
import { getMovieById, getShowtimes } from '../../services/publicCatalogService.js'
import { getClassifications, getLanguages } from '../../services/movieCatalogService.js'
import { getAsyncState } from '../../utils/asyncState.js'
import { formatShowtimeDate, formatShowtimeTime, getShowtimeFormat, mapMovie, mapShowtimes } from '../../utils/publicCatalog.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'

function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { showAlert } = useAlerts()
  const [movieRetryKey, setMovieRetryKey] = useState(0)
  const [showtimesRetryKey, setShowtimesRetryKey] = useState(0)
  const [classifications, setClassifications] = useState(new Map())
  const [languages, setLanguages] = useState(new Map())
  const [movieState, setMovieState] = useState({ requestKey: null, isLoading: true, error: null, data: null })
  const [showtimesState, setShowtimesState] = useState({ requestKey: null, isLoading: true, error: null, data: [] })
  const movieRequestKey = `${id}:${movieRetryKey}`
  const showtimesRequestKey = `${id}:${showtimesRetryKey}`
  const handleChooseSeats = (showtime) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/cliente/comprar/${showtime.id}` } })
      return
    }

    if (user.role !== 'Client') {
      showAlert({ type: 'warning', title: 'Acceso de cliente requerido', message: 'Para comprar entradas, tenés que ingresar con una cuenta de cliente.' })
      return
    }

    navigate(`/cliente/comprar/${showtime.id}`, { state: { showtime } })
  }

  useEffect(() => {
    const controller = new AbortController()

    getMovieById(id, { signal: controller.signal })
      .then((movie) => {
        if (!controller.signal.aborted) setMovieState({ requestKey: movieRequestKey, isLoading: false, error: null, data: mapMovie(movie) })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setMovieState({ requestKey: movieRequestKey, isLoading: false, error, data: null })
      })

    return () => controller.abort()
  }, [id, movieRequestKey])

  useEffect(() => {
    const controller = new AbortController()

    getShowtimes({ movieId: id, signal: controller.signal })
      .then((showtimes) => {
        if (!controller.signal.aborted) setShowtimesState({ requestKey: showtimesRequestKey, isLoading: false, error: null, data: mapShowtimes(showtimes) })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setShowtimesState({ requestKey: showtimesRequestKey, isLoading: false, error, data: [] })
      })

    return () => controller.abort()
  }, [id, showtimesRequestKey])

  useEffect(() => {
    const controller = new AbortController()

    Promise.allSettled([
      getClassifications({ signal: controller.signal }),
      getLanguages({ signal: controller.signal }),
    ]).then(([classificationsResult, languagesResult]) => {
      if (controller.signal.aborted) return
      if (classificationsResult.status === 'fulfilled') {
        setClassifications(new Map(classificationsResult.value.map(({ id: itemId, nombre }) => [Number(itemId), nombre])))
      }
      if (languagesResult.status === 'fulfilled') {
        setLanguages(new Map(languagesResult.value.map(({ id: itemId, nombre }) => [Number(itemId), nombre])))
      }
    })

    return () => controller.abort()
  }, [])

  const currentMovieState = movieState.requestKey === movieRequestKey
    ? movieState
    : { isLoading: true, error: null, data: null }
  const currentShowtimesState = showtimesState.requestKey === showtimesRequestKey
    ? showtimesState
    : { isLoading: true, error: null, data: [] }
  const movieStatus = getAsyncState(currentMovieState)
  const isNotFound = currentMovieState.error?.response?.status === 404
  const movie = currentMovieState.data

  return (
    <main>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link to="/#cartelera" className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-offset-4">
          <ArrowLeft size={16} aria-hidden="true" /> Volver a la cartelera
        </Link>

        {movieStatus === 'loading' && <div className="flex justify-center py-16"><Loading text="Cargando película…" /></div>}
        {movieStatus === 'error' && (
          <EmptyState
            title={isNotFound ? 'No encontramos esa película' : 'No se pudo cargar la película'}
            description={isNotFound ? `El ID “${id}” no corresponde a una película disponible.` : getApiErrorMessage(currentMovieState.error)}
            action={isNotFound ? <Link to="/#cartelera"><Button variant="outline">Ver cartelera</Button></Link> : <Button onClick={() => setMovieRetryKey((key) => key + 1)}>Reintentar</Button>}
          />
        )}

        {movieStatus === 'success' && movie && (
          <>
            <PageHeader title={movie.title} description="Detalle de película" />

            <div className="grid items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
              <div className="mx-auto grid aspect-[2/3] w-full max-w-sm place-items-center overflow-hidden rounded-xl border border-border bg-surface-secondary shadow-2xl shadow-black/30">
                {movie.poster ? (
                  <img src={movie.poster} alt={`Afiche de ${movie.title}`} className="block size-full object-cover" />
                ) : (
                  <div className="grid justify-items-center gap-3 text-text-secondary" role="img" aria-label={`Afiche no disponible para ${movie.title}`}>
                    <Clapperboard size={44} aria-hidden="true" />
                    <span className="text-sm">Afiche no disponible</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <Card className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {classifications.get(Number(movie.classificationId)) && <Badge variant="warning">{classifications.get(Number(movie.classificationId))}</Badge>}
                    {movie.duration != null && <Badge variant="default">{movie.duration} min</Badge>}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Sinopsis</h2>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">{movie.synopsis || 'Sinopsis no disponible.'}</p>
                  </div>
                </Card>

                <section id="funciones" className="scroll-mt-24 space-y-4" aria-labelledby="showtimes-heading">
                  <div>
                    <h2 id="showtimes-heading" className="text-xl font-semibold text-text-primary">Funciones</h2>
                    <p className="mt-1 text-sm text-text-secondary">Horarios informados para esta película. La disponibilidad de butacas se consulta por separado.</p>
                  </div>

                  {getAsyncState(currentShowtimesState) === 'loading' && <div className="flex justify-center py-8"><Loading text="Cargando funciones…" /></div>}
                  {getAsyncState(currentShowtimesState) === 'error' && (
                    <EmptyState title="No se pudieron cargar las funciones" description={getApiErrorMessage(currentShowtimesState.error)} action={<Button variant="outline" onClick={() => setShowtimesRetryKey((key) => key + 1)}>Reintentar</Button>} />
                  )}
                  {getAsyncState(currentShowtimesState) === 'empty' && <EmptyState title="No hay funciones programadas" description="La API no devolvió funciones para esta película." />}
                  {getAsyncState(currentShowtimesState) === 'success' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {currentShowtimesState.data.map((showtime) => (
                        <Card key={showtime.id} padding="small" className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 text-lg font-semibold tabular-nums text-text-primary">
                              <Clock3 size={17} className="text-primary" aria-hidden="true" /> {formatShowtimeTime(showtime.time)}
                            </span>
                            <Badge variant="info">Formato {getShowtimeFormat(showtime) || 'no informado'}</Badge>
                          </div>
                          <p className="text-sm text-text-secondary">
                            {formatShowtimeDate(showtime.date)} · {languages.get(Number(showtime.languageId)) || 'Idioma no informado'}{showtime.isSubtitled ? ' · subtitulada' : ''}
                          </p>
                          <Button className="w-full" onClick={() => handleChooseSeats(showtime)}>
                            Elegir butacas
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default MovieDetailPage
