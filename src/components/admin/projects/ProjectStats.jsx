import { Card, CardContent } from '@/components/ui/Card'

const STATS_CONFIG = [
    {
        key: 'total',
        label: 'Total Proyectos',
        color: 'text-gray-800',
        bgColor: 'hover:bg-gray-50'
    },
    {
        key: 'eventos',
        label: 'Eventos',
        color: 'text-teal-600',
        bgColor: 'hover:bg-teal-50'
    },
    {
        key: 'stands',
        label: 'Stands',
        color: 'text-amber-600',
        bgColor: 'hover:bg-amber-50'
    },
    {
        key: 'activaciones',
        label: 'Activaciones',
        color: 'text-purple-600',
        bgColor: 'hover:bg-purple-50'
    }
]

export default function ProjectStats({ stats, loading, onCategoryClick }) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {STATS_CONFIG.map((_, index) => (
                    <Card key={index} className="animate-pulse">
                        <CardContent className="p-3 sm:p-4 text-center">
                            <div className="h-6 sm:h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STATS_CONFIG.map((config) => (
                <Card
                    key={config.key}
                    className={`hover:shadow-md transition-all duration-200 cursor-pointer ${config.bgColor}`}
                    onClick={() => onCategoryClick && onCategoryClick(config.key)}
                >
                    <CardContent className="p-3 sm:p-4 text-center">
                        <div className={`text-lg sm:text-2xl font-bold ${config.color}`}>
                            {stats[config.key] || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                            {config.label}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}