import React from 'react';

export default function ImageThumbnails({ images, currentIndex, onImageSelect, projectTitle }) {
    if (!images || images.length <= 1) {
        return null;
    }

    // Para eventos con muchas imágenes, centrar la imagen actual en la vista
    const scrollToCurrentImage = (index) => {
        const thumbnailsContainer = document.querySelector('.thumbnails-container');
        if (thumbnailsContainer && images.length > 10) {
            const thumbnailWidth = 80; // width + margin
            const containerWidth = thumbnailsContainer.clientWidth;
            const scrollPosition = (index * thumbnailWidth) - (containerWidth / 2) + (thumbnailWidth / 2);
            thumbnailsContainer.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }
    };

    React.useEffect(() => {
        scrollToCurrentImage(currentIndex);
    }, [currentIndex]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    🖼️ Galería de Imágenes
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                        {images.length}
                    </span>
                </h5>
                {images.length > 10 && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>↔️</span>
                        <span>Desplaza para ver más</span>
                    </div>
                )}
            </div>

            <div
                className="thumbnails-container flex gap-2 overflow-x-auto pb-2 scroll-smooth"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#14B8A6 #F3F4F6'
                }}
            >
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            onImageSelect(index);
                            scrollToCurrentImage(index);
                        }}
                        className={`cursor-pointer relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${index === currentIndex
                            ? 'border-teal-500 opacity-100 ring-2 ring-teal-200 scale-105'
                            : 'border-gray-300 opacity-70 hover:opacity-90 hover:border-teal-300'
                            }`}
                        title={`${projectTitle} - Imagen ${index + 1} de ${images.length}`}
                    >
                        <img
                            src={image}
                            alt={`${projectTitle} - Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy" // Lazy loading para performance con muchas imágenes
                            onError={(e) => {
                                e.target.src = '/images/imagesDePrueba/1.png';
                            }}
                        />

                        {/* Indicador de imagen actual */}
                        {index === currentIndex && (
                            <div className="absolute inset-0 bg-teal-500/20 flex items-center justify-center">
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-teal-500 rounded-full shadow-lg"></div>
                            </div>
                        )}

                        {/* Número de imagen para orientación */}
                        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl">
                            {index + 1}
                        </div>
                    </button>
                ))}
            </div>

            {/* Indicador de posición para muchas imágenes */}
            {images.length > 10 && (
                <div className="flex justify-center mt-2">
                    <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                        Imagen {currentIndex + 1} de {images.length}
                    </div>
                </div>
            )}
        </div>
    );
}