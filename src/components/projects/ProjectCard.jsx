export default function ProjectCard({ project, index, onImageClick }) {
    // Manejar tanto la estructura de la BD como los datos de fallback
    const allImages = project.allImages || (project.images && Array.isArray(project.images) ? project.images : []);
    const mainImage = project.main_image || project.mainImage || project.images;
    const totalImages = allImages.length;

    const handleClick = () => {
        console.log('ProjectCard clicked:', project);
        console.log('Main image:', mainImage);
        console.log('All images:', allImages);

        const projectData = {
            ...project,
            imageUrl: mainImage,
            allImages: allImages.length > 0 ? allImages : [mainImage]
        };

        console.log('Calling onImageClick with:', projectData);
        onImageClick(projectData, 0);
    };

    // Determinar el texto del indicador basado en la cantidad de imágenes
    const getImageText = () => {
        if (totalImages <= 1) return 'Ver actividad →';
        if (totalImages <= 10) return `${totalImages} imágenes • Ver galería →`;
        return `${totalImages} fotos • Galería completa →`;
    };

    return (
        <div
            className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 shadow-lg hover-lift animate-zoom-in cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={handleClick}
        >
            <img
                src={mainImage}
                alt={`${project.title} - Actividad de ${project.category} en la que participó DG Producciones`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading={index > 6 ? 'lazy' : 'eager'} // Lazy loading para tarjetas no visibles inicialmente
                onError={(e) => {
                    e.target.src = '/images/imagesDePrueba/1.png';
                }}
            />

            {/* Overlay con información */}
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-semibold text-sm mb-1 truncate">
                        {project.title}
                    </div>
                    <div className="text-teal-200 text-xs truncate">
                        {getImageText()}
                    </div>
                </div>
            </div>

            {/* Icono de ampliación */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
            </div>

            {/* Badge de categoría */}
            <div className="absolute top-4 left-4 px-2 py-1 bg-teal-600/90 text-white text-xs rounded-full font-medium capitalize opacity-0 group-hover:opacity-100 transition-all duration-300">
                {project.category}
            </div>

            {/* Indicador de galería múltiple - Mejorado para muchas imágenes */}
            {totalImages > 1 && (
                <div className={`absolute bottom-4 right-4 px-2 py-1 text-white text-xs rounded-full font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 ${totalImages > 15
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600'
                        : 'bg-black/70'
                    }`}>
                    📸 {totalImages}
                    {totalImages > 15 && <span className="ml-1">🔥</span>}
                </div>
            )}
        </div>
    );
}