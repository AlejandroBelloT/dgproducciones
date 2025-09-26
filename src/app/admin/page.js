'use client';
import MaintenancePage from '@/components/maintenance/MaintenancePage'

// ========================================
// CONFIGURACIÓN DE MANTENIMIENTO
// ========================================
// Cambiar MAINTENANCE_MODE a false para activar el admin
const MAINTENANCE_MODE = true

export default function AdminDashboard() {
    // Si está en modo mantenimiento, mostrar página de mantenimiento
    if (MAINTENANCE_MODE) {
        return <MaintenancePage />
    }

    // Dashboard normal (cuando MAINTENANCE_MODE = false)
    // TODO: Descomentar cuando se reactive el sitio
    /*
    const { stats, loading, error, refetchStats } = useAdminStats();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // ... resto del código del dashboard
    */

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p>Admin en mantenimiento - Cambia MAINTENANCE_MODE a false en admin/page.js</p>
        </div>
    )
}
