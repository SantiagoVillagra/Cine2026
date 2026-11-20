import { useState } from 'react'
import { Clapperboard, Menu, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = `${location.pathname}${location.search}${location.hash}`

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-md focus-visible:outline-offset-4"
          aria-label="Cine2026, inicio"
          onClick={closeMenu}
        >
          <span className="grid size-10 place-items-center rounded-lg bg-primary text-text-primary shadow-lg shadow-primary/20">
            <Clapperboard size={20} aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-text-primary">
            CINE<span className="text-primary">2026</span>
          </span>
        </Link>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-md border border-border text-text-primary transition-colors hover:bg-surface-secondary sm:hidden"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>

        <nav
          id="public-navigation"
          aria-label="Navegación principal"
          className={`${menuOpen ? 'grid' : 'hidden'} absolute inset-x-0 top-full gap-1 border-b border-border bg-background px-4 py-3 sm:static sm:flex sm:items-center sm:gap-2 sm:border-0 sm:bg-transparent sm:p-0`}
        >
          <Link
            to="/#cartelera"
            onClick={closeMenu}
            className="rounded-md px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Cartelera
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={user.role === 'Admin' ? '/admin/dashboard' : '/cliente/reservas'}
                onClick={closeMenu}
                className="rounded-md px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
              >
                Mi cuenta
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-primary transition-colors hover:bg-surface-secondary"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              state={{ from: currentPath }}
              onClick={closeMenu}
              className="rounded-md border border-primary bg-primary px-4 py-2.5 text-center text-sm font-semibold text-text-primary transition-colors hover:border-primary-hover hover:bg-primary-hover"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default PublicNavbar
