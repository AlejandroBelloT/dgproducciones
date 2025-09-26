import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

const TIPS_CONFIG = [
    {
        category: 'Gestión de Contactos',
        icon: '📬',
        tips: [
            'Cambia el estado haciendo clic en el badge de estado',
            'Usa los botones de acción para contactar directamente',
            'El botón Email abre Outlook con datos prellenados',
            'Filtra por estado para una gestión más eficiente'
        ]
    },
    {
        category: 'Subida de Contenido',
        icon: '📸',
        tips: [
            'La primera imagen será la principal en galería',
            'Puedes subir hasta 30 imágenes por proyecto',
            'Vista previa antes de publicar',
            'Categoriza tus proyectos para mejor organización'
        ]
    },
    {
        category: 'Gestión de Equipo',
        icon: '👥',
        tips: [
            'Incluye fotos para un directorio más profesional',
            'Mantén actualizada la información de contacto',
            'Organiza por departamentos para mejor estructura',
            'Usa la búsqueda para encontrar colaboradores rápidamente'
        ]
    }
]

export default function DashboardTips() {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    💡 Tips de Uso
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {TIPS_CONFIG.map((section, index) => (
                        <div key={index} className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <span className="text-lg">{section.icon}</span>
                                <h4 className="font-medium text-gray-800 text-sm">
                                    {section.category}
                                </h4>
                            </div>
                            <ul className="space-y-2">
                                {section.tips.map((tip, tipIndex) => (
                                    <li
                                        key={tipIndex}
                                        className="text-xs sm:text-sm text-gray-600 flex items-start gap-2 leading-relaxed"
                                    >
                                        <span className="text-teal-500 font-bold mt-0.5 flex-shrink-0">•</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}