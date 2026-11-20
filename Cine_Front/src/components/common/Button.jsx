import { LoaderCircle } from 'lucide-react'

const variants = {
  primary: 'border border-primary bg-primary text-text-primary hover:bg-primary-hover hover:border-primary-hover',
  secondary:
    'border border-border bg-surface-secondary text-text-primary hover:bg-border',
  outline:
    'border border-border bg-transparent text-text-primary hover:border-text-secondary hover:bg-surface',
  danger: 'border border-danger bg-danger text-text-primary hover:bg-primary-hover',
}

const sizes = {
  small: 'min-h-9 px-3 py-1.5 text-sm',
  medium: 'min-h-10 px-4 py-2 text-sm',
  large: 'min-h-12 px-5 py-3 text-base',
}

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'start',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ref,
  ...props
}) {
  const leadingIcon = loading ? (
    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
  ) : (
    icon
  )

  return (
    <button
      type={type}
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {leadingIcon && iconPosition === 'start' && (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
      {leadingIcon && iconPosition === 'end' && (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
    </button>
  )
}

export default Button
