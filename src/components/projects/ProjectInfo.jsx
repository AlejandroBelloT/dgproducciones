import Button from '@/components/ui/Button';

const getCategoryDescription = (category) => {
    const descriptions = {
        'eventos': 'Producción y logística de eventos BTL',
        'stands': 'Diseño y montaje de stands comerciales',
        'activaciones': 'Activaciones de marca y experiencias',
        'material': 'Producción de material publicitario'
    };
    return descriptions[category] || 'Servicios especializados';
};

export default function ProjectInfo({ project, currentImageIndex }) {
    const { title, category, createdAt, description, allImages } = project;

    return (
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg overflow-hidden">
            {/* Header con título y categoría */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-title text-2xl font-bold text-white mb-1">{title}</h3>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium capitalize">
                                📂 {category}
                            </span>
                            {createdAt && (
                                <span className="text-white/90 text-sm">
                                    📅 {new Date(createdAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            )}
                        </div>
                    </div>
                    <Button size="sm" className="bg-white text-teal-600 hover:bg-gray-100">
                        💬 Contactar
                    </Button>
                </div>
            </div>

            {/* Contenido detallado */}
            <div className="p-6 space-y-6">
                {/* Descripción principal */}
                {description && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            📝 Descripción de la Actividad
                        </h4>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {description}
                        </p>
                    </div>
                )}

                {/* Información de la galería */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Estadísticas de la galería */}
                    <div className="bg-teal-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-teal-800 mb-3 flex items-center">
                            📸 Detalles de la Galería
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total de imágenes:</span>
                                <span className="font-semibold text-teal-700">
                                    {allImages ? allImages.length : 1}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Imagen actual:</span>
                                <span className="font-semibold text-teal-700">
                                    {currentImageIndex + 1}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tipo de actividad:</span>
                                <span className="font-semibold text-teal-700 capitalize">
                                    {category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-amber-800 mb-3 flex items-center">
                            ⭐ Participación DG Producciones
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                                <span className="text-amber-600 mt-1">🤝</span>
                                <div>
                                    <span className="font-medium text-amber-700">Rol:</span>
                                    <p className="text-gray-600">Colaboradores en la ejecución</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-600 mt-1">🎯</span>
                                <div>
                                    <span className="font-medium text-amber-700">Especialidad:</span>
                                    <p className="text-gray-600">
                                        {getCategoryDescription(category)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-600 mt-1">📊</span>
                                <div>
                                    <span className="font-medium text-amber-700">Experiencia:</span>
                                    <p className="text-gray-600">Más de 500 actividades similares</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navegación y acciones */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {allImages && allImages.length > 1 && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>📷</span>
                                    <span>Navega con las flechas o haz clic en las miniaturas</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
                                🔗 Compartir
                            </button>
                            <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors text-sm font-medium">
                                💬 Consultar Proyecto Similar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Call to action informativo */}
                <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🚀</span>
                        <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-1">¿Te gusta lo que ves?</h5>
                            <p className="text-gray-600 text-sm mb-3">
                                Hemos participado en cientos de actividades como esta. Podemos ayudarte a crear
                                una experiencia similar para tu marca o evento.
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-xs">
                                    📞 Llamar Ahora
                                </Button>
                                <Button size="sm" className="text-xs">
                                    📧 Enviar Mensaje
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}