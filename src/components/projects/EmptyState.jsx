import Button from '@/components/ui/Button';

export default function EmptyState({ activeCategory, onShowAll }) {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay actividades disponibles</h3>
            <p className="text-gray-500 mb-6">
                {activeCategory === 'todos'
                    ? 'Aún no hemos cargado actividades en esta sección.'
                    : `No hay actividades en la categoría "${activeCategory}".`
                }
            </p>
            {activeCategory !== 'todos' && (
                <Button
                    variant="outline"
                    onClick={onShowAll}
                >
                    Ver todas las actividades
                </Button>
            )}
        </div>
    );
}