/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Habilitar exportación estática
    trailingSlash: true, // Compatibilidad con hosting tradicional
    images: {
        unoptimized: true, // Necesario para exportación estática
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    // Configuración para build optimizado
    async generateBuildId() {
        return 'dgproducciones-maintenance-build'
    }
};

export default nextConfig;
