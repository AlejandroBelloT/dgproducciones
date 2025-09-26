import { Card, CardContent } from '@/components/ui/Card'

const STATS_CONFIG = [
    {
        key: 'contacts',
        label: 'Solicitudes Totales',
        icon: '📬',
        color: 'text-gray-800',
        clickable: true,
        target: 'contacts'
    },
    {
        key: 'content',
        label: 'Proyectos/Eventos',
        icon: '📸',
        color: 'text-gray-800',
        clickable: true,
        target: 'content'
    },
    {
        key: 'team',
        label: 'Colaboradores',
        icon: '👥',
        color: 'text-gray-800',
        clickable: true,
        target: 'team'
    },
    {
        key: 'completionRate',
        label: 'Gestión Completada',
        icon: '📊',
        color: 'text-teal-600',
        suffix: '%',
        clickable: false
    }
]

export default function DashboardStats({
    stats,
    onCardClick,
    loading = false
}) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="animate-pulse">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                            <div className="w-12 h-6 bg-gray-200 rounded mx-auto mb-1"></div>
                            <div className="w-20 h-4 bg-gray-200 rounded mx-auto"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STATS_CONFIG.map((config) => {
                const value = stats[config.key] || 0
                const isClickable = config.clickable && onCardClick

                return (
                    <Card
                        key={config.key}
                        className={`transition-all duration-200 ${isClickable
                                ? 'hover:shadow-lg cursor-pointer transform hover:-translate-y-1'
                                : 'hover:shadow-md'
                            }`}
                        onClick={isClickable ? () => onCardClick(config.target) : undefined}
                    >
                        <CardContent className="p-4 sm:p-6 text-center relative">
                            <div className="flex items-center justify-center mb-3">
                                <span className="text-2xl sm:text-3xl mr-2">{config.icon}</span>
                            </div>

                            <div className={`text-xl sm:text-2xl font-bold ${config.color} mb-1`}>
                                {value}{config.suffix || ''}
                            </div>

                            <div className="text-xs sm:text-sm text-gray-600">
                                {config.label}
                            </div>

                            {/* Indicador de pendientes */}
                            {config.key === 'contacts' && stats.pendingContacts > 0 && (
                                <div className="absolute top-2 right-2">
                                    <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                                        {stats.pendingContacts}
                                    </div>
                                </div>
                            )}

                            {/* Detalles adicionales */}
                            {config.key === 'contacts' && stats.pendingContacts > 0 && (
                                <div className="text-xs text-red-600 mt-1">
                                    {stats.pendingContacts} pendientes
                                </div>
                            )}

                            {/* Indicador clickeable */}
                            {isClickable && (
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}