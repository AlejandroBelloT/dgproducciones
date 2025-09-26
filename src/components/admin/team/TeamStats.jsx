import { Card, CardContent } from '@/components/ui/Card'

const DEPARTMENT_CONFIG = {
    total: {
        label: 'Total Equipo',
        color: 'text-gray-800',
        icon: '👥'
    },
    produccion: {
        label: 'Producción',
        color: 'text-teal-600',
        icon: '🎭'
    },
    comercial: {
        label: 'Comercial',
        color: 'text-amber-600',
        icon: '💼'
    },
    administracion: {
        label: 'Administración',
        color: 'text-purple-600',
        icon: '📊'
    },
    creativo: {
        label: 'Creativo',
        color: 'text-pink-600',
        icon: '🎨'
    }
}

export default function TeamStats({ stats, className = '' }) {
    const displayStats = [
        { key: 'total', value: stats.total },
        { key: 'produccion', value: stats.produccion },
        { key: 'comercial', value: stats.comercial },
        { key: 'administracion', value: stats.administracion }
    ]

    return (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
            {displayStats.map(({ key, value }) => {
                const config = DEPARTMENT_CONFIG[key]

                return (
                    <Card key={key} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <span className="text-2xl mr-2">{config.icon}</span>
                                <div className={`text-2xl font-bold ${config.color}`}>
                                    {value}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                {config.label}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}