import { useEffect } from 'react'
import { Button } from './index.js'

function LogoutConfirmation({ onCancel, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirmation-title"
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl"
      >
        <h2 id="logout-confirmation-title" className="text-lg font-semibold text-text-primary">
          Confirmar cierre de sesión
        </h2>
        <p className="mt-3 text-sm text-text-secondary">
          ¿Estás seguro de que deseas cerrar sesión?
        </p>
        <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Cerrar sesión
          </Button>
        </div>
      </section>
    </div>
  )
}

export default LogoutConfirmation
