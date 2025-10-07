'use client'

import { useState, useCallback, useEffect } from 'react'

export default function ImageUploadPreview({
    onImagesChange,
    maxImages = 30,
    initialImages = []
}) {
    const [mainImage, setMainImage] = useState(null)
    const [mainImagePreview, setMainImagePreview] = useState(null)
    const [additionalImages, setAdditionalImages] = useState([])
    const [additionalPreviews, setAdditionalPreviews] = useState([])

    // Efecto para cargar imágenes iniciales (al editar)
    useEffect(() => {
        if (initialImages && initialImages.length > 0) {
            console.log('📸 Cargando imágenes iniciales:', initialImages)

            // La primera imagen es la principal
            const mainImageUrl = initialImages[0]
            setMainImagePreview(mainImageUrl)
            // No establecemos mainImage porque es una URL, no un File
            setMainImage(null)

            // Las demás son adicionales
            const additionalImageUrls = initialImages.slice(1)
            if (additionalImageUrls.length > 0) {
                const previews = additionalImageUrls.map((url, index) => ({
                    id: Date.now() + index,
                    file: null, // URL existente, no un File
                    url: url,
                    isExisting: true
                }))
                setAdditionalPreviews(previews)
                setAdditionalImages([]) // No tenemos Files para URLs existentes
            }
        }
    }, [initialImages])

    const handleMainImageSelect = useCallback((e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Limpiar preview anterior si existe
        if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(mainImagePreview)
        }

        setMainImage(file)
        setMainImagePreview(URL.createObjectURL(file))

        // Notificar cambios al padre - combinar nueva imagen principal con adicionales
        const allImages = [file, ...additionalImages.filter(img => img instanceof File)]
        const allUrls = additionalPreviews
            .filter(preview => preview.isExisting)
            .map(preview => preview.url)

        if (onImagesChange) onImagesChange([...allImages, ...allUrls])

        e.target.value = ''
    }, [additionalImages, additionalPreviews, mainImagePreview, onImagesChange])

    const handleAdditionalImagesSelect = useCallback((e) => {
        const files = Array.from(e.target.files || [])
        const currentTotal = (mainImage || mainImagePreview ? 1 : 0) + additionalImages.length + additionalPreviews.filter(p => p.isExisting).length
        const maxAdditional = maxImages - currentTotal

        if (files.length > maxAdditional) {
            alert(`Máximo ${maxAdditional} imágenes adicionales permitidas`)
            return
        }

        const newPreviews = files.map((file, index) => ({
            id: Date.now() + index,
            file,
            url: URL.createObjectURL(file),
            isExisting: false
        }))

        const newAdditionalImages = [...additionalImages, ...files]
        const newAdditionalPreviews = [...additionalPreviews, ...newPreviews]

        setAdditionalImages(newAdditionalImages)
        setAdditionalPreviews(newAdditionalPreviews)

        // Notificar cambios al padre - combinar Files y URLs
        const allFiles = []
        const allUrls = []

        // Imagen principal
        if (mainImage) {
            allFiles.push(mainImage)
        } else if (mainImagePreview && !mainImagePreview.startsWith('blob:')) {
            allUrls.push(mainImagePreview)
        }

        // Imágenes adicionales
        allFiles.push(...newAdditionalImages.filter(img => img instanceof File))
        allUrls.push(...newAdditionalPreviews.filter(preview => preview.isExisting).map(preview => preview.url))

        if (onImagesChange) onImagesChange([...allFiles, ...allUrls])

        e.target.value = ''
    }, [additionalImages, additionalPreviews, mainImage, mainImagePreview, maxImages, onImagesChange])

    const removeMainImage = useCallback(() => {
        if (mainImagePreview && mainImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(mainImagePreview)
        }
        setMainImage(null)
        setMainImagePreview(null)

        // Notificar cambios al padre - solo imágenes adicionales
        const allFiles = additionalImages.filter(img => img instanceof File)
        const allUrls = additionalPreviews.filter(preview => preview.isExisting).map(preview => preview.url)

        if (onImagesChange) onImagesChange([...allFiles, ...allUrls])
    }, [mainImagePreview, additionalImages, additionalPreviews, onImagesChange])

    const removeAdditionalImage = useCallback((index) => {
        const previewToRemove = additionalPreviews[index]
        if (previewToRemove?.url && previewToRemove.url.startsWith('blob:')) {
            URL.revokeObjectURL(previewToRemove.url)
        }

        const newAdditionalImages = additionalImages.filter((_, i) => i !== index)
        const newAdditionalPreviews = additionalPreviews.filter((_, i) => i !== index)

        setAdditionalImages(newAdditionalImages)
        setAdditionalPreviews(newAdditionalPreviews)

        // Notificar cambios al padre - combinar Files y URLs
        const allFiles = []
        const allUrls = []

        // Imagen principal
        if (mainImage) {
            allFiles.push(mainImage)
        } else if (mainImagePreview && !mainImagePreview.startsWith('blob:')) {
            allUrls.push(mainImagePreview)
        }

        // Imágenes adicionales restantes
        allFiles.push(...newAdditionalImages.filter(img => img instanceof File))
        allUrls.push(...newAdditionalPreviews.filter(preview => preview.isExisting).map(preview => preview.url))

        if (onImagesChange) onImagesChange([...allFiles, ...allUrls])
    }, [additionalImages, additionalPreviews, mainImage, mainImagePreview, onImagesChange])

    const totalImages = (mainImage || mainImagePreview ? 1 : 0) + additionalImages.length + additionalPreviews.filter(p => p.isExisting).length

    return (
        <div className="space-y-6">
            {/* Selección de imagen principal */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen Principal * (1 requerida)
                </label>

                {!mainImage && !mainImagePreview ? (
                    <div className="relative border-2 border-dashed border-teal-300 rounded-lg p-6 hover:border-teal-500 transition-colors bg-teal-50">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center pointer-events-none">
                            <div className="text-3xl mb-2">⭐</div>
                            <p className="text-sm text-teal-700 font-medium">
                                Selecciona la imagen principal del proyecto
                            </p>
                            <p className="text-xs text-teal-600 mt-1">
                                Esta será la imagen destacada que se mostrará primero
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="aspect-video relative rounded-lg overflow-hidden border-4 border-yellow-400 shadow-lg">
                            <img
                                src={mainImagePreview}
                                alt="Imagen principal"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded shadow">
                                ⭐ IMAGEN PRINCIPAL
                            </div>
                            <button
                                type="button"
                                onClick={removeMainImage}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="Eliminar imagen principal"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Selección de imágenes adicionales */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imágenes Adicionales ({additionalPreviews.length}/{maxImages - (mainImage || mainImagePreview ? 1 : 0)})
                </label>

                {totalImages < maxImages && (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors mb-4">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleAdditionalImagesSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center pointer-events-none">
                            <div className="text-3xl mb-2">📸</div>
                            <p className="text-sm text-gray-600">
                                Agrega más imágenes del proyecto
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                JPG, PNG, GIF, WEBP - Puedes seleccionar múltiples
                            </p>
                        </div>
                    </div>
                )}

                {/* Grid de imágenes adicionales */}
                {additionalPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {additionalPreviews.map((preview, index) => (
                            <div key={preview.id} className="relative group">
                                <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={preview.url}
                                        alt={`Imagen adicional ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAdditionalImage(index)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Eliminar imagen"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="text-center text-xs text-gray-500 mt-1">
                                    {index + 2}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Resumen */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        Total de imágenes: <strong>{totalImages}/{maxImages}</strong>
                    </span>
                    {(mainImage || mainImagePreview) && (
                        <span className="text-teal-600 font-medium">
                            ✓ Imagen principal seleccionada
                        </span>
                    )}
                </div>
                {!mainImage && !mainImagePreview && (
                    <p className="text-red-600 text-xs mt-1">
                        * Debes seleccionar una imagen principal para continuar
                    </p>
                )}
            </div>
        </div>
    )
}
