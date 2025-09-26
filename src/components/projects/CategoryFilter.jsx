import Button from '@/components/ui/Button';

const CATEGORIES = [
    { key: 'todos', label: '🎪 Todas las Actividades' },
    { key: 'eventos', label: '🎭 Eventos BTL' },
    { key: 'stands', label: '🏢 Stands' },
    { key: 'activaciones', label: '📱 Activaciones' },
    { key: 'material', label: '📄 Material Publicitario' }
];

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-15">
            {CATEGORIES.map((cat) => (
                <Button
                    key={cat.key}
                    variant={activeCategory === cat.key ? "primary" : "outline"}
                    size="sm"
                    onClick={() => onCategoryChange(cat.key)}
                    className={activeCategory === cat.key ? "scale-105" : ""}
                >
                    {cat.label}
                </Button>
            ))}
        </div>
    );
}