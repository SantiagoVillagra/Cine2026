import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useAlerts } from '../hooks/useAlerts.js'
import cineLogo from '../utils/cine CS.png'

function SectionLayout({ section, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { showAlert } = useAlerts()
  const isAdminSubroute = location.pathname.startsWith('/admin/')

  const handleLogout = async () => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: 'Cerrar sesión',
      message: '¿Querés cerrar la sesión actual?',
      confirmLabel: 'Cerrar sesión',
      cancelLabel: 'Seguir conectado',
    })
    if (!confirmed) return
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={cineLogo} alt="Cine CS" className="size-10 object-contain" />
            <p className="text-sm font-medium text-text-secondary">Cine · {section}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm">
            <span className="hidden text-text-secondary sm:inline">{user?.email}</span>
            {user?.role === 'Admin' ? <>
              <Link to="/admin" className="rounded-md px-2 py-1 text-text-primary transition-colors hover:bg-surface-secondary hover:text-primary">
                {isAdminSubroute ? 'Volver a inicio admin' : 'Inicio admin'}
              </Link>
            </> : <>
              <Link to="/cliente/perfil" className="text-text-primary transition-colors hover:text-primary">Mi perfil</Link>
            </>}
            <Link to="/" className="text-text-primary transition-colors hover:text-primary">Cartelera</Link>
            <button type="button" onClick={handleLogout} className="font-medium text-text-primary transition-colors hover:text-primary">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}

export default SectionLayout
