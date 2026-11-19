function PlaceholderPage({ title, description = 'Sección preparada para desarrollo.' }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-text-secondary">{description}</p>
    </section>
  )
}

export default PlaceholderPage
