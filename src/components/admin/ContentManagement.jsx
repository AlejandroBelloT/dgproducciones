'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ImageUploadPreview } from './AdminComponents'
import Button from '@/components/ui/Button'

export default function ContentManagement() {
    const [content, setContent] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'eventos',
        images: []
    })

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            // Usar la API de proyectos en lugar de contenido
            const response = await fetch('/api/projects')
            const data = await response.json()
            // Asegurar que data es siempre un array
            setContent(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching content:', error)
            setContent([]) // Fallback a array vacío
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title || formData.images.length === 0) {
            alert('El título y al menos una imagen son obligatorios')
            return
        }

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('title', formData.title)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('category', formData.category)

            formData.images.forEach((image, index) => {
                formDataToSend.append(`images`, image)
            })

            const response = await fetch('/api/projects', {
                method: editingItem ? 'PUT' : 'POST',
                body: formDataToSend
            })

            if (response.ok) {
                await fetchContent()
                resetForm()
                setShowForm(false)
            } else {
                alert('Error al guardar el contenido')
            }
        } catch (error) {
            console.error('Error saving content:', error)
            alert('Error al guardar el contenido')
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'eventos',
            images: []
        })
        setEditingItem(null)
    }

    const deleteContent = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este contenido?')) return

        try {
            const response = await fetch(`/api/projects?id=${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setContent(content.filter(item => item.id !== id))
            }
        } catch (error) {
            console.error('Error deleting content:', error)
        }
    }

    const getCategoryCount = (category) => {
        if (!Array.isArray(content)) return 0;
        return content.filter(item => item.category === category).length
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg">Cargando contenido...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-gray-800">{content.length}</div>
                        <div className="text-sm text-gray-600">Total Proyectos</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-teal-600">{getCategoryCount('eventos')}</div>
                        <div className="text-sm text-gray-600">Eventos</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-amber-600">{getCategoryCount('stands')}</div>
                        <div className="text-sm text-gray-600">Stands</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{getCategoryCount('activaciones')}</div>
                        <div className="text-sm text-gray-600">Activaciones</div>
                    </CardContent>
                </Card>
            </div>

            {/* Botón agregar */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestión de Contenido</h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        setShowForm(!showForm)
                        if (showForm) resetForm()
                    }}
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Proyecto'}
                </Button>
            </div>

            {/* Formulario */}
            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingItem ? 'Editar Proyecto' : 'Nuevo Proyecto'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título del Proyecto *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        placeholder="Ej: Lanzamiento Producto XYZ"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option value="eventos">🎭 Eventos BTL</option>
                                        <option value="stands">🏢 Stands</option>
                                        <option value="activaciones">📱 Activaciones</option>
                                        <option value="material">📄 Material Publicitario</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción (Opcional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    placeholder="Describe brevemente el proyecto, objetivos y resultados..."
                                />
                            </div>

                            <ImageUploadPreview
                                onImagesChange={(images) => setFormData({ ...formData, images })}
                                maxImages={30}
                            />

                            <div className="flex gap-3">
                                <Button type="submit" variant="primary">
                                    {editingItem ? 'Actualizar Proyecto' : 'Publicar Proyecto'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false)
                                        resetForm()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Lista de contenido */}
            <Card>
                <CardHeader>
                    <CardTitle>Proyectos Publicados ({content.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                No hay proyectos publicados
                            </div>
                        ) : (
                            content.map((item) => (
                                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    {item.mainImage && (
                                        <img
                                            src={item.mainImage}
                                            alt={item.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded">
                                                {item.category}
                                            </span>
                                            <button
                                                onClick={() => deleteContent(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Eliminar proyecto"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            📅 {new Date(item.createdAt).toLocaleDateString('es-ES')}
                                            {item.images && (
                                                <span className="ml-2">
                                                    📸 {item.images.length} imagen{item.images.length !== 1 ? 'es' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}