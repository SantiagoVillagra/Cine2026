import { useEffect, useState } from 'react'
import { Activity, CircleDollarSign, Clapperboard, Percent, Ticket } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge, Button, Card, DatePicker, EmptyState, Loading, PageHeader } from '../../components/common/index.js'
import {
  getMonthlyRevenue,
  getOccupancyByHour,
  getPromotionUsage,
  getTopMovies,
} from '../../services/adminStatisticsService.js'
import { getAsyncState } from '../../utils/asyncState.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { isValidDateRange, mapStatisticItems } from '../../utils/adminStatistics.js'

const chartTick = { fill: 'var(--color-text-secondary)', fontSize: 11 }
const formatCurrency = (value) => Number(value).toLocaleString('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-lg">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{formatter(payload[0].value)}</p>
    </div>
  )
}

function StatisticsPanel({ title, description, icon: Icon, state, onRetry, children }) {
  const status = getAsyncState(state)

  return (
    <Card className="min-w-0">
      <div className="mb-5 flex items-start gap-3">
        <span className="rounded-lg bg-primary/10 p-2.5 text-primary"><Icon size={18} aria-hidden="true" /></span>
        <div>
          <h2 className="font-semibold text-text-primary">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
      </div>

      {status === 'loading' && <div className="flex h-64 items-center justify-center"><Loading text="Cargando estadística…" /></div>}
      {status === 'error' && (
        <EmptyState
          title="No se pudo cargar esta estadística"
          description={getApiErrorMessage(state.error)}
          action={<Button variant="outline" onClick={onRetry}>Reintentar</Button>}
        />
      )}
      {status === 'empty' && <EmptyState title="Sin datos para mostrar" description="La API no devolvió resultados para esta estadística." />}
      {status === 'success' && <div className="h-72 w-full" role="img" aria-label={title}>{children}</div>}
    </Card>
  )
}

const initialStatState = { isLoading: true, error: null, data: [] }

