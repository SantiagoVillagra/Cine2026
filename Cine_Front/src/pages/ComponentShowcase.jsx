import { useState } from 'react'
import { ArrowRight, Ticket } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Loading,
  PageHeader,
} from '../components/common/index.js'

function ShowcaseSection({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  )
}

function ComponentShowcase() {
  const [email, setEmail] = useState('cine@example.com')

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-text-primary sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <PageHeader
          title="Biblioteca visual"
          description="Muestra temporal de componentes reutilizables y sus estados. Disponible solo durante el desarrollo."
          actions={<Badge variant="info">Design system</Badge>}
        />

        <ShowcaseSection title="Button">
          <Card className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button icon={<Ticket size={16} />}>Comprar entradas</Button>
              <Button variant="outline" icon={<ArrowRight size={16} />} iconPosition="end">
                Ver funciones
              </Button>
              <Button loading>Procesando</Button>
              <Button disabled>Deshabilitado</Button>
            </div>
          </Card>
        </ShowcaseSection>

        <ShowcaseSection title="Input">
          <Card className="grid gap-5 md:grid-cols-2">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="nombre@correo.com"
              helperText="Usamos este correo para identificar tu cuenta."
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              label="Código postal"
              placeholder="Ej. 5000"
              error="Ingresá un código postal válido."
              defaultValue="12"
            />
            <Input label="Campo deshabilitado" value="No editable" disabled readOnly />
          </Card>
        </ShowcaseSection>

        <ShowcaseSection title="Card">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <p className="text-sm text-text-secondary">Próxima función</p>
              <h3 className="mt-2 text-lg font-semibold">Sala 2 · 20:30</h3>
              <p className="mt-1 text-sm text-text-secondary">Subtitulada · 2D</p>
            </Card>
            <Card className="border-primary/50">
              <p className="text-sm text-text-secondary">Card con clase adicional</p>
              <p className="mt-2">El componente permite personalizar su contenedor.</p>
            </Card>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Badge">
          <Card className="flex flex-wrap items-center gap-3">
            <Badge>2D</Badge>
            <Badge variant="success">Disponible</Badge>
            <Badge variant="warning">Pendiente</Badge>
            <Badge variant="danger">Cancelada</Badge>
            <Badge variant="info">3D</Badge>
          </Card>
        </ShowcaseSection>

        <ShowcaseSection title="PageHeader">
          <Card>
            <PageHeader
              title="Cartelera"
              description="Explorá las películas y funciones disponibles."
              actions={<Button size="small" icon={<Ticket size={16} />}>Mis entradas</Button>}
            />
          </Card>
        </ShowcaseSection>

        <ShowcaseSection title="EmptyState">
          <EmptyState
            title="Todavía no tenés compras"
            description="Cuando compres entradas, vas a poder consultarlas desde esta sección."
            action={<Button variant="outline">Explorar cartelera</Button>}
          />
        </ShowcaseSection>

        <ShowcaseSection title="Loading">
          <Card className="flex flex-wrap items-center gap-8">
            <Loading text="Cargando funciones…" />
            <Loading />
          </Card>
        </ShowcaseSection>
      </div>
    </main>
  )
}

export default ComponentShowcase
