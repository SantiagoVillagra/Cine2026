import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button, Card, CatalogCombobox, DatePicker, Input, PageHeader } from '../../components/common/index.js'
import { createMovie } from '../../services/adminMovieService.js'
import { getActors, getClassifications, getDirectors, getGenres } from '../../services/movieCatalogService.js'
import { useAlerts } from '../../hooks/useAlerts.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'
import { validateMovieForm } from '../../utils/adminMovies.js'

const initialValues = { titulo: '', duracion: '', idClasificacion: '', idDirector: '', fechaEstreno: '', poster: '', sinopsis: '', idsGeneros: [], idsActores: [] }
const emptyCatalogs = { classifications: [], directors: [], genres: [], actors: [] }

function NewMoviePage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [catalogs, setCatalogs] = useState(emptyCatalogs)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')
  const [catalogRetry, setCatalogRetry] = useState(0)
  const submitLock = useRef(false)
  const { showAlert } = useAlerts()

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      getClassifications({ signal: controller.signal }),
      getDirectors({ signal: controller.signal }),
      getGenres({ signal: controller.signal }),
      getActors({ signal: controller.signal }),
    ]).then(([classifications, directors, genres, actors]) => {
      if (!controller.signal.aborted) {
        setCatalogs({ classifications, directors, genres, actors })
        setCatalogLoading(false)
      }
    }).catch((error) => {
      if (!controller.signal.aborted) {
        setCatalogError(getApiErrorMessage(error, 'No se pudieron cargar los catálogos.'))
        setCatalogLoading(false)
      }
    })
    return () => controller.abort()
  }, [catalogRetry])

  const retryCatalogs = () => {
    setCatalogLoading(true)
    setCatalogError('')
    setCatalogRetry((value) => value + 1)
  }

  const update = (event) => updateField(event.target.name, event.target.value)

  const updateField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
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
      const movieId = response?.idPelicula
      await showAlert({
        type: 'success',
        title: 'Película creada',
        message: movieId ? `La película se creó correctamente con el ID ${movieId}.` : 'La película se creó correctamente.',
      })
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'No se pudo crear la película.'))
    } finally {
      submitLock.current = false
      setSubmitting(false)
    }
  }

  const clearForm = () => {
    setValues(initialValues)
    setErrors({})
    setApiError('')
  }

  return <main className="mx-auto w-full max-w-4xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <PageHeader title="Nueva película" description="Completá los datos requeridos para incorporarla al catálogo."
      actions={<Link className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary" to="/admin/peliculas"><ArrowLeft size={16} />Volver al listado</Link>} />
    {catalogError && <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert"><span>No se pudieron cargar los catálogos: {catalogError}</span><Button variant="outline" size="small" icon={<RefreshCw size={15} />} onClick={retryCatalogs}>Reintentar</Button></div>}
    {apiError && <p className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">{apiError}</p>}
    <Card><form className="space-y-6" onSubmit={submit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Título *" name="titulo" value={values.titulo} onChange={update} error={errors.titulo} maxLength={200} required />
        <Input label="Duración en minutos *" name="duracion" type="number" min="1" max="600" step="1" value={values.duracion} onChange={update} error={errors.duracion} required />
        <CatalogCombobox label="Clasificación" options={catalogs.classifications} value={values.idClasificacion} onChange={(value) => updateField('idClasificacion', value)} error={errors.idClasificacion} required disabled={catalogLoading || Boolean(catalogError) || submitting} placeholder="Buscar clasificación" helperText={catalogLoading ? 'Cargando clasificaciones…' : undefined} />
        <CatalogCombobox label="Director" options={catalogs.directors} value={values.idDirector} onChange={(value) => updateField('idDirector', value)} error={errors.idDirector} required disabled={catalogLoading || Boolean(catalogError) || submitting} placeholder="Buscar director" helperText={catalogLoading ? 'Cargando directores…' : undefined} />
        <DatePicker label="Fecha de estreno *" name="fechaEstreno" value={values.fechaEstreno} onChange={update} error={errors.fechaEstreno} required />
        <Input label="Póster (ruta o URL) *" name="poster" value={values.poster} onChange={update} error={errors.poster} maxLength={300} placeholder="/imagenes/poster.jpg" required />
      </div>
      <label className="grid gap-2 text-sm font-medium text-text-primary" htmlFor="movie-sinopsis">Sinopsis<textarea id="movie-sinopsis" name="sinopsis" value={values.sinopsis} onChange={update} rows={4} className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-primary" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <CatalogCombobox label="Géneros" options={catalogs.genres} value={values.idsGeneros} onChange={(value) => updateField('idsGeneros', value)} multiple disabled={catalogLoading || Boolean(catalogError) || submitting} placeholder="Buscar y agregar géneros" helperText={catalogLoading ? 'Cargando géneros…' : 'Podés seleccionar varios.'} error={errors.idsGeneros} />
        <CatalogCombobox label="Actores" options={catalogs.actors} value={values.idsActores} onChange={(value) => updateField('idsActores', value)} multiple disabled={catalogLoading || Boolean(catalogError) || submitting} placeholder="Buscar y agregar actores" helperText={catalogLoading ? 'Cargando actores…' : 'Podés seleccionar varios.'} error={errors.idsActores} />
      </div>
      <div className="flex flex-wrap gap-3"><Button type="submit" loading={submitting} disabled={catalogLoading || Boolean(catalogError)}>Crear película</Button><Button type="button" variant="outline" disabled={submitting} onClick={clearForm}>Limpiar</Button></div>
    </form></Card>
  </main>
}

export default NewMoviePage
