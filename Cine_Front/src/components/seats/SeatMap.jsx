import { Clapperboard } from 'lucide-react'
import { groupSeatsByRow } from '../../utils/seatSelection.js'

const seatStyles = {
  available: 'border-info/70 bg-surface text-text-primary hover:border-info hover:bg-info/10',
  selected: 'border-primary bg-primary text-text-primary shadow-md shadow-primary/20',
  occupied: 'cursor-not-allowed border-border bg-surface-secondary text-text-secondary opacity-65',
}

function SeatMap({ seats, selectedIds, onToggle }) {
  const rows = groupSeatsByRow(seats)
  const selectedSet = new Set(selectedIds)

  return (
    <section aria-label="Mapa esquemático de butacas" className="space-y-7">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div className="relative mx-auto h-10 max-w-2xl overflow-hidden rounded-t-[50%] border-t-4 border-info/80 bg-gradient-to-b from-info/15 to-transparent">
          <Clapperboard size={17} className="absolute inset-x-0 top-2 mx-auto text-info" aria-hidden="true" />
        </div>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">Pantalla</p>
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="mx-auto w-max min-w-full space-y-3 px-2 sm:px-4">
          {rows.map(({ row, seats: rowSeats }) => (
            <div key={row} className="flex items-center justify-center gap-3 sm:gap-5">
              <span className="w-6 shrink-0 text-right text-xs font-semibold text-text-secondary" aria-hidden="true">{row}</span>
              <div className="grid gap-2 sm:gap-2.5" style={{ gridTemplateColumns: `repeat(${rowSeats.length}, minmax(2.5rem, 1fr))` }}>
                {rowSeats.map((seat) => {
                  const isSelected = selectedSet.has(seat.id)
                  const status = seat.occupied ? 'occupied' : isSelected ? 'selected' : 'available'
                  const statusText = seat.occupied ? 'ocupada' : isSelected ? 'seleccionada' : 'disponible'

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={seat.occupied}
                      aria-label={`Fila ${seat.row}, butaca ${seat.number}, ${statusText}`}
                      aria-pressed={isSelected}
                      title={`Fila ${seat.row}, butaca ${seat.number}: ${statusText}`}
                      onClick={() => onToggle(seat)}
                      className={`grid size-10 place-items-center rounded-t-lg rounded-b-md border text-xs font-semibold tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none sm:size-11 ${seatStyles[status]}`}
                    >
                      {seat.number}
                    </button>
                  )
                })}
              </div>
              <span className="w-6 shrink-0 text-xs font-semibold text-text-secondary" aria-hidden="true">{row}</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-text-secondary" aria-label="Leyenda de butacas">
        <li className="inline-flex items-center gap-2"><span className="size-4 rounded-t-md rounded-b-sm border border-info/70 bg-surface" aria-hidden="true" />Disponible</li>
        <li className="inline-flex items-center gap-2"><span className="size-4 rounded-t-md rounded-b-sm border border-primary bg-primary" aria-hidden="true" />Seleccionada</li>
        <li className="inline-flex items-center gap-2"><span className="size-4 rounded-t-md rounded-b-sm border border-border bg-surface-secondary opacity-65" aria-hidden="true" />Ocupada</li>
      </ul>
      <p className="text-center text-xs text-text-secondary">Disposición esquemática basada en fila y número. No representa pasillos ni geometría física.</p>
    </section>
  )
}

export default SeatMap
