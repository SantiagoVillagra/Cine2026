import { useEffect, useId, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { formatDateForInput, parseDateInput } from '../../utils/dateInput.js'

function DatePicker({
  label,
  value = '',
  onChange,
  onValidityChange,
  min,
  max,
  error,
  required = false,
  disabled = false,
  showFormatHint = true,
  id,
  name,
  className = '',
  containerClassName = '',
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const nativeInputRef = useRef(null)
  const isFocused = useRef(false)
  const [displayValue, setDisplayValue] = useState(() => formatDateForInput(value))
  const helperId = `${inputId}-format`
  const errorId = `${inputId}-error`

  useEffect(() => {
    if (!isFocused.current) setDisplayValue(formatDateForInput(value))
  }, [value])

  const emitValue = (isoValue, valid) => {
    onChange?.({ target: { name, value: isoValue } })
    onValidityChange?.(valid)
  }

  const updateFromText = (text) => {
    setDisplayValue(text)
    if (!text) {
      emitValue('', true)
      return
    }

    const isoValue = parseDateInput(text)
    const withinRange = isoValue && (!min || isoValue >= min) && (!max || isoValue <= max)
    emitValue(withinRange ? isoValue : '', Boolean(withinRange))
  }

  const openCalendar = () => {
    const nativeInput = nativeInputRef.current
    if (!nativeInput) return
    if (typeof nativeInput.showPicker === 'function') nativeInput.showPicker()
    else nativeInput.click()
  }

  return (
    <div className={`grid gap-2 ${containerClassName}`}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-text-primary">{label}</label>}
      <div className="relative flex">
        <input
          id={inputId}
          name={name}
          type="text"
          inputMode="numeric"
          placeholder="dd/mm/yyyy"
          value={displayValue}
          onChange={(event) => updateFromText(event.target.value)}
          onFocus={() => { isFocused.current = true }}
          onBlur={() => { isFocused.current = false; setDisplayValue(formatDateForInput(value)) }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : showFormatHint ? helperId : undefined}
          autoComplete="off"
          required={required}
          disabled={disabled}
          className={`min-h-10 w-full rounded-md border bg-surface px-3 py-2 pr-11 text-sm text-text-primary placeholder:text-text-secondary/70 disabled:cursor-not-allowed disabled:opacity-60 ${error ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:border-primary'} ${className}`}
        />
        <button
          type="button"
          aria-label={label ? `Elegir ${label.toLowerCase()}` : 'Abrir calendario'}
          disabled={disabled}
          onClick={openCalendar}
          className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-md text-text-secondary transition-colors hover:bg-surface-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarDays size={18} aria-hidden="true" />
        </button>
        <input
          ref={nativeInputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(event) => {
            const isoValue = event.target.value
            setDisplayValue(formatDateForInput(isoValue))
            emitValue(isoValue, true)
          }}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-1/2 size-px -translate-y-1/2 opacity-0"
        />
      </div>
      {error ? <p id={errorId} className="text-xs text-danger" role="alert">{error}</p> : showFormatHint ? <p id={helperId} className="text-xs text-text-secondary">Formato: dd/mm/yyyy</p> : null}
    </div>
  )
}

export default DatePicker
