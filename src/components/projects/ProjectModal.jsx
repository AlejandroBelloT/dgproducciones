import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import ImageThumbnails from './ImageThumbnails';
import Image from 'next/image';

export default function ProjectModal({ project, isOpen, onClose, initialImageIndex = 0 }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Determinar imágenes disponibles
    const allImages = project?.allImages || (project?.images ? [project.images] : []);
    const totalImages = allImages.length;

    // Actualizar índice cuando cambie el proyecto o initialImageIndex
    useEffect(() => {
        setCurrentImageIndex(Math.max(0, Math.min(initialImageIndex, totalImages - 1)));
        setIsImageLoaded(false);
    }, [project, initialImageIndex, totalImages]);

    // Navegación con teclado
    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (currentImageIndex > 0) {
                    setCurrentImageIndex(prev => prev - 1);
                    setIsImageLoaded(false);
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (currentImageIndex < totalImages - 1) {
                    setCurrentImageIndex(prev => prev + 1);
                    setIsImageLoaded(false);
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [isOpen, currentImageIndex, totalImages, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    // Funciones de navegación
    const goToPrevious = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
            setIsImageLoaded(false);
        }
    };

    const goToNext = () => {
        if (currentImageIndex < totalImages - 1) {
            setCurrentImageIndex(prev => prev + 1);
            setIsImageLoaded(false);
        }
    };

    const goToImage = (index) => {
        if (index >= 0 && index < totalImages) {
            setCurrentImageIndex(index);
            setIsImageLoaded(false);
        }
    };

    // Early return si no hay proyecto
    if (!project || !isOpen || totalImages === 0) return null;

    const currentImage = allImages[currentImageIndex];
    const canGoPrevious = currentImageIndex > 0;
    const canGoNext = currentImageIndex < totalImages - 1;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="fullscreen"
            className="bg-black/95 backdrop-blur-sm"
        >
            <div className="relative w-full h-screen flex flex-col">
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 flex justify-between items-center flex-shrink-0">
                    <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold">{project.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-teal-100 mt-1">

                            {totalImages > 1 && (
                                <span className={`px-2 py-1 rounded flex items-center gap-1 ${totalImages > 15
                                    ? 'bg-cyan-600/70'
                                    : 'bg-teal-700/50'
                                    }`}>
                                    📷 Imagen {currentImageIndex + 1} de {totalImages}
                                    {totalImages > 20 && <span>🔥</span>}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-red-500/80 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors text-4xl font-bold ml-4 flex-shrink-0 cursor-pointer"
                        title="Cerrar modal (ESC)"
                    >
                        ×
                    </button>
                </div>

                {/* Área principal de la imagen */}
                <div className="flex-1 relative bg-black/50 flex items-center justify-center p-4 min-h-0">
                    {/* Loading spinner */}
                    {!isImageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
                        </div>
                    )}

                    {/* Imagen principal */}
                    <img
                        src={currentImage}
                        alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
                        className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={(e) => {
                            setIsImageLoaded(true);
                            e.target.src = '/images/imagesDePrueba/1.png';
                        }}
                    />

                    {/* Controles de navegación */}
                    {totalImages > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                disabled={!canGoPrevious}
                                className={`absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 flex items-center justify-center hover:bg-white disabled:opacity-30 ${canGoPrevious ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                                    }`}
                                aria-label="Imagen anterior"
                            >
                                <Image
                                    src="/iconos/flecha.png"
                                    alt="Anterior"
                                    width={56}
                                    height={56}
                                    className="rotate-180"
                                />
                            </button>
                            <button
                                onClick={goToNext}
                                disabled={!canGoNext}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm text-white transition-all duration-300 flex items-center justify-center hover:bg-white disabled:opacity-30 ${canGoNext ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
                                    }`}
                                aria-label="Imagen siguiente"
                            >
                                <Image
                                    src="/iconos/flecha.png"
                                    alt="Siguiente"
                                    width={56}
                                    height={56}
                                />
                            </button>
                        </>
                    )}
                </div>

                {/* Panel de información inferior */}
                <div className="bg-black backdrop-blur flex-shrink-0 max-h-64 overflow-y-auto">
                    <div className="p-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Descripción */}
                                <div className="lg:col-span-2">

                                    <p className="text-gray-100 leading-relaxed mb-4">
                                        {project.description || 'Actividad en la que DG Producciones participó como colaborador, aportando nuestra experiencia en producción y logística de eventos BTL.'}
                                    </p>

                                </div>

                                {/* Panel de contacto */}

                            </div>


                        </div>
                    </div>
                </div>


            </div>
        </Modal>
    );
}