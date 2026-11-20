import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button, Card, DatePicker, PageHeader } from '../../components/common/index.js'
import { useAlerts } from '../../hooks/useAlerts.js'
import { getMovies } from '../../services/publicCatalogService.js'
import { createShowtime } from '../../services/adminShowtimeService.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { requestShowtimeCreation, validateShowtimeForm } from '../../utils/adminShowtimes.js'

const initialValues = { fecha: '', idHoraFuncion: '', subtitulada: '', idPelicula: '', idSala: '', idIdioma: '' }
const hours = [{ id: 1, label: '15:00' }, { id: 2, label: '18:00' }, { id: 3, label: '22:00' }]
const languages = [{ id: 1, label: 'Español' }, { id: 2, label: 'Inglés' }]
const rooms = [{ id: 1, label: 'Sala 1' }, { id: 2, label: 'Sala 2' }, { id: 3, label: 'Sala 3' }]

function SelectField({ label, name, value, onChange, error, disabled = false, placeholder = 'Seleccioná una opción', children }) {
  const id = `new-showtime-${name}`
  const errorId = `${id}-error`

  return (
    <label htmlFor={id} className="grid content-start gap-2 text-sm font-medium text-text-primary">
      <span>{label} *</span>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-10 w-full rounded-md border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${error ? 'border-danger' : 'border-border'}`}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      {error && <span id={errorId} className="text-xs text-danger" role="alert">{error}</span>}
    </label>
  )
}

function NewShowtimePage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [movieRetry, setMovieRetry] = useState(0)
  const [moviesState, setMoviesState] = useState({ requestKey: null, isLoading: true, error: null, data: [] })
  const submitLock = useRef(false)
  const { showAlert } = useAlerts()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()

    getMovies({ signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) {
          setMoviesState({ requestKey: movieRetry, isLoading: false, error: null, data: items.filter((movie) => movie?.activa === true) })
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setMoviesState({ requestKey: movieRetry, isLoading: false, error, data: [] })
      })

    return () => controller.abort()
  }, [movieRetry])

  const currentMoviesState = moviesState.requestKey === movieRetry
    ? moviesState
    : { isLoading: true, error: null, data: [] }

  const update = (event) => {
    setValues((state) => ({ ...state, [event.target.name]: event.target.value }))
    setErrors((state) => ({
      ...state,
      [event.target.name]: undefined,
      ...(event.target.name === 'idPelicula' ? { fecha: undefined } : {}),
    }))
    setApiError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submitLock.current) return

    const validation = validateShowtimeForm(values)
    const selectedMovie = currentMoviesState.data.find((movie) => String(movie.idPelicula) === values.idPelicula)
    const selectedMovieExists = Boolean(selectedMovie)
    if (values.idPelicula && !selectedMovieExists) validation.errors.idPelicula = 'Seleccioná una película activa.'
    if (!selectedMovieExists) validation.payload = null
    const releaseDate = typeof selectedMovie?.fechaEstreno === 'string' ? selectedMovie.fechaEstreno.slice(0, 10) : ''
    if (validation.payload && releaseDate && releaseDate > values.fecha) {
      validation.errors.fecha = 'La función no puede programarse antes de la fecha de estreno de la película.'
      validation.payload = null
    }

    setErrors(validation.errors)
    setApiError('')
    if (!validation.payload) return

    submitLock.current = true
    const selectedHour = hours.find((hour) => String(hour.id) === values.idHoraFuncion)?.label
    const confirmed = await showAlert({
      type: 'confirm',
      title: 'Confirmar nueva función',
      message: `¿Confirmás programar «${selectedMovie.titulo}» para el ${values.fecha} a las ${selectedHour}?`,
      confirmLabel: 'Crear función',
      cancelLabel: 'Revisar datos',
    })
    if (!confirmed) {
      submitLock.current = false
      return
    }

    setSubmitting(true)
    try {
      const result = await requestShowtimeCreation(validation.payload, createShowtime)
      if (result.status === 'success') {
        const createdId = result.data?.idFuncion
        await showAlert({
          type: 'success',
          title: 'Función creada',
          message: createdId ? `La función se creó correctamente con el ID ${createdId}.` : 'La función se creó correctamente.',
          confirmLabel: 'Ir a funciones',
        })
        navigate('/admin/funciones', { replace: true })
      } else setApiError(getApiErrorMessage(result.error, 'No se pudo crear la función.'))
    } finally {
      submitLock.current = false
      setSubmitting(false)
    }
  }

  const retryMovies = () => setMovieRetry((key) => key + 1)

  return <main className="mx-auto w-full max-w-4xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <PageHeader title="Nueva función" description="Programá una película activa en una de las salas disponibles."
      actions={<Link className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary" to="/admin/funciones"><ArrowLeft size={16} />Volver al listado</Link>} />
    {currentMoviesState.error && <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert"><span>No se pudieron cargar las películas: {getApiErrorMessage(currentMoviesState.error)}</span><Button variant="outline" size="small" icon={<RefreshCw size={15} />} onClick={retryMovies}>Reintentar</Button></div>}
    {apiError && <p className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{apiError}</p>}
    <Card><form className="space-y-6" onSubmit={submit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <DatePicker label="Fecha *" name="fecha" value={values.fecha} onChange={update} onValidityChange={(valid) => setErrors((current) => ({ ...current, fecha: valid ? undefined : 'Ingresá una fecha válida.' }))} error={errors.fecha} required disabled={submitting} showFormatHint={false} />
        <SelectField label="Horario" name="idHoraFuncion" value={values.idHoraFuncion} onChange={update} error={errors.idHoraFuncion} disabled={submitting}>
          {hours.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </SelectField>
        <SelectField label="Película" name="idPelicula" value={values.idPelicula} onChange={update} error={errors.idPelicula} disabled={currentMoviesState.isLoading || Boolean(currentMoviesState.error) || submitting} placeholder={currentMoviesState.isLoading ? 'Cargando películas…' : currentMoviesState.error ? 'No se pudieron cargar' : currentMoviesState.data.length ? 'Seleccioná una película' : 'No hay películas activas'}>
          {currentMoviesState.data.map((movie) => <option key={movie.idPelicula} value={movie.idPelicula}>{movie.titulo}</option>)}
        </SelectField>
        <SelectField label="Sala" name="idSala" value={values.idSala} onChange={update} error={errors.idSala} disabled={submitting}>
          {rooms.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </SelectField>
        <SelectField label="Idioma" name="idIdioma" value={values.idIdioma} onChange={update} error={errors.idIdioma} disabled={submitting}>
          {languages.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </SelectField>
        <SelectField label="¿Subtitulada?" name="subtitulada" value={values.subtitulada} onChange={update} error={errors.subtitulada} disabled={submitting}>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </SelectField>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={submitting} disabled={currentMoviesState.isLoading || Boolean(currentMoviesState.error) || currentMoviesState.data.length === 0}>Crear función</Button>
        <Button type="button" variant="outline" disabled={submitting} onClick={() => { setValues(initialValues); setErrors({}); setApiError('') }}>Limpiar</Button>
      </div>
    </form></Card>
  </main>
}

export default NewShowtimePage
