import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Clapperboard, Clock3, SlidersHorizontal } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Loading, PageHeader } from '../../components/common/index.js'
import { getMovies, getShowtimes } from '../../services/publicCatalogService.js'
import { getAsyncState } from '../../utils/asyncState.js'
import { formatShowtimeDate, formatShowtimeTime, getActiveMovies, mapShowtimes } from '../../utils/publicCatalog.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'

function Showtime({ showtime }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-background/70 px-3 py-2">
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-text-primary">
        <Clock3 size={14} className="text-primary" aria-hidden="true" />
        {formatShowtimeTime(showtime.time)}
      </span>
      <span className="text-xs text-text-secondary">Sala {showtime.roomId}</span>
      <Badge variant="info">Idioma {showtime.languageId}</Badge>
      {showtime.isSubtitled && <span className="text-xs text-text-secondary">Subtitulada</span>}
    </div>
  )
}

function Poster({ movie, className = '' }) {
  if (!movie.poster) {
    return (
      <div className={`grid place-items-center bg-surface-secondary text-text-secondary ${className}`} role="img" aria-label={`Afiche no disponible para ${movie.title}`}>
        <Clapperboard size={42} aria-hidden="true" />
      </div>
    )
  }

  return <img src={movie.poster} alt={`Afiche de ${movie.title}`} className={className} />
}

