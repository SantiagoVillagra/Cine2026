import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, EmptyState, Loading, PageHeader } from '../../components/common/index.js'
import { getClientProfile } from '../../services/clientService.js'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage.js'

function ProfilePage() {
  const [retryKey, setRetryKey] = useState(0)
  const [profileState, setProfileState] = useState({ requestKey: null, isLoading: true, error: null, data: null })

  useEffect(() => {
    const controller = new AbortController()

    getClientProfile({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setProfileState({ requestKey: retryKey, isLoading: false, error: null, data })
      })
      .catch((error) => {
        if (!controller.signal.aborted) setProfileState({ requestKey: retryKey, isLoading: false, error, data: null })
      })

    return () => controller.abort()
  }, [retryKey])

  const currentProfileState = profileState.requestKey === retryKey
    ? profileState
    : { isLoading: true, error: null, data: null }
  const profile = currentProfileState.data
  const fullName = [profile?.nombre, profile?.apellido].filter(Boolean).join(' ')

  return (
    <main className="mx-auto w-full max-w-4xl space-y-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader title="Mi perfil" description="Tus datos de cliente." />

      {currentProfileState.isLoading && <Card className="flex min-h-48 items-center justify-center"><Loading text="Cargando perfil…" /></Card>}
      {currentProfileState.error && <EmptyState title="No se pudo cargar el perfil" description={getApiErrorMessage(currentProfileState.error)} action={<Button onClick={() => setRetryKey((key) => key + 1)}>Reintentar</Button>} />}
      {profile && <Card className="space-y-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-text-secondary">Nombre completo</dt>
            <dd className="mt-1 font-medium text-text-primary">{fullName || 'No informado'}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Correo electrónico</dt>
            <dd className="mt-1 break-all font-medium text-text-primary">{profile.email || 'No informado'}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Teléfono</dt>
            <dd className="mt-1 font-medium text-text-primary">{profile.telefono || 'No informado'}</dd>
          </div>
        </dl>

        <div className="border-t border-border pt-5">
          <Link to="/cliente/mis-compras" className="inline-flex min-h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-primary">
            Mis compras
          </Link>
        </div>
      </Card>}
    </main>
  )
}

export default ProfilePage
