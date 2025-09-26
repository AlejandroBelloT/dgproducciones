import { NextResponse } from 'next/server'

// ========================================
// CONFIGURACIÓN DE MANTENIMIENTO
// ========================================
// Cambiar a false para desactivar el modo mantenimiento
const MAINTENANCE_MODE = true  // ACTIVADO - Página profesional funcionando

export function middleware(request) {
    // Si el mantenimiento está desactivado, continuar normalmente
    if (!MAINTENANCE_MODE) {
        return NextResponse.next()
    }

    const { pathname } = request.nextUrl

    // ========================================
    // RUTAS EXCLUIDAS (necesarias para el funcionamiento)
    // ========================================
    const excludedPaths = [
        '/_next',           // Archivos de Next.js
        '/api',             // APIs
        '/favicon.ico',     // Favicon
        '/images',          // Imágenes
        '/iconos',          // Iconos
        '/maintenance'      // La página de mantenimiento
    ]

    // Si la ruta está excluida, permitir acceso
    for (const excludedPath of excludedPaths) {
        if (pathname.startsWith(excludedPath) || pathname === excludedPath) {
            return NextResponse.next()
        }
    }

    // ========================================
    // REDIRECCIÓN A MANTENIMIENTO
    // ========================================
    // TODAS las demás rutas (/, /admin, /cualquier-cosa) → /maintenance
    const maintenanceUrl = new URL('/maintenance', request.url)
    return NextResponse.redirect(maintenanceUrl)
}

// ========================================
// CONFIGURACIÓN DEL MATCHER
// ========================================
// Aplicar middleware a TODAS las rutas excepto archivos estáticos
export const config = {
    matcher: [
        /*
         * Coincidir con todas las rutas EXCEPTO:
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)  
         * - favicon.ico
         */
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
}