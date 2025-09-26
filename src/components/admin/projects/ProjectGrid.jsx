import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function ProjectGrid({ projects, loading, onEdit, onDelete }) {
    if (loading) {
        return (
            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">
                        📂 Proyectos Publicados
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                                <div className="h-40 sm:h-48 bg-gray-200"></div>
                                <div className="p-3 sm:p-4">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                    <div className="flex justify-between">
                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        <div className="h-3 bg-gray-200 rounded w-8"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">
                    📂 Proyectos Publicados ({projects.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-full text-center py-8 sm:py-12">
                            <div className="text-4xl sm:text-6xl mb-4 opacity-50">📁</div>
                            <p className="text-gray-500 text-sm sm:text-base">
                                No hay proyectos publicados
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-2">
                                Crea tu primer proyecto usando el botón "Nuevo Proyecto"
                            </p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={() => onEdit(project)}
                                onDelete={() => onDelete(project.id)}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function ProjectCard({ project, onEdit, onDelete }) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 bg-white">
            {/* Imagen Principal */}
            {project.mainImage && (
                <div className="relative">
                    <img
                        src={project.mainImage}
                        alt={project.title}
                        className="w-full h-40 sm:h-48 object-cover"
                    />
                    {/* Overlay para categoría */}
                    <div className="absolute top-2 left-2">
                        <span className="text-xs px-2 py-1 bg-black bg-opacity-70 text-white rounded capitalize backdrop-blur-sm">
                            {project.category}
                        </span>
                    </div>
                </div>
            )}

            {/* Contenido de la Tarjeta */}
            <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        {/* Badge de categoría si no hay imagen */}
                        {!project.mainImage && (
                            <span className="inline-block text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded capitalize mb-2">
                                {project.category}
                            </span>
                        )}

                        {/* Título */}
                        <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">
                            {project.title}
                        </h3>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                        <button
                            onClick={onEdit}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                            title="Editar proyecto"
                        >
                            <span className="text-sm">✏️</span>
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Eliminar proyecto"
                        >
                            <span className="text-sm">🗑️</span>
                        </button>
                    </div>
                </div>

                {/* Descripción */}
                {project.description && (
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>
                )}

                {/* Metadatos */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                    <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>
                            {new Date(project.createdAt).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    {project.images && (
                        <div className="flex items-center gap-1">
                            <span>📸</span>
                            <span>{Array.isArray(project.images) ? project.images.length : 1}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}