import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        // En un sistema real aquí podríamos invalidar el token en una blacklist
        // Por simplicidad, el logout se maneja en el frontend

        return NextResponse.json({
            message: 'Logout exitoso'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}