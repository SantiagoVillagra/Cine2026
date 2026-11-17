import { ArrowLeft, Clock3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, PageHeader } from '../../components/common/index.js'
import { publicCatalogMock } from '../../mocks/publicCatalog.js'

function MovieDetailPage() {
  const { id } = useParams()
  const movie = publicCatalogMock.find((item) => String(item.idPelicula) === id)

  return (
    <main>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          to="/#cartelera"
          className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-offset-4"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a la cartelera
        </Link>

        {!movie ? (
          <EmptyState
            title="No encontramos esa película"
            description={`El ID “${id}” no corresponde a ninguna película de la cartelera de muestra.`}
            action={(
              <Link to="/#cartelera">
                <Button variant="outline">Ver cartelera</Button>
              </Link>
            )}
          />
        ) : (
          <>
            <div className="flex flex-col gap-6">
            <PageHeader
              title={movie.titulo}
              description="Detalle de película · Cartelera de muestra"
              actions={<Badge variant="info">Datos ilustrativos</Badge>}
            />

            <div className="grid items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
              <div className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/30">
                <img
                  src={movie.poster}
                  alt={`Afiche ilustrativo de ${movie.titulo}`}
                  className="block aspect-[2/3] w-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <Card className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {movie.generos.map((genre) => <Badge key={genre}>{genre}</Badge>)}
                    {movie.clasificacion && <Badge variant="warning">{movie.clasificacion}</Badge>}
                    {movie.duracion && <Badge variant="default">{movie.duracion} min</Badge>}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Sinopsis</h2>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">{movie.sinopsis}</p>
                  </div>
                </Card>

                <section className="space-y-4" aria-labelledby="showtimes-heading">
                  <div>
                    <h2 id="showtimes-heading" className="text-xl font-semibold text-text-primary">Funciones de muestra</h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Horarios y salas ilustrativos; no representan disponibilidad para reservar.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {movie.funciones.map((showtime) => (
                      <Card key={showtime.idFuncion} padding="small" className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 text-lg font-semibold tabular-nums text-text-primary">
                            <Clock3 size={17} className="text-primary" aria-hidden="true" />
                            {showtime.hora}
                          </span>
                          <Badge variant="info">{showtime.sala.formato}</Badge>
                        </div>
                        <div className="flex flex-col gap-4">
                          <p className="text-sm text-text-secondary">
                            {showtime.sala.nombre} · {showtime.idioma}
                            {showtime.subtitulada ? ' · subtitulada' : ''}
                          </p>
                          <Link to={`/cliente/reservar/${showtime.idFuncion}`}>
                            <Button className="w-full">Elegir butacas</Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default MovieDetailPage