function DashboardPage() {
  const [dateDraft, setDateDraft] = useState({ desde: '', hasta: '' })
  const [invalidDateInputs, setInvalidDateInputs] = useState({ desde: false, hasta: false })
  const [appliedRange, setAppliedRange] = useState({ desde: '', hasta: '' })
  const [rangeError, setRangeError] = useState('')
  const [topLimit, setTopLimit] = useState(10)
  const [retryKey, setRetryKey] = useState(0)
  const [statsState, setStatsState] = useState({
    requestKey: null,
    revenue: initialStatState,
    topMovies: initialStatState,
    occupancy: initialStatState,
    promotions: initialStatState,
  })

  const requestKey = `${appliedRange.desde}|${appliedRange.hasta}|${topLimit}|${retryKey}`

  useEffect(() => {
    const controller = new AbortController()
    const options = { ...appliedRange, signal: controller.signal }

    Promise.allSettled([
      getMonthlyRevenue(options),
      getTopMovies({ top: topLimit, signal: controller.signal }),
      getOccupancyByHour(options),
      getPromotionUsage({ signal: controller.signal }),
    ]).then(([revenueResult, topMoviesResult, occupancyResult, promotionsResult]) => {
      if (controller.signal.aborted) return

      const toState = (result) => result.status === 'fulfilled'
        ? { isLoading: false, error: null, data: mapStatisticItems(result.value) }
        : { isLoading: false, error: result.reason, data: [] }

      setStatsState({
        requestKey,
        revenue: toState(revenueResult),
        topMovies: toState(topMoviesResult),
        occupancy: toState(occupancyResult),
        promotions: toState(promotionsResult),
      })
    })

    return () => controller.abort()
  }, [appliedRange, topLimit, retryKey, requestKey])

  const currentStats = statsState.requestKey === requestKey
    ? statsState
    : {
        revenue: initialStatState,
        topMovies: initialStatState,
        occupancy: initialStatState,
        promotions: initialStatState,
      }
  const retry = () => setRetryKey((key) => key + 1)

  const applyDateRange = (event) => {
    event.preventDefault()
    if (invalidDateInputs.desde || invalidDateInputs.hasta) {
      setRangeError('Ingresá las fechas con el formato dd/mm/yyyy y verificá que sean válidas.')
      return
    }
    if (!isValidDateRange(dateDraft.desde, dateDraft.hasta)) {
      setRangeError('La fecha “Desde” debe ser anterior o igual a “Hasta”.')
      return
    }

    setRangeError('')
    setAppliedRange({ ...dateDraft })
  }

  const clearDateRange = () => {
    setDateDraft({ desde: '', hasta: '' })
    setInvalidDateInputs({ desde: false, hasta: false })
    setAppliedRange({ desde: '', hasta: '' })
    setRangeError('')
  }

  const rangeLabel = appliedRange.desde || appliedRange.hasta
    ? `${appliedRange.desde || 'Sin inicio'} – ${appliedRange.hasta || 'Sin fin'}`
    : 'Todo el período disponible'

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader
        title="Dashboard administrativo"
        description="Indicadores estadísticos consultados desde la API del cine."
        actions={<Badge variant="info">Datos del backend</Badge>}
      />

      <Card className="space-y-4">
        <div>
          <h2 className="font-semibold text-text-primary">Período de análisis</h2>
          <p className="mt-1 text-sm text-text-secondary">El rango de fechas se aplica a ingresos y ocupación. Top de películas y promociones no admiten fechas en la API.</p>
        </div>
        <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={applyDateRange}>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <DatePicker id="dashboard-from" label="Desde" value={dateDraft.desde} onChange={(event) => setDateDraft((current) => ({ ...current, desde: event.target.value }))} onValidityChange={(valid) => setInvalidDateInputs((current) => ({ ...current, desde: !valid }))} />
            <DatePicker id="dashboard-to" label="Hasta" value={dateDraft.hasta} onChange={(event) => setDateDraft((current) => ({ ...current, hasta: event.target.value }))} onValidityChange={(valid) => setInvalidDateInputs((current) => ({ ...current, hasta: !valid }))} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit">Aplicar período</Button>
            <Button type="button" variant="outline" onClick={clearDateRange}>Limpiar</Button>
          </div>
        </form>
        {rangeError && <p className="text-sm text-danger" role="alert">{rangeError}</p>}
        <p className="flex items-center gap-2 text-xs text-text-secondary"><Activity size={14} className="text-info" aria-hidden="true" />Rango aplicado: {rangeLabel}</p>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">Las estadísticas se presentan con la unidad que devuelve cada endpoint.</p>
        <label className="flex items-center gap-3 text-sm text-text-secondary">
          <span>Películas en el top</span>
          <select value={topLimit} onChange={(event) => setTopLimit(Number(event.target.value))} className="min-h-10 rounded-md border border-border bg-surface px-3 text-text-primary focus-visible:outline-primary" aria-label="Cantidad de películas en el top">
            {[5, 10, 20, 50].map((limit) => <option key={limit} value={limit}>{limit}</option>)}
          </select>
        </label>
      </div>

      <section className="grid min-w-0 gap-5 xl:grid-cols-2" aria-label="Estadísticas del cine">
        <StatisticsPanel
          title="Ingresos por mes"
          description={`Ingresos agrupados por mes de emisión de facturas · ${rangeLabel}.`}
          icon={CircleDollarSign}
          state={currentStats.revenue}
          onRetry={retry}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentStats.revenue.data} margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={chartTick} axisLine={false} tickLine={false} />
              <YAxis width={80} tickFormatter={(value) => new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)} tick={chartTick} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip formatter={formatCurrency} />} />
              <Legend wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Line type="monotone" dataKey="value" name="Ingresos (ARS)" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 3, fill: 'var(--color-primary)' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </StatisticsPanel>

        <StatisticsPanel
          title="Películas más vendidas"
          description="Entradas vendidas por película, en el orden devuelto por la API."
          icon={Clapperboard}
          state={currentStats.topMovies}
          onRetry={retry}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentStats.topMovies.data} layout="vertical" margin={{ top: 4, right: 20, left: 12, bottom: 4 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={chartTick} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" width={130} tick={chartTick} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip formatter={(value) => `${Number(value).toLocaleString('es-AR')} entradas`} />} />
              <Legend wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Bar dataKey="value" name="Entradas vendidas" fill="var(--color-info)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </StatisticsPanel>

        <StatisticsPanel
          title="Ocupación por horario"
          description={`Porcentaje de ocupación agrupado por horario · ${rangeLabel}.`}
          icon={Percent}
          state={currentStats.occupancy}
          onRetry={retry}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentStats.occupancy.data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={chartTick} axisLine={false} tickLine={false} />
              <YAxis width={48} domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={chartTick} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip formatter={(value) => `${Number(value).toLocaleString('es-AR')}%`} />} />
              <Legend wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Bar dataKey="value" name="Ocupación" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </StatisticsPanel>

        <StatisticsPanel
          title="Uso de promociones"
          description="Entradas vendidas asociadas a cada promoción registrada."
          icon={Ticket}
          state={currentStats.promotions}
          onRetry={retry}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentStats.promotions.data} layout="vertical" margin={{ top: 4, right: 20, left: 12, bottom: 4 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={chartTick} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" width={180} tick={chartTick} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip formatter={(value) => `${Number(value).toLocaleString('es-AR')} entradas`} />} />
              <Legend wrapperStyle={{ color: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Bar dataKey="value" name="Entradas con promoción" fill="var(--color-success)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </StatisticsPanel>
      </section>
    </main>
  )
}

export default DashboardPage
