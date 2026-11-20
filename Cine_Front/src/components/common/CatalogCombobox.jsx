import { useId, useState } from 'react'
import { X } from 'lucide-react'

function normalize(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('es-AR')
}

function CatalogCombobox({
  label,
  options = [],
  value,
  onChange,
  multiple = false,
  required = false,
  disabled = false,
  error,
  placeholder = 'Escribí para buscar…',
  helperText,
}) {
  const generatedId = useId()
  const inputId = `catalog-input-${generatedId}`
  const listId = `catalog-options-${generatedId}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const selectedIds = multiple ? value : []
  const selectedOptions = multiple
    ? options.filter((option) => selectedIds.includes(option.id))
    : []
  const selectedOption = multiple ? null : options.find((option) => option.id === value)
  const normalizedQuery = normalize(query)
  const filteredOptions = options.filter((option) => {
    if (multiple && selectedIds.includes(option.id)) return false
    return !normalizedQuery || normalize(option.nombre).includes(normalizedQuery)
  })

  const selectOption = (option) => {
    if (multiple) onChange([...selectedIds, option.id])
    else {
      onChange(option.id)
      setOpen(false)
    }
    setQuery('')
  }

  const removeOption = (optionId) => onChange(selectedIds.filter((id) => id !== optionId))

  return (
    <div className="grid gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
        {label}{required ? ' *' : ''}
      </label>
      <div>
        <div className={`flex min-h-10 flex-wrap items-center gap-2 rounded-md border bg-surface px-3 py-2 text-sm ${error ? 'border-danger' : 'border-border'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
          {selectedOptions.map((option) => (
            <span key={option.id} className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-text-primary">
              {option.nombre}
              <button type="button" aria-label={`Quitar ${option.nombre}`} disabled={disabled} onClick={() => removeOption(option.id)} className="rounded-sm text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary">
                <X size={14} aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            id={inputId}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            value={open || multiple ? query : selectedOption?.nombre ?? ''}
            placeholder={placeholder}
            disabled={disabled}
            required={required && !multiple && !value}
            onFocus={() => { setOpen(true); setQuery('') }}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
              if (!multiple && value) onChange('')
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
              if (event.key === 'Enter' && open && filteredOptions[0]) {
                event.preventDefault()
                selectOption(filteredOptions[0])
              }
              if (event.key === 'Backspace' && multiple && !query && selectedIds.length) {
                removeOption(selectedIds[selectedIds.length - 1])
              }
            }}
            onBlur={() => setOpen(false)}
            className="min-w-24 flex-1 bg-transparent py-0.5 text-sm text-text-primary outline-none placeholder:text-text-secondary/70 disabled:cursor-not-allowed"
          />
        </div>
        {open && !disabled && (
          <ul id={listId} role="listbox" aria-multiselectable={multiple || undefined} className="mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-surface py-1 shadow-xl">
            {filteredOptions.length
              ? filteredOptions.map((option) => (
                <li key={option.id} role="option" aria-selected={multiple ? selectedIds.includes(option.id) : value === option.id}>
                  <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectOption(option)} className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-secondary focus-visible:bg-surface-secondary focus-visible:outline-none">
                    {option.nombre}
                  </button>
                </li>
              ))
              : <li className="px-3 py-2 text-sm text-text-secondary">No se encontraron coincidencias.</li>}
          </ul>
        )}
      </div>
      {error && <p id={errorId} className="text-xs text-danger" role="alert">{error}</p>}
      {!error && helperText && <p id={helperId} className="text-xs text-text-secondary">{helperText}</p>}
    </div>
  )
}

export default CatalogCombobox
