import { ArrowUpRight, Clapperboard, Film, ReceiptText, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/common/Card.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'

const sections = [
  {
    title: 'Dashboard',
    description: 'Consultar el resumen y las estadísticas del sistema.',
    to: '/admin/dashboard',
    icon: Clapperboard,
  },
  {
    title: 'Películas',
    description: 'Administrar las películas del cine.',
    to: '/admin/peliculas',
    icon: Film,
  },
  {
    title: 'Funciones',
    description: 'Administrar las funciones disponibles.',
    to: '/admin/funciones',
    icon: Ticket,
  },
  {
    title: 'Facturas',
    description: 'Consultar y gestionar las facturas.',
    to: '/admin/facturas',
    icon: ReceiptText,
  },
]

function AdminHomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader
        title="Administración"
        description="Elegí una sección para gestionar el cine."
      />

      <nav aria-label="Secciones de administración" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
        {sections.map(({ title, description, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Card className="flex h-full min-h-40 items-start gap-4 transition duration-200 group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:bg-surface-secondary group-hover:shadow-lg group-hover:shadow-black/20 group-active:translate-y-0 sm:min-h-44 sm:gap-5 sm:p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-text-primary">
                <Icon size={23} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold text-text-primary">{title}</span>
                  <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-text-secondary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </span>
                <span className="mt-2 block text-sm leading-6 text-text-secondary">{description}</span>
              </span>
            </Card>
          </Link>
        ))}
      </nav>
    </main>
  )
}

export default AdminHomePage
