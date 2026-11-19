import { useId } from 'react'

function EmptyState({ title, description, action, className = '' }) {
  const titleId = useId()

  return (
    <section
      className={`flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center ${className}`}
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="text-lg font-semibold text-text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-md text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </section>
  )
}

export default EmptyState
