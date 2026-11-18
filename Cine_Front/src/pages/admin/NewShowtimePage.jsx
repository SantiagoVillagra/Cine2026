import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button, Card, Input, PageHeader } from '../../components/common/index.js'
import { createShowtime } from '../../services/adminShowtimeService.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { requestShowtimeCreation, validateShowtimeForm } from '../../utils/adminShowtimes.js'

const initialValues = { fecha: '', idHoraFuncion: '', subtitulada: '', idPelicula: '', idSala: '', idIdioma: '' }

function NewShowtimePage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [createdId, setCreatedId] = useState(null)
  const submitLock = useRef(false)

  const update = (event) => {
    setValues((state) => ({ ...state, [event.target.name]: event.target.value }))
    setErrors((state) => ({ ...state, [event.target.name]: undefined }))
    setApiError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submitLock.current) return
    const validation = validateShowtimeForm(values)
    setErrors(validation.errors)
    setApiError('')
    if (!validation.payload) return
    submitLock.current = true
    setSubmitting(true)
    try {
      const result = await requestShowtimeCreation(validation.payload, createShowtime)
      if (result.status === 'success') setCreatedId(result.data?.idFuncion ?? null)
      else setApiError(getApiErrorMessage(result.error, 'No se pudo crear la función.'))
    } finally {
      submitLock.current = false
      setSubmitting(false)
    }
  }

  return <main className="mx-auto w-full max-w-4xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <PageHeader title="Nueva función" description="Programá una función con referencias existentes del catálogo."
      actions={<Link className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary" to="/admin/funciones"><ArrowLeft size={16} />Volver al listado</Link>} />
    {createdId !== null && <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-text-primary" role="status"><CheckCircle2 size={19} className="mt-0.5 shrink-0 text-success" /><div><p className="font-semibold">Función creada correctamente.</p><p className="mt-1 text-text-secondary">ID asignado: {createdId}. La API confirmó la operación.</p><Link className="mt-2 inline-block text-primary underline" to="/admin/funciones">Regresar al listado</Link></div></div>}
    {apiError && <p className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{apiError}</p>}
    <Card><form className="space-y-6" onSubmit={submit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Fecha *" name="fecha" type="date" value={values.fecha} onChange={update} error={errors.fecha} required />
        <Input label="ID de horario *" name="idHoraFuncion" type="number" min="1" step="1" value={values.idHoraFuncion} onChange={update} error={errors.idHoraFuncion} helperText="ID existente; ingreso manual provisorio hasta disponer de un catálogo." required />
        <Input label="ID de película *" name="idPelicula" type="number" min="1" step="1" value={values.idPelicula} onChange={update} error={errors.idPelicula} helperText="ID existente; ingreso manual provisorio hasta disponer de un catálogo." required />
        <Input label="ID de sala *" name="idSala" type="number" min="1" step="1" value={values.idSala} onChange={update} error={errors.idSala} helperText="ID existente; ingreso manual provisorio hasta disponer de un catálogo." required />
        <Input label="ID de idioma *" name="idIdioma" type="number" min="1" step="1" value={values.idIdioma} onChange={update} error={errors.idIdioma} helperText="ID existente; ingreso manual provisorio hasta disponer de un catálogo." required />
        <label className="grid gap-2 text-sm font-medium text-text-primary" htmlFor="showtime-subtitled">¿Subtitulada? *<select id="showtime-subtitled" name="subtitulada" value={values.subtitulada} onChange={update} aria-invalid={Boolean(errors.subtitulada)} aria-describedby={errors.subtitulada ? 'showtime-subtitled-error' : undefined} className="min-h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-primary"><option value="">Seleccioná una opción</option><option value="true">Sí</option><option value="false">No</option></select>{errors.subtitulada && <span id="showtime-subtitled-error" className="text-xs text-danger" role="alert">{errors.subtitulada}</span>}</label>
      </div>
      <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed text-text-secondary">Solución provisoria. No hay endpoints de catálogo documentados para consultar horarios, películas, salas o idiomas. Ingresá IDs existentes; el backend validará las referencias y comprobará que la película esté activa y que no haya superposición en la sala.</p>
      <div className="flex flex-wrap gap-3"><Button type="submit" loading={submitting}>Crear función</Button><Button type="button" variant="outline" disabled={submitting} onClick={() => { setValues(initialValues); setErrors({}); setApiError(''); setCreatedId(null) }}>Limpiar</Button></div>
    </form></Card>
  </main>
}

export default NewShowtimePage
