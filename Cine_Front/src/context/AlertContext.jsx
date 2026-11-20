import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircleCheck, CircleHelp, CircleX, Info, TriangleAlert } from 'lucide-react'
import { Button } from '../components/common/index.js'
import { AlertContext } from './alert-context.js'

const alertStyles = {
  info: { title: 'Información', icon: Info, color: 'text-info', border: 'border-info/40', background: 'bg-info/10' },
  success: { title: 'Operación completada', icon: CircleCheck, color: 'text-success', border: 'border-success/40', background: 'bg-success/10' },
  warning: { title: 'Atención', icon: TriangleAlert, color: 'text-warning', border: 'border-warning/40', background: 'bg-warning/10' },
  error: { title: 'Ocurrió un problema', icon: CircleX, color: 'text-danger', border: 'border-danger/40', background: 'bg-danger/10' },
  confirm: { title: 'Confirmar acción', icon: CircleHelp, color: 'text-warning', border: 'border-warning/40', background: 'bg-warning/10' },
}

export function AlertProvider({ children }) {
  const [queue, setQueue] = useState([])
  const confirmButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const nextAlertId = useRef(0)
  const activeAlert = queue[0] ?? null

  const showAlert = useCallback((options) => new Promise((resolve) => {
    const id = nextAlertId.current++
    setQueue((current) => [...current, {
      id,
      type: options.type ?? 'info',
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel ?? 'Aceptar',
      cancelLabel: options.cancelLabel ?? 'Cerrar',
      isConfirmation: options.type === 'confirm' || Boolean(options.cancelLabel),
      resolve,
    }])
  }), [])

  const finishAlert = useCallback((confirmed) => {
    activeAlert?.resolve(confirmed)
    setQueue((current) => current[0]?.id === activeAlert?.id ? current.slice(1) : current)
  }, [activeAlert])

  useEffect(() => {
    if (!activeAlert) return undefined
    const previousFocus = document.activeElement
    confirmButtonRef.current?.focus()

    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
    }
  }, [activeAlert])

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      finishAlert(false)
      return
    }
    if (event.key !== 'Tab') return

    const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled)')]
    if (!focusable.length) {
      event.preventDefault()
      dialogRef.current.focus()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const contextValue = useMemo(() => ({ showAlert }), [showAlert])
  const style = activeAlert ? alertStyles[activeAlert.type] ?? alertStyles.info : null
  const Icon = style?.icon

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {activeAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" onKeyDown={handleKeyDown}>
          <section
            ref={dialogRef}
            role={activeAlert.isConfirmation || activeAlert.type === 'error' || activeAlert.type === 'warning' ? 'alertdialog' : 'dialog'}
            aria-modal="true"
            aria-labelledby="app-alert-title"
            aria-describedby="app-alert-message"
            tabIndex={-1}
            className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/50 outline-none sm:p-6"
          >
            <div className="flex items-start gap-4">
              <span className={`grid size-11 shrink-0 place-items-center rounded-lg border ${style.border} ${style.background} ${style.color}`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0 pt-0.5">
                <h2 id="app-alert-title" className="text-lg font-semibold text-text-primary">{activeAlert.title || style.title}</h2>
                <p id="app-alert-message" className="mt-2 whitespace-pre-line text-sm leading-6 text-text-secondary">{activeAlert.message}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {activeAlert.isConfirmation && <Button variant="outline" onClick={() => finishAlert(false)}>{activeAlert.cancelLabel}</Button>}
              <Button
                ref={confirmButtonRef}
                variant={activeAlert.type === 'confirm' ? 'danger' : 'primary'}
                onClick={() => finishAlert(true)}
              >
                {activeAlert.confirmLabel}
              </Button>
            </div>
          </section>
        </div>
      )}
    </AlertContext.Provider>
  )
}
