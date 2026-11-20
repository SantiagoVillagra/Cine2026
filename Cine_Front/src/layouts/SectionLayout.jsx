import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function SectionLayout({ section, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-sm font-medium text-text-secondary">Cine · {section}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-text-secondary sm:inline">{user?.email}</span>
            {user?.role === 'Admin' ? <>
              <Link to="/admin/facturas" className="text-text-primary transition-colors hover:text-primary">Facturas</Link>
            </> : <>
              <Link to="/cliente/mis-compras" className="text-text-primary transition-colors hover:text-primary">Mis compras</Link>
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
