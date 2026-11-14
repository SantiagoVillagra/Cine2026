const paddings = {
  none: '',
  small: 'p-3',
  medium: 'p-5',
  large: 'p-8',
}

function Card({ children, padding = 'medium', className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