function FeaturedMovies({ movies, showtimes, showtimesError }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const featuredMovies = movies.slice(0, 3)

  if (featuredMovies.length === 0) return null

  const selectedIndex = Math.min(activeIndex, featuredMovies.length - 1)
  const movie = featuredMovies[selectedIndex]
  const movieShowtimes = showtimes.filter((showtime) => showtime.movieId === movie.id).slice(0, 2)
  const changeSlide = (direction) => {
    setActiveIndex((index) => (index + direction + featuredMovies.length) % featuredMovies.length)
  }

  return (
    <section aria-label="Películas de cartelera" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">Recorré la cartelera</p>
        {featuredMovies.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs tabular-nums text-text-secondary" aria-live="polite">
              {String(selectedIndex + 1).padStart(2, '0')} / {String(featuredMovies.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => changeSlide(-1)} aria-label="Película destacada anterior" className="grid size-9 place-items-center rounded-md border border-border bg-surface text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-offset-2">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => changeSlide(1)} aria-label="Película destacada siguiente" className="grid size-9 place-items-center rounded-md border border-border bg-surface text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-offset-2">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <Card padding="none" className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 size-96 rounded-full bg-info/10 blur-3xl" />
        <div className="relative grid min-h-[34rem] gap-8 p-6 sm:p-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:p-10">
          <div className="flex flex-col items-start">
            <Badge variant="danger">En cartelera</Badge>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">{movie.title}</h2>
            {movie.synopsis && <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">{movie.synopsis}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {movie.duration && <Badge variant="default">{movie.duration} min</Badge>}
              {movie.classificationId != null && <Badge variant="warning">Clasificación #{movie.classificationId}</Badge>}
            </div>

            <div className="mt-7 w-full max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Funciones programadas</p>
              {showtimesError ? (
                <p className="text-sm text-warning">No se pudieron consultar las funciones.</p>
              ) : movieShowtimes.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">{movieShowtimes.map((showtime) => <Showtime key={showtime.id} showtime={showtime} />)}</div>
              ) : (
                <p className="text-sm text-text-secondary">No hay funciones informadas.</p>
              )}
            </div>

            <Link to={`/pelicula/${movie.id}`} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-md border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-offset-4">
              Consultar detalles <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="relative mx-auto flex w-full max-w-sm justify-center md:max-w-none">
            <div className="absolute inset-x-8 bottom-2 h-8 rounded-full bg-black/50 blur-xl" />
            <Poster movie={movie} className="relative max-h-[26rem] w-auto rounded-lg border border-white/10 object-contain shadow-2xl shadow-black/50" />
          </div>
        </div>
      </Card>
    </section>
  )
}

function MovieCard({ movie, showtimes, showtimesError }) {
  return (
    <Card padding="none" className="group overflow-hidden transition-colors hover:border-text-secondary/50">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[2/3] overflow-hidden bg-surface-secondary">
          <Poster movie={movie} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          {movie.classificationId != null && (
            <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 pt-16">
              <Badge variant="warning">Clasificación #{movie.classificationId}</Badge>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-semibold leading-snug text-text-primary">{movie.title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{movie.duration ? `${movie.duration} min` : 'Duración no informada'}</p>
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">Funciones programadas</p>
            {showtimesError ? (
              <p className="text-xs text-warning">No se pudieron consultar.</p>
            ) : showtimes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {showtimes.slice(0, 3).map((showtime) => (
                  <span key={showtime.id} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-text-primary" title={`Sala ${showtime.roomId} · Idioma ${showtime.languageId}`}>
                    <span className="font-semibold tabular-nums">{formatShowtimeDate(showtime.date)} · {formatShowtimeTime(showtime.time)}</span>
                  </span>
                ))}
              </div>
            ) : <p className="text-xs text-text-secondary">Sin funciones informadas.</p>}
          </div>
          <Link to={`/pelicula/${movie.id}`} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-text-primary transition-colors hover:text-primary focus-visible:rounded-sm">
            Ver detalles <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </article>
    </Card>
  )
}

function HomePage() {
  const [languageId, setLanguageId] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const [moviesState, setMoviesState] = useState({ requestKey: -1, isLoading: true, error: null, data: [] })
  const [showtimesState, setShowtimesState] = useState({ requestKey: -1, isLoading: true, error: null, data: [] })
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/' && hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash, pathname])

  useEffect(() => {
    const controller = new AbortController()

    Promise.allSettled([
      getMovies({ signal: controller.signal }),
      getShowtimes({ signal: controller.signal }),
    ]).then(([moviesResult, showtimesResult]) => {
      if (controller.signal.aborted) return

      if (moviesResult.status === 'fulfilled') {
        setMoviesState({ requestKey: retryKey, isLoading: false, error: null, data: getActiveMovies(moviesResult.value) })
      } else {
        setMoviesState({ requestKey: retryKey, isLoading: false, error: moviesResult.reason, data: [] })
      }

      if (showtimesResult.status === 'fulfilled') {
        setShowtimesState({ requestKey: retryKey, isLoading: false, error: null, data: mapShowtimes(showtimesResult.value) })
      } else {
        setShowtimesState({ requestKey: retryKey, isLoading: false, error: showtimesResult.reason, data: [] })
      }
    })

    return () => controller.abort()
  }, [retryKey])

  const currentMoviesState = moviesState.requestKey === retryKey
    ? moviesState
    : { isLoading: true, error: null, data: [] }
  const currentShowtimesState = showtimesState.requestKey === retryKey
    ? showtimesState
    : { isLoading: true, error: null, data: [] }
  const availableLanguageIds = useMemo(
    () => [...new Set(currentShowtimesState.data.map((showtime) => showtime.languageId).filter((id) => id != null))].sort((a, b) => a - b),
    [currentShowtimesState.data],
  )
  const visibleMovies = useMemo(() => currentMoviesState.data.map((movie) => ({
    ...movie,
    showtimes: currentShowtimesState.data.filter((showtime) => showtime.movieId === movie.id && (!languageId || String(showtime.languageId) === languageId)),
  })).filter((movie) => !languageId || movie.showtimes.length > 0), [currentMoviesState.data, currentShowtimesState.data, languageId])
  const movieStatus = getAsyncState(currentMoviesState)
  const hasFilters = Boolean(languageId)
  const resetFilters = () => {
    setLanguageId('')
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6 sm:py-12 lg:space-y-16 lg:px-8">
        <PageHeader title="Cartelera" description="Elegí tu próxima película y encontrá una función para disfrutarla en pantalla grande." actions={<Badge variant="info">Cartelera actual</Badge>} />

        {movieStatus === 'loading' && <div className="flex justify-center py-14"><Loading text="Cargando cartelera…" /></div>}
        {movieStatus === 'error' && (
          <EmptyState title="No se pudo cargar la cartelera" description={getApiErrorMessage(currentMoviesState.error)} action={<Button onClick={() => setRetryKey((key) => key + 1)}>Reintentar</Button>} />
        )}
        {movieStatus === 'empty' && <EmptyState title="No hay películas activas" description="No hay películas disponibles en cartelera en este momento." />}

        {movieStatus === 'success' && (
          <>
            <FeaturedMovies movies={currentMoviesState.data} showtimes={currentShowtimesState.data} showtimesError={currentShowtimesState.error} />

            <section id="cartelera" className="scroll-mt-24 space-y-6" aria-label="Películas en cartelera">
              <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-text-primary">En cartelera</h2>
                  <p className="mt-2 text-sm text-text-secondary sm:text-base">Películas activas y funciones devueltas por la API.</p>
                </div>
                <span className="text-sm text-text-secondary" aria-live="polite">{visibleMovies.length} {visibleMovies.length === 1 ? 'película' : 'películas'}</span>
              </header>

              <Card padding="small" className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="flex items-center gap-2 text-text-secondary lg:mr-2 lg:pb-2"><SlidersHorizontal size={17} aria-hidden="true" /><span className="text-sm font-medium">Filtrar funciones</span></div>
                <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-2xl">
                  <div className="grid gap-2">
                    <label htmlFor="format-filter" className="text-xs font-medium text-text-secondary">Formato</label>
                    <select id="format-filter" value="" disabled className="min-h-10 rounded-md border border-border bg-background px-3 text-sm text-text-secondary disabled:cursor-not-allowed disabled:opacity-70">
                      <option value="">Formato no informado por la API</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="language-filter" className="text-xs font-medium text-text-secondary">Idioma</label>
                    <select id="language-filter" value={languageId} onChange={(event) => setLanguageId(event.target.value)} className="min-h-10 rounded-md border border-border bg-background px-3 text-sm text-text-primary focus-visible:border-primary">
                      <option value="">Todos los idiomas</option>
                      {availableLanguageIds.map((id) => <option key={id} value={id}>Idioma ID {id}</option>)}
                    </select>
                  </div>
                </div>
                {hasFilters && <Button variant="outline" size="small" onClick={resetFilters}>Restablecer</Button>}
                {currentShowtimesState.error && (
                  <div role="status" className="flex flex-wrap items-center gap-3 text-xs text-warning">
                    <span>Los horarios no están disponibles. {getApiErrorMessage(currentShowtimesState.error)}</span>
                    <Button variant="outline" size="small" onClick={() => setRetryKey((key) => key + 1)}>Reintentar</Button>
                  </div>
                )}
              </Card>

              {currentShowtimesState.isLoading ? (
                <div className="flex justify-center py-8"><Loading text="Cargando funciones…" /></div>
              ) : visibleMovies.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleMovies.map((movie) => <MovieCard key={movie.id} movie={movie} showtimes={movie.showtimes} showtimesError={currentShowtimesState.error} />)}
                </div>
              ) : (
                <EmptyState title={languageId ? 'No hay funciones para este idioma' : 'No hay películas para mostrar'} description={languageId ? 'Probá con otro idioma o restablecé el filtro.' : 'No se encontraron películas activas.'} action={languageId ? <Button variant="outline" onClick={resetFilters}>Limpiar filtros</Button> : undefined} />
              )}
            </section>
          </>
        )}

        <section className="rounded-xl border border-border bg-surface px-6 py-8 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Tu próxima salida</p>
            <h2 className="mt-2 text-xl font-semibold text-text-primary">La función empieza acá.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">Explorá la cartelera, consultá los horarios disponibles y elegí qué ver.</p>
          </div>
          <a href="#cartelera" className="mt-5 inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-border bg-surface-secondary px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-border focus-visible:outline-offset-4 sm:mt-0">
            Volver a la cartelera <ArrowLeft size={15} aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  )
}

export default HomePage
