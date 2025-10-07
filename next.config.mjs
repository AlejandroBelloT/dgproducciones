/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuración mínima para Vercel
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'dgproducciones.cl',
            },
        ],
    },
    // Asegurar que las dependencias externas funcionen
    serverExternalPackages: ['mysql2']
};

export default nextConfig;
