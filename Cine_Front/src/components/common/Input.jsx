import { useId } from 'react'

function Input({
  label,
  placeholder,
  error,
  helperText,
  disabled = false,
  id,
  className = '',
  containerClassName = '',
  'aria-describedby': describedBy,
  ...props
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`
  const describedByIds = [describedBy, helperText && helperId, error && errorId]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`grid gap-2 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedByIds || undefined}
        className={`min-h-10 w-full rounded-md border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 disabled:cursor-not-allowed disabled:opacity-60 ${error ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:border-primary'} ${className}`}
        {...props}
      />
      {helperText && (
        <p id={helperId} className="text-xs text-text-secondary">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
