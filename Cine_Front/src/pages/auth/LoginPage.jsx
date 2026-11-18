import { useRef, useState } from 'react'
import { Clapperboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card, Input, PageHeader } from '../../components/common/index.js'
import { InvalidCredentialsError } from '../../utils/InvalidCredentialsError.js'

const localPartPattern = /^[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*$/
const domainLabelPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/

function validate(values) {
  const errors = {}
  const email = values.email.trim()

  if (!email) {
    errors.email = 'Ingresá tu correo electrónico.'
  } else if (!isValidEmail(email)) {
    errors.email = 'Ingresá un correo electrónico válido.'
  }

  if (!values.password) {
    errors.password = 'Ingresá tu contraseña.'
  }

  return errors
}

function isValidEmail(email) {
  if (/\s/.test(email)) return false

  const atIndex = email.indexOf('@')
  if (atIndex <= 0 || atIndex !== email.lastIndexOf('@')) return false

  const localPart = email.slice(0, atIndex)
  const domain = email.slice(atIndex + 1)
  const domainLabels = domain.split('.')

  return (
    localPartPattern.test(localPart) &&
    domainLabels.length >= 2 &&
    domainLabels.every((label) => domainLabelPattern.test(label))
  )
}

/**
 * onAuthenticate({ email, password }) returns Promise<void>.
 * Its implementation owns session updates and navigation. It should reject with
 * InvalidCredentialsError for credential rejection and another error otherwise.
 */
function LoginPage({ onAuthenticate }) {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const submissionLock = useRef(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFormError(null)

    if (submitted) {
      setErrors(validate({ ...values, [name]: value }))
    }
  }

  const handleBlur = () => {
    if (submitted) setErrors(validate(values))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submissionLock.current) return

    setSubmitted(true)
    const validationErrors = validate(values)
    setErrors(validationErrors)
    setFormError(null)

    if (Object.keys(validationErrors).length > 0) return

    if (typeof onAuthenticate !== 'function') {
      setFormError({
        type: 'general',
        message: 'El inicio de sesión todavía no está conectado al servicio de autenticación.',
      })
      return
    }

    submissionLock.current = true
    setIsSubmitting(true)

    try {
      // onAuthenticate resuelve cuando actualizó la sesión y gestionó la navegación.
      // Recibe credenciales de la interfaz; su implementación adapta el request al contrato confirmado.
      await onAuthenticate({ email: values.email.trim(), password: values.password })
    } catch (error) {
      const isAuthenticationError = error instanceof InvalidCredentialsError
      setFormError({
        type: isAuthenticationError ? 'authentication' : 'general',
        message: isAuthenticationError
          ? 'No pudimos validar esas credenciales. Revisalas e intentá nuevamente.'
          : 'No se pudo completar el inicio de sesión. Intentá nuevamente.',
      })
    } finally {
      submissionLock.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full max-w-md py-8">
      <div className="mb-6 flex justify-center" aria-label="Cine2026">
        <span className="grid size-12 place-items-center rounded-lg bg-primary text-text-primary shadow-lg shadow-primary/20">
          <Clapperboard size={24} aria-hidden="true" />
        </span>
      </div>

      <Card className="space-y-6 sm:p-8">
        <PageHeader
          title="Iniciar sesión"
          description="Ingresá con tu cuenta para continuar."
          className="text-center [&>div:first-child]:mx-auto"
        />

        {formError && (
          <div
            className="rounded-md border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-text-primary"
            role="alert"
            aria-live="polite"
          >
            {formError.message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="nombre@ejemplo.com"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            inputMode="email"
            required
            disabled={isSubmitting}
            error={errors.email}
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            error={errors.password}
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>
            {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          <Link to="/" className="rounded-sm font-medium text-text-primary underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-offset-4">
            Volver a la cartelera
          </Link>
        </p>
      </Card>

      <p className="mt-4 text-center text-xs text-text-secondary">
        Cine2026 · Acceso para clientes y administración
      </p>
    </section>
  )
}

export default LoginPage
