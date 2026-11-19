import { LoaderCircle } from 'lucide-react'

function Loading({ text }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-sm text-text-secondary"
      role="status"
      aria-label={text || 'Cargando'}
    >
      <LoaderCircle className="size-5 animate-spin text-primary" aria-hidden="true" />
      {text && <span>{text}</span>}
      {!text && <span className="sr-only">Cargando</span>}
    </div>
  )
}

export default Loading
