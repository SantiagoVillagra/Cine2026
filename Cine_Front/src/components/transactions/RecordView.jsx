import { Card } from '../common/index.js'
import { formatData, getResourceId, readableLabel } from '../../utils/transactionData.js'

function RecordView({ record, compact = false }) {
  const id = getResourceId(record, 'idFactura')
  if (!record || typeof record !== 'object' || Array.isArray(record)) return <Card>{formatData(record)}</Card>
  const entries = Object.entries(record).filter(([, value]) => value !== undefined)
  return <Card className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-semibold text-text-primary">{`Factura ${id ? `#${id}` : ''}`}</h2>
    </div>
    <dl className={`grid gap-x-5 gap-y-3 text-sm ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
      {entries.map(([key, value]) => <div key={key} className="min-w-0">
        <dt className="text-xs text-text-secondary">{readableLabel(key)}</dt>
        <dd className="mt-1 break-words text-text-primary">{formatData(value)}</dd>
      </div>)}
    </dl>
  </Card>
}

export default RecordView
