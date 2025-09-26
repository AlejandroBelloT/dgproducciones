import MaintenancePage from '@/components/maintenance/MaintenancePage'

// ========================================
// CONFIGURACIÓN DE MANTENIMIENTO
// ========================================
// Cambiar MAINTENANCE_MODE a false para mostrar el sitio normal
const MAINTENANCE_MODE = true

export default function Home() {
  // Si está en modo mantenimiento, mostrar página de mantenimiento
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />
  }

  // Sitio normal (cuando MAINTENANCE_MODE = false)
  return (
    <div className="font-sans">
      {/* Importaciones comentadas para cuando se reactive el sitio */}
      {/* 
      <PublicHeader />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <PublicFooter />
      <FloatingButtons />
      */}
      <div className="min-h-screen flex items-center justify-center">
        <p>Sitio en construcción - Cambia MAINTENANCE_MODE a false en page.js</p>
      </div>
    </div>
  )
}
