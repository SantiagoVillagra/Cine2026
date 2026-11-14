import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Clock3, SlidersHorizontal } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, PageHeader } from '../../components/common/index.js'
import { featuredMovieIds, publicCatalogMock } from '../../mocks/publicCatalog.js'

const allFunctions = publicCatalogMock.flatMap((movie) => movie.funciones)
const formats = [...new Set(allFunctions.map((showtime) => showtime.sala.formato))].sort()
const languages = [...new Set(allFunctions.map((showtime) => showtime.idioma))].sort()

function matchesFilters(showtime, format, language) {
  return (!format || showtime.sala.formato === format) &&
    (!language || showtime.idioma === language)
}

function Showtime({ showtime }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-background/70 px-3 py-2">
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-text-primary">
        <Clock3 size={14} className="text-primary" aria-hidden="true" />
        {showtime.hora}
      </span>
      <span className="text-xs text-text-secondary">{showtime.sala.nombre}</span>
      <Badge variant="info">{showtime.sala.formato}</Badge>
      <span className="text-xs text-text-secondary">
        {showtime.subtitulada ? `${showtime.idioma} · subtitulada` : showtime.idioma}
      </span>
    </div>
  )
}

function FeaturedMovies() {
  const [activeIndex, setActiveIndex] = useState(0)
  const featuredMovies = featuredMovieIds
    .map((id) => publicCatalogMock.find((movie) => movie.idPelicula === id))
    .filter(Boolean)
  const movie = featuredMovies[activeIndex]

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + featuredMovies.length) % featuredMovies.length)
  }

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % featuredMovies.length)
  }

  return (
    <section aria-label="Películas destacadas" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
          En primera fila
        </p>
        <div className="flex items-center gap-2">
          <span className="mr-1 text-xs tabular-nums text-text-secondary" aria-live="polite">
            {String(activeIndex + 1).padStart(2, '0')} / {String(featuredMovies.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Película destacada anterior"
            className="grid size-9 place-items-center rounded-md border border-border bg-surface text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-offset-2"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Película destacada siguiente"
            className="grid size-9 place-items-center rounded-md border border-border bg-surface text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-offset-2"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Card padding="none" className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 size-96 rounded-full bg-info/10 blur-3xl" />
        <div className="relative grid min-h-[34rem] gap-8 p-6 sm:p-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:p-10">
          <div className="flex flex-col items-start">
            <Badge variant="danger">Presentación destacada</Badge>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">
              {movie.titulo}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              {movie.sinopsis}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {movie.generos.map((genre) => <Badge key={genre}>{genre}</Badge>)}
              {movie.duracion && <Badge variant="default">{movie.duracion} min</Badge>}
              {movie.clasificacion && <Badge variant="warning">{movie.clasificacion}</Badge>}
            </div>

            <div className="mt-7 w-full max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                Funciones de muestra
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {movie.funciones.map((showtime) => (
                  <Showtime key={showtime.idFuncion} showtime={showtime} />
                ))}
              </div>
            </div>

            <Link
              to={`/pelicula/${movie.idPelicula}`}
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-md border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-offset-4"
            >
              Consultar detalles
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="relative mx-auto flex w-full max-w-sm justify-center md:max-w-none">
            <div className="absolute inset-x-8 bottom-2 h-8 rounded-full bg-black/50 blur-xl" />
            <img
              src={movie.poster}
              alt={`Afiche ilustrativo de ${movie.titulo}`}
              className="relative max-h-[26rem] w-auto rounded-lg border border-white/10 object-contain shadow-2xl shadow-black/50"
            />
          </div>
        </div>
      </Card>
    </section>
  )
}

function MovieCard({ movie, showtimes }) {
  return (
    <Card padding="none" className="group overflow-hidden transition-colors hover:border-text-secondary/50">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[2/3] overflow-hidden bg-surface-secondary">
          <img
            src={movie.poster}
            alt={`Afiche ilustrativo de ${movie.titulo}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 pt-16">
            <div className="flex flex-wrap gap-1.5">
              {movie.generos.map((genre) => (
                <Badge key={genre} className="bg-background/80 text-text-primary backdrop-blur">
                  {genre}
                </Badge>
              ))}
            </div>
            {movie.clasificacion && <Badge variant="warning">{movie.clasificacion}</Badge>}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-semibold leading-snug text-text-primary">{movie.titulo}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            {movie.duracion ? `${movie.duracion} min` : 'Duración no informada'}
          </p>

          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
              Funciones de muestra
            </p>
            <div className="flex flex-wrap gap-2">
              {showtimes.map((showtime) => (
                <span
                  key={showtime.idFuncion}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-text-primary"
                  title={`${showtime.sala.nombre} · ${showtime.idioma}`}
                >
                  <span className="font-semibold tabular-nums">{showtime.hora}</span>
                  <span className="text-text-secondary">{showtime.sala.formato}</span>
                </span>
              ))}
            </div>
          </div>

          <Link
            to={`/pelicula/${movie.idPelicula}`}
            className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-text-primary transition-colors hover:text-primary focus-visible:rounded-sm"
          >
            Ver detalles
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </article>
    </Card>
  )
}

function HomePage() {
  const [format, setFormat] = useState('')
  const [language, setLanguage] = useState('')
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (pathname === '/' && hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash, pathname])

  const visibleMovies = useMemo(() => publicCatalogMock
    .map((movie) => ({
      ...movie,
      funciones: movie.funciones.filter((showtime) => matchesFilters(showtime, format, language)),
    }))
    .filter((movie) => movie.funciones.length > 0), [format, language])

  const hasFilters = Boolean(format || language)
  const resetFilters = () => {
    setFormat('')
    setLanguage('')
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6 sm:py-12 lg:space-y-16 lg:px-8">
        <PageHeader
          title="Cartelera"
          description="Elegí tu próxima película y encontrá una función para disfrutarla en pantalla grande."
          actions={<Badge variant="info">Cartelera de muestra</Badge>}
        />

        <FeaturedMovies />

        <section id="cartelera" className="scroll-mt-24 space-y-6" aria-label="Películas en cartelera">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary">En cartelera</h2>
              <p className="mt-2 text-sm text-text-secondary sm:text-base">
                Películas y horarios de ejemplo para explorar la experiencia del cine.
              </p>
            </div>
            <span className="text-sm text-text-secondary" aria-live="polite">
              {visibleMovies.length} {visibleMovies.length === 1 ? 'película' : 'películas'}
            </span>
          </header>

          <Card padding="small" className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex items-center gap-2 text-text-secondary lg:mr-2 lg:pb-2">
              <SlidersHorizontal size={17} aria-hidden="true" />
              <span className="text-sm font-medium">Filtrar funciones</span>
            </div>

            <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-2xl">
              <div className="grid gap-2">
                <label htmlFor="format-filter" className="text-xs font-medium text-text-secondary">
                  Formato
                </label>
                <select
                  id="format-filter"
                  value={format}
                  onChange={(event) => setFormat(event.target.value)}
                  className="min-h-10 rounded-md border border-border bg-background px-3 text-sm text-text-primary focus-visible:border-primary"
                >
                  <option value="">Todos los formatos</option>
                  {formats.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="language-filter" className="text-xs font-medium text-text-secondary">
                  Idioma
                </label>
                <select
                  id="language-filter"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="min-h-10 rounded-md border border-border bg-background px-3 text-sm text-text-primary focus-visible:border-primary"
                >
                  <option value="">Todos los idiomas</option>
                  {languages.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            {hasFilters && (
              <Button variant="outline" size="small" onClick={resetFilters}>
                Restablecer
              </Button>
            )}
          </Card>

          {visibleMovies.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleMovies.map((movie) => (
                <MovieCard key={movie.idPelicula} movie={movie} showtimes={movie.funciones} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay funciones para estos filtros"
              description="Probá con otro formato o idioma para ver más opciones de muestra."
              action={<Button variant="outline" onClick={resetFilters}>Limpiar filtros</Button>}
            />
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface px-6 py-8 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Tu próxima salida</p>
            <h2 className="mt-2 text-xl font-semibold text-text-primary">La función empieza acá.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Explorá la cartelera, compará formatos e idiomas y elegí qué ver.
            </p>
          </div>
          <a
            href="#cartelera"
            className="mt-5 inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-border bg-surface-secondary px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-border focus-visible:outline-offset-4 sm:mt-0"
          >
            Volver a la cartelera
            <ArrowLeft size={15} aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  )
}

export default HomePage
