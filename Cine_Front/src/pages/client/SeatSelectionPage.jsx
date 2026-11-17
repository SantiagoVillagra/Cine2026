import { useMemo, useState } from 'react'
import { Armchair, ArrowLeft, Info, ScreenShare } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, PageHeader } from '../../components/common/index.js'
import { publicCatalogMock } from '../../mocks/publicCatalog.js'
import { seatSelectionMock } from '../../mocks/seatSelection.js'

const seatPriceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

function SeatSelectionPage() {
  const { funcionId } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const showtime = publicCatalogMock
    .flatMap((movie) => movie.funciones.map((show) => ({ ...show, movie })))
    .find((show) => String(show.idFuncion) === funcionId)
  const total = useMemo(
    () => selectedSeats.length * seatSelectionMock.pricePerSeat,
    [selectedSeats.length],
  )

  function toggleSeat(seatId) {
    setSelectedSeats((current) =>
      current.includes(seatId)
        ? current.filter((seat) => seat !== seatId)
        : [...current, seatId],
    )
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          to={showtime ? `/pelicula/${showtime.movie.idPelicula}` : '/'}
          className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a la película
        </Link>

        <PageHeader
          title="Elegí tus butacas"
          description={showtime
            ? `${showtime.movie.titulo} · ${showtime.hora} · ${showtime.sala.nombre}`
            : `Función ${funcionId} · datos de sala ilustrativos`}
          actions={<Badge variant="warning">Disponibilidad de muestra</Badge>}
        />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Card className="overflow-x-auto" padding="large">
            <div className="mx-auto min-w-[420px] max-w-2xl">
              <div className="mb-10 text-center">
                <div className="mx-auto flex h-10 max-w-lg items-center justify-center gap-2 rounded-t-[50%] border-t-2 border-primary/70 bg-gradient-to-b from-primary/10 to-transparent text-xs font-medium uppercase tracking-[0.25em] text-text-secondary">
                  <ScreenShare size={15} aria-hidden="true" /> Pantalla
                </div>
              </div>

              <div className="space-y-3" aria-label="Plano de butacas">
                {seatSelectionMock.rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[24px_1fr_24px] items-center gap-3">
                    <span className="text-center text-xs font-semibold text-text-secondary">{row.label}</span>
                    <div className="flex justify-center gap-2">
                      {Array.from({ length: row.seats }, (_, index) => {
                        const number = index + 1
                        const id = `${row.label}${number}`
                        const occupied = row.occupied.includes(number)
                        const selected = selectedSeats.includes(id)

                        return (
                          <button
                            key={id}
                            type="button"
                            disabled={occupied}
                            onClick={() => toggleSeat(id)}
                            aria-label={`Fila ${row.label}, butaca ${number}: ${occupied ? 'ocupada' : selected ? 'seleccionada' : 'disponible'}`}
                            aria-pressed={selected}
                            className={`flex size-8 shrink-0 items-center justify-center rounded-t-lg rounded-b-sm border transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed ${occupied
                              ? 'border-border bg-surface-secondary text-text-secondary/50'
                              : selected
                                ? 'border-primary bg-primary text-text-primary shadow-md shadow-primary/20'
                                : 'border-success/60 bg-success/15 text-success hover:bg-success/30'}`}
                          >
                            <Armchair size={16} aria-hidden="true" />
                          </button>
                        )
                      })}
                    </div>
                    <span className="text-center text-xs font-semibold text-text-secondary">{row.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-border pt-5 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-2"><span className="size-3 rounded-sm border border-success/60 bg-success/15" /> Disponible</span>
                <span className="inline-flex items-center gap-2"><span className="size-3 rounded-sm border border-primary bg-primary" /> Seleccionada</span>
                <span className="inline-flex items-center gap-2"><span className="size-3 rounded-sm border border-border bg-surface-secondary" /> Ocupada</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-5 lg:sticky lg:top-6">
            <div>
              <h2 className="text-lg font-semibold">Tu selección</h2>
              <p className="mt-1 text-sm text-text-secondary">Resumen de precios de muestra</p>
            </div>
            <div className="space-y-3 border-y border-border py-4 text-sm">
              <div className="flex justify-between gap-4 text-text-secondary">
                <span>Butacas</span>
                <span className="font-medium text-text-primary">{selectedSeats.length}</span>
              </div>
              {selectedSeats.length > 0 && (
                <div className="flex justify-between gap-4 text-text-secondary">
                  <span>Seleccionadas</span>
                  <span className="text-right font-medium text-text-primary">{selectedSeats.join(', ')}</span>
                </div>
              )}
              <div className="flex justify-between gap-4 text-text-secondary">
                <span>Precio por butaca</span>
                <span className="text-text-primary">{seatPriceFormatter.format(seatSelectionMock.pricePerSeat)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">Total estimado</span>
              <span className="text-xl font-semibold tabular-nums">{seatPriceFormatter.format(total)}</span>
            </div>
            <p className="flex gap-2 text-xs leading-5 text-text-secondary">
              <Info size={16} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
              Valores y ocupación ilustrativos. Esta pantalla no confirma reservas ni compras.
            </p>
            <Button className="w-full" disabled>Continuar</Button>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default SeatSelectionPage
