import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const QUICK_ACCESS_CONFIG = [
    {
        id: 'contacts',
        title: '📬 Gestión de Contactos',
        description: 'Administra las solicitudes de contacto, cambia estados y contacta clientes directamente.',
        buttonText: 'Ver Solicitudes',
        showAlert: true
    },
    {
        id: 'content',
        title: '🎨 Contenido Web',
        description: 'Publica nuevos proyectos en la galería con imágenes y descripciones.',
        buttonText: 'Gestionar Contenido',
        showAlert: false
    },
    {
        id: 'team',
        title: '👥 Directorio Equipo',
        description: 'Mantén actualizada la información de contacto del equipo.',
        buttonText: 'Ver Directorio',
        showAlert: false,
        className: 'md:col-span-2 xl:col-span-1'
    }
]

export default function DashboardQuickActions({
    stats,
    onActionClick
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {QUICK_ACCESS_CONFIG.map((action) => (
                <Card
                    key={action.id}
                    className={`hover:shadow-lg transition-all duration-200 ${action.className || ''}`}
                >
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            {action.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {action.description}
                        </p>

                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                size="sm"
                                className="w-full hover:shadow-md transition-shadow"
                                onClick={() => onActionClick(action.id)}
                            >
                                {action.buttonText}
                            </Button>

                            {action.showAlert && stats.pendingContacts > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-red-700 font-medium">
                                            ⚠️ {stats.pendingContacts} solicitudes pendientes
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}