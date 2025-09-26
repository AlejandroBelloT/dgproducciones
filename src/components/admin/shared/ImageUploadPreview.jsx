'use client'

import { useState, useCallback, useEffect } from 'react'

export default function ImageUploadPreview({
    onImagesChange,
    maxImages = 30,
    disabled = false,
    accept = "image/*",
    initialImages = []
}) {
    const [images, setImages] = useState([])
    const [previews, setPreviews] = useState([])
    const [dragOver, setDragOver] = useState(false)

    // Limpiar URLs de objeto al desmontar
    useEffect(() => {
        return () => {
            previews.forEach(preview => {
                if (preview.preview && preview.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview.preview)
                }
            })
        }
    }, [])

    // Manejar imágenes iniciales
    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            const initialPreviews = initialImages.map((image, index) => ({
                file: null,
                preview: typeof image === 'string' ? image : URL.createObjectURL(image),
                id: `initial_${index}`,
                isInitial: true
            }))
            setPreviews(initialPreviews)
            setImages(typeof initialImages[0] === 'string' ? [] : initialImages)
        }
    }, [initialImages])

    const processFiles = useCallback((files) => {
        const fileArray = Array.from(files)

        if (images.length + fileArray.length > maxImages) {
            alert(`Máximo ${maxImages} imágenes permitidas`)
            return
        }

        // Validar tipos de archivo
        const validFiles = fileArray.filter(file => {
            if (accept === "image/*") {
                return file.type.startsWith('image/')
            }
            return accept.split(',').some(type => file.type.includes(type.trim()))
        })

        if (validFiles.length !== fileArray.length) {
            alert('Algunos archivos no son válidos y fueron omitidos')
        }

        // Crear previews
        const newPreviews = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Date.now() + Math.random(),
            isInitial: false
        }))

        const updatedImages = [...images, ...validFiles]
        const updatedPreviews = [...previews, ...newPreviews]

        setImages(updatedImages)
        setPreviews(updatedPreviews)

        if (onImagesChange) {
            onImagesChange(updatedImages)
        }
    }, [images, previews, maxImages, accept, onImagesChange])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files)
            // Limpiar input para permitir seleccionar el mismo archivo
            e.target.value = ''
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        if (!disabled) {
            setDragOver(true)
        }
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDragOver(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)

        if (!disabled && e.dataTransfer.files) {
            processFiles(e.dataTransfer.files)
        }
    }

    const removeImage = (index) => {
        if (disabled) return

        const previewToRemove = previews[index]
        const updatedPreviews = previews.filter((_, i) => i !== index)

        let updatedImages = images
        if (!previewToRemove.isInitial) {
            updatedImages = images.filter((_, i) => {
                // Encontrar el índice real en el array de images
                const realIndex = previews.slice(0, index + 1).filter(p => !p.isInitial).length - 1
                return i !== realIndex
            })
        }

        // Limpiar URL del preview si no es inicial
        if (previewToRemove.preview && previewToRemove.preview.startsWith('blob:')) {
            URL.revokeObjectURL(previewToRemove.preview)
        }

        setImages(updatedImages)
        setPreviews(updatedPreviews)

        if (onImagesChange) {
            onImagesChange(updatedImages)
        }
    }

    const moveImage = (fromIndex, toIndex) => {
        if (disabled) return

        const updatedPreviews = [...previews]
        const [moved] = updatedPreviews.splice(fromIndex, 1)
        updatedPreviews.splice(toIndex, 0, moved)

        setPreviews(updatedPreviews)

        // Reordenar también el array de imágenes si es necesario
        if (!moved.isInitial) {
            // Lógica de reordenamiento para imágenes reales
            // Aquí podrías implementar reordenamiento si lo necesitas
        }
    }

    const canUpload = !disabled && previews.length < maxImages

    return (
        <div className="space-y-4">
            {/* Input de subida */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subir Imágenes ({previews.length}/{maxImages})
                    {previews.length > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                            * La primera imagen será la principal
                        </span>
                    )}
                </label>

                <div
                    className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${dragOver
                            ? 'border-teal-500 bg-teal-50'
                            : canUpload
                                ? 'border-gray-300 hover:border-gray-400'
                                : 'border-gray-200 bg-gray-50'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={!canUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />

                    <div className="text-center">
                        <div className="text-2xl mb-2">📸</div>
                        <p className="text-sm text-gray-600">
                            {canUpload
                                ? 'Arrastra imágenes aquí o haz click para seleccionar'
                                : disabled
                                    ? 'Subida de imágenes deshabilitada'
                                    : 'Límite de imágenes alcanzado'
                            }
                        </p>
                        {canUpload && (
                            <p className="text-xs text-gray-500 mt-1">
                                Formatos soportados: JPG, PNG, GIF, WEBP
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview de imágenes */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {previews.map((preview, index) => (
                        <div key={preview.id} className="relative group">
                            <div className="aspect-square relative">
                                <img
                                    src={preview.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border shadow-sm"
                                />

                                {/* Botón de eliminar */}
                                {!disabled && (
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Eliminar imagen"
                                    >
                                        ✕
                                    </button>
                                )}

                                {/* Badge de imagen principal */}
                                {index === 0 && (
                                    <div className="absolute bottom-1 left-1 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                                        Principal
                                    </div>
                                )}

                                {/* Badge de imagen inicial */}
                                {preview.isInitial && (
                                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                        Existente
                                    </div>
                                )}
                            </div>

                            {/* Número de orden */}
                            <div className="text-center text-xs text-gray-500 mt-1">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Información adicional */}
            {previews.length === 0 && !disabled && (
                <div className="text-center py-4">
                    <div className="text-4xl mb-2 opacity-50">🖼️</div>
                    <p className="text-gray-500 text-sm">
                        No hay imágenes seleccionadas
                    </p>
                </div>
            )}
        </div>
    )
}