'use client';

import { useState, useCallback, useEffect } from 'react';
import ImageUploadPreview from '../shared/ImageUploadPreview';

export default function ProjectForm({ project, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: []
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                images: [] // Se iniciará vacío, las imágenes existentes se manejan en ImageUploadPreview
            });
        } else {
            // Reset form para nuevo proyecto
            setFormData({
                title: '',
                description: '',
                images: []
            });
        }
    }, [project]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleImagesChange = useCallback((images) => {
        console.log('ProjectForm - Images received:', images);
        setFormData(prev => ({
            ...prev,
            images: images
        }));
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title?.trim()) {
            newErrors.title = 'El título es requerido';
        }

        if (!formData.description?.trim()) {
            newErrors.description = 'La descripción es requerida';
        }

        if (!formData.images?.length) {
            newErrors.images = 'Debe seleccionar al menos la imagen principal';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error al guardar proyecto:', error);
            setErrors({ submit: 'Error al guardar el proyecto' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Título */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Título del Proyecto
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Ingresa el título del proyecto"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Describe el proyecto"
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>

                {/* Imagen Principal y Adicionales */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imágenes del Proyecto
                    </label>
                    <div className="text-xs sm:text-sm text-gray-600 mb-4">
                        <p>• Primero selecciona la imagen principal (⭐)</p>
                        <p>• Luego puedes agregar hasta 29 imágenes adicionales</p>
                    </div>

                    <ImageUploadPreview
                        initialImages={project?.images || []}
                        onImagesChange={handleImagesChange}
                        maxImages={30}
                    />

                    {errors.images && (
                        <p className="mt-2 text-sm text-red-600">{errors.images}</p>
                    )}
                </div>

                {/* Error de envío */}
                {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                )}

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                        {isLoading ? 'Guardando...' : (project ? 'Actualizar' : 'Crear Proyecto')}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="w-full sm:flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}