import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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

export async function POST(req) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Token requerido' },
                { status: 400 }
            );
        }

        const payload = decodeToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: 'Token inválido o expirado' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            valid: true,
            user: {
                id: payload.id,
                email: payload.email,
                name: payload.name,
                role: payload.role
            }
        });

    } catch (error) {
        console.error('Error verificando token:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}