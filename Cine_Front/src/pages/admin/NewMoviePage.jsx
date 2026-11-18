import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button, Card, Input, PageHeader } from '../../components/common/index.js'
import { createMovie } from '../../services/adminMovieService.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { validateMovieForm } from '../../utils/adminMovies.js'

const initialValues = { titulo: '', duracion: '', idClasificacion: '', idDirector: '', fechaEstreno: '', poster: '', sinopsis: '', idsGeneros: '', idsActores: '' }

function NewMoviePage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [createdId, setCreatedId] = useState(null)
  const submitLock = useRef(false)

  const update = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setErrors((current) => ({ ...current, [event.target.name]: undefined }))
    setApiError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submitLock.current) return
    const validation = validateMovieForm(values)
    setErrors(validation.errors)
    setApiError('')
    if (!validation.payload) return
    submitLock.current = true
    setSubmitting(true)
    try {
      const response = await createMovie(validation.payload)
      setCreatedId(response?.idPelicula ?? null)
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'No se pudo crear la película.'))
    } finally {
      submitLock.current = false
      setSubmitting(false)
    }
  }

  return <main className="mx-auto w-full max-w-4xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <PageHeader title="Nueva película" description="Completá los datos requeridos para incorporarla al catálogo."
      actions={<Link className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary" to="/admin/peliculas"><ArrowLeft size={16} />Volver al listado</Link>} />
    {createdId !== null && <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-text-primary" role="status"><CheckCircle2 size={19} className="mt-0.5 shrink-0 text-success" /><div><p className="font-semibold">Película creada correctamente.</p><p className="mt-1 text-text-secondary">ID asignado: {createdId}. La API confirmó la operación.</p><Link className="mt-2 inline-block text-primary underline" to="/admin/peliculas">Regresar al listado</Link></div></div>}
    {apiError && <p className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{apiError}</p>}
    <Card><form className="space-y-6" onSubmit={submit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Título *" name="titulo" value={values.titulo} onChange={update} error={errors.titulo} maxLength={200} required />
        <Input label="Duración en minutos *" name="duracion" type="number" min="1" max="600" step="1" value={values.duracion} onChange={update} error={errors.duracion} required />
        <Input label="ID de clasificación *" name="idClasificacion" type="number" min="1" step="1" value={values.idClasificacion} onChange={update} error={errors.idClasificacion} helperText="ID existente; ingreso manual provisorio hasta disponer de un catálogo." required />
        <Input label="ID de director *" name="idDirector" type="number" min="1" step="1" value={values.idDirector} onChange={update} error={errors.idDirector} helperText="ID existente; ingreso manual provisorio hasta disponer de un catálogo." required />
        <Input label="Fecha de estreno *" name="fechaEstreno" type="date" value={values.fechaEstreno} onChange={update} error={errors.fechaEstreno} required />
        <Input label="Póster (ruta o URL) *" name="poster" value={values.poster} onChange={update} error={errors.poster} maxLength={300} placeholder="/imagenes/poster.jpg" required />
      </div>
      <label className="grid gap-2 text-sm font-medium text-text-primary" htmlFor="movie-sinopsis">Sinopsis<textarea id="movie-sinopsis" name="sinopsis" value={values.sinopsis} onChange={update} rows={4} className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-primary" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="IDs de géneros" name="idsGeneros" value={values.idsGeneros} onChange={update} error={errors.idsGeneros} placeholder="1, 2" helperText="IDs existentes separados por comas; puede dejarse vacío." />
        <Input label="IDs de actores" name="idsActores" value={values.idsActores} onChange={update} error={errors.idsActores} placeholder="3, 7" helperText="IDs existentes separados por comas; puede dejarse vacío." />
      </div>
      <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed text-text-secondary">Solución provisoria. La API no documenta catálogos para clasificaciones, directores, géneros ni actores. Ingresá IDs ya existentes; el servidor validará las referencias. No se ofrecen opciones inventadas.</p>
      <div className="flex flex-wrap gap-3"><Button type="submit" loading={submitting}>Crear película</Button><Button type="button" variant="outline" disabled={submitting} onClick={() => { setValues(initialValues); setErrors({}); setApiError(''); setCreatedId(null) }}>Limpiar</Button></div>
    </form></Card>
  </main>
}

export default NewMoviePage
