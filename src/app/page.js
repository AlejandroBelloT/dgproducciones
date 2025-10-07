import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Hero from '@/components/landing/Hero'
import Services from '@/components/landing/Services'
import Projects from '@/components/landing/Projects'
import Merchandising from '@/components/landing/Merchandising'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import Contact from '@/components/landing/Contact'
import FloatingButtons from '@/components/ui/FloatingButtons'

// ========================================
// CONFIGURACIÓN DE MANTENIMIENTO
// ========================================
// Cambiar MAINTENANCE_MODE a false para mostrar el sitio normal
const MAINTENANCE_MODE = false

export default function Home() {
  // Sitio normal
  return (
    <div className="font-sans">
      <PublicHeader />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Merchandising />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <PublicFooter />
      <FloatingButtons />
    </div>
  )
  // Eliminar llave sobrante
}
