function SectionLayout({ section, children }) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="border-b border-border px-6 py-4">
        <p className="mx-auto max-w-6xl text-sm font-medium text-text-secondary">
          Cine · {section}
        </p>
      </header>
      {children}
    </div>
  )
}

export default SectionLayout
