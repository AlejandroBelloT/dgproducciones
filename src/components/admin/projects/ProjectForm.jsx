import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ImageUploadPreview } from '../AdminComponents'
import Button from '@/components/ui/Button'

const CATEGORIES = [
    { value: 'eventos', label: '🎭 Eventos BTL' },
    { value: 'stands', label: '🏢 Stands' },
    { value: 'activaciones', label: '📱 Activaciones' },
    { value: 'material', label: '📄 Material Publicitario' }
]

export default function ProjectForm({
    showForm,
    onClose,
    formData,
    setFormData,
    onSubmit,
    editingProject,
    submitting
}) {
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await onSubmit(formData)
        } catch (error) {
            alert(error.message || 'Error al guardar el proyecto')
        }
    }

    if (!showForm) return null

    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">
                    {editingProject ? '✏️ Editar Proyecto' : '➕ Nuevo Proyecto'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Título y Categoría */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título del Proyecto *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base disabled:bg-gray-50"
                                placeholder="Ej: Lanzamiento Producto XYZ"
                                disabled={submitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base disabled:bg-gray-50"
                                disabled={submitting}
                            >
                                {CATEGORIES.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción (Opcional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base resize-none disabled:bg-gray-50"
                            placeholder="Describe brevemente el proyecto, objetivos y resultados..."
                            disabled={submitting}
                        />
                    </div>

                    {/* Subida de Imágenes */}
                    <div>
                        <ImageUploadPreview
                            onImagesChange={(images) => setFormData({ ...formData, images })}
                            maxImages={30}
                            disabled={submitting}
                        />
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full sm:w-auto"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {editingProject ? 'Actualizando...' : 'Publicando...'}
                                </span>
                            ) : (
                                editingProject ? 'Actualizar Proyecto' : 'Publicar Proyecto'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto"
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}