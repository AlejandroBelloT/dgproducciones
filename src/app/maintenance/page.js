import MaintenancePage from '@/components/maintenance/MaintenancePage'

export const metadata = {
    title: 'Sitio en Mantenimiento - DG Producciones',
    description: 'DG Producciones está realizando mejoras en el sitio. Estaremos de vuelta muy pronto con una mejor experiencia.',
    robots: 'noindex, nofollow', // No indexar la página de mantenimiento
}

export default function Maintenance() {
    return <MaintenancePage />
}