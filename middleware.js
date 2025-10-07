import { NextResponse } from 'next/server'

// ========================================
// CONFIGURACIÓN DE MANTENIMIENTO
// ========================================
// Cambiar a false para desactivar el modo mantenimiento
const MAINTENANCE_MODE = false  // DESACTIVADO - El sitio funciona normalmente

// ========================================
// FUNCIONES DE AUTENTICACIÓN
// ========================================
function decodeToken(token) {
    try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());

        // Verificar que el token no sea muy antiguo (24 horas)
        const now = Date.now();
        const tokenAge = now - payload.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas

        if (tokenAge > maxAge) {
            return null; // Token expirado
        }

        return payload;
    } catch (error) {
        return null; // Token inválido
    }
}

export function middleware(request) {
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
    // PROTECCIÓN DE RUTAS DE ADMIN
    // ========================================
    if (pathname.startsWith('/admin')) {
        // Obtener token del header Authorization o de cookies
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '') ||
            request.cookies.get('adminToken')?.value;

        if (!token) {
            // No hay token, redirigir a login
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Verificar token
        const payload = decodeToken(token);
        if (!payload) {
            // Token inválido, redirigir a login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('adminToken'); // Limpiar cookie inválida
            return response;
        }

        // Token válido, continuar con la request
        // Agregar información del usuario a los headers para uso en la aplicación
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.id.toString());
        requestHeaders.set('x-user-email', payload.email);
        requestHeaders.set('x-user-name', payload.name);
        requestHeaders.set('x-user-role', payload.role);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    // ========================================
    // VERIFICAR MODO MANTENIMIENTO
    // ========================================
    // Si el mantenimiento está desactivado, continuar normalmente
    if (!MAINTENANCE_MODE) {
        return NextResponse.next()
    }

    // ========================================
    // REDIRECCIÓN A MANTENIMIENTO
    // ========================================
    // Eliminar redirección a mantenimiento, continuar normalmente
    return NextResponse.next()
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