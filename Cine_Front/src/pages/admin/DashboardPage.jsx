import { useState } from 'react'
import {
  Activity,
  CalendarDays,
  Clapperboard,
  CircleDollarSign,
  Ticket,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge, Card, EmptyState, PageHeader } from '../../components/common/index.js'
import { dashboardPeriods, dashboardPeriodOptions } from '../../mocks/adminDashboard.js'

const metricDefinitions = [
  { key: 'movies', label: 'Películas en cartelera', icon: Clapperboard, format: (value) => value.toLocaleString('es-AR') },
  { key: 'showtimes', label: 'Funciones del período', icon: CalendarDays, format: (value) => value.toLocaleString('es-AR') },
  { key: 'tickets', label: 'Entradas vendidas', icon: Ticket, format: (value) => value.toLocaleString('es-AR') },
  {
    key: 'salesAmount',
    label: 'Importe de ventas ilustrativo',
    icon: CircleDollarSign,
    format: (value) => value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }),
  },
]

const formatCurrency = (value) =>
  Number(value).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

function ChartTooltip({ active, payload, label, currency = false }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-lg">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">
        {currency ? formatCurrency(payload[0].value) : `${payload[0].value.toLocaleString('es-AR')} entradas`}
      </p>
    </div>
  )
}

function DashboardTable({ title, description, children, columns }) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-col gap-1 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-text-primary">{title}</h2>
          <p className="mt-1 text-xs text-text-secondary">{description}</p>
        </div>
        <Badge variant="info">Datos ilustrativos</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-surface-secondary/60 text-xs uppercase tracking-wide text-text-secondary">
            <tr>{columns.map((column) => <th key={column} scope="col" className="px-5 py-3 font-medium">{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
        </table>
      </div>
    </Card>
  )
}

function DashboardPage() {
  const [period, setPeriod] = useState('week')
  const data = dashboardPeriods[period]
  const hasChartData = data.sales.length > 0 && data.activity.length > 0

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader
        title="Dashboard administrativo"
        description="Resumen de actividad del cine. Los valores de esta vista son ilustrativos y no representan datos reales."
        actions={(
          <label className="flex items-center gap-3 text-sm text-text-secondary">
            <span>Período</span>
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="min-h-10 rounded-md border border-border bg-surface px-3 text-text-primary focus-visible:outline-primary"
              aria-label="Seleccionar período del dashboard"
            >
              {dashboardPeriodOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        )}
      />

      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Activity size={16} className="text-info" aria-hidden="true" />
        <span>Valores de demostración para el período seleccionado: {dashboardPeriodOptions.find((option) => option.value === period)?.label.toLowerCase()}.</span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores del período">
        {metricDefinitions.map(({ key, label, icon: Icon, format }) => (
          <Card key={key} padding="small" className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-text-primary">{format(data.summary[key])}</p>
              </div>
              <span className="rounded-lg bg-primary/10 p-2.5 text-primary"><Icon size={19} aria-hidden="true" /></span>
            </div>
            <p className="mt-3 text-xs text-text-secondary">Dato ilustrativo · {dashboardPeriodOptions.find((option) => option.value === period)?.label}</p>
          </Card>
        ))}
      </section>

      {hasChartData ? (
        <section className="grid gap-5 xl:grid-cols-2" aria-label="Gráficos del dashboard">
          <Card className="min-w-0">
            <div className="mb-5">
              <h2 className="font-semibold text-text-primary">Evolución de ventas</h2>
              <p className="mt-1 text-sm text-text-secondary">Importes ilustrativos a lo largo del período seleccionado.</p>
            </div>
            <div className="h-64 w-full" role="img" aria-label="Gráfico de evolución ilustrativa de ventas">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.sales} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis width={68} tickFormatter={(value) => `${Math.round(value / 1000000)} M`} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip currency />} />
                  <Line type="monotone" dataKey="amount" name="Ventas" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 3, fill: 'var(--color-primary)' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="min-w-0">
            <div className="mb-5">
              <h2 className="font-semibold text-text-primary">Actividad · entradas vendidas</h2>
              <p className="mt-1 text-sm text-text-secondary">Entradas ilustrativas agrupadas en el mismo período.</p>
            </div>
            <div className="h-64 w-full" role="img" aria-label="Gráfico ilustrativo de entradas vendidas">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.activity} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis width={42} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="tickets" name="Entradas" stroke="var(--color-info)" strokeWidth={3} dot={{ r: 3, fill: 'var(--color-info)' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      ) : (
        <EmptyState title="No hay datos para este período" description="Seleccioná otro período para consultar los datos ilustrativos disponibles." />
      )}

      <section className="grid min-w-0 gap-5 xl:grid-cols-2" aria-label="Tablas del dashboard">
        {data.movies.length > 0 ? (
          <DashboardTable title="Películas destacadas" description="Orden ilustrativo por entradas vendidas." columns={['Película', 'Entradas', 'Importe ilustrativo']}>
            {data.movies.map((movie) => (
              <tr key={movie.title} className="transition-colors hover:bg-surface-secondary/40">
                <th scope="row" className="px-5 py-3 font-medium text-text-primary">{movie.title}</th>
                <td className="px-5 py-3 tabular-nums text-text-secondary">{movie.tickets.toLocaleString('es-AR')}</td>
                <td className="px-5 py-3 tabular-nums text-text-secondary">{formatCurrency(movie.salesAmount)}</td>
              </tr>
            ))}
          </DashboardTable>
        ) : (
          <EmptyState title="Sin películas para mostrar" description="No hay datos ilustrativos de películas para este período." />
        )}

        {data.showtimes.length > 0 ? (
          <DashboardTable title="Próximas funciones" description="Horarios y salas ilustrativos; no representan disponibilidad." columns={['Horario', 'Película', 'Sala', 'Formato']}>
            {data.showtimes.map((showtime) => (
              <tr key={`${showtime.time}-${showtime.movie}`} className="transition-colors hover:bg-surface-secondary/40">
                <td className="px-5 py-3 font-medium tabular-nums text-text-primary">{showtime.time}</td>
                <th scope="row" className="px-5 py-3 font-medium text-text-primary">{showtime.movie}</th>
                <td className="px-5 py-3 text-text-secondary">{showtime.room}</td>
                <td className="px-5 py-3"><Badge variant="default">{showtime.format}</Badge></td>
              </tr>
            ))}
          </DashboardTable>
        ) : (
          <EmptyState title="Sin funciones para mostrar" description="No hay funciones ilustrativas para este período." />
        )}
      </section>
    </main>
  )
}

export default DashboardPage
