// Función para decodificar el token
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

// Función para obtener usuario autenticado desde headers de request
export function getUserFromRequest(req) {
    try {
        // Obtener token desde headers Authorization
        const authHeader = req.headers.get('Authorization');
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Remover "Bearer "
        }

        // Si no hay token en Authorization, intentar obtenerlo desde cookie
        if (!token) {
            const cookies = req.headers.get('cookie') || '';
            const tokenMatch = cookies.match(/adminToken=([^;]+)/);
            token = tokenMatch ? tokenMatch[1] : null;
        }

        if (!token) {
            return null;
        }

        const payload = decodeToken(token);

        if (!payload) {
            return null;
        }

        return {
            id: payload.id,
            email: payload.email,
            name: payload.name,
            role: payload.role
        };
    } catch (error) {
        console.error('Error extracting user from request:', error);
        return null;
    }
}

// Función para verificar si el usuario está autenticado
export function requireAuth(req) {
    const user = getUserFromRequest(req);

    if (!user) {
        throw new Error('Usuario no autenticado');
    }

    return user;
}

// Función para verificar si el usuario es admin
export function requireAdmin(req) {
    const user = requireAuth(req);

    if (user.role !== 'admin') {
        throw new Error('Permisos de administrador requeridos');
    }

    return user;
}