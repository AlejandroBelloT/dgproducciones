import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { currentPassword, newPassword, confirmPassword } = body;

        // Obtener usuario autenticado
        const userData = getUserFromRequest(req);

        if (!userData) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Validaciones básicas
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'La nueva contraseña y la confirmación no coinciden' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'La nueva contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        if (currentPassword === newPassword) {
            return NextResponse.json(
                { error: 'La nueva contraseña debe ser diferente a la actual' },
                { status: 400 }
            );
        }

        // Verificar contraseña actual
        const currentPasswordHash = hashPassword(currentPassword);
        const userQuery = 'SELECT id, password_hash FROM users WHERE id = ?';
        const userResult = await executeQuery(userQuery, [userData.id]);
        const user = userResult[0];

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        if (user.password_hash !== currentPasswordHash) {
            return NextResponse.json(
                { error: 'La contraseña actual es incorrecta' },
                { status: 400 }
            );
        }

        // Hashear nueva contraseña
        const newPasswordHash = hashPassword(newPassword);

        // Actualizar contraseña en la base de datos
        const updateQuery = `
            UPDATE users 
            SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;

        await executeQuery(updateQuery, [newPasswordHash, userData.id]);

        // Log de la acción (opcional - para auditoría)
        console.log(`🔐 Contraseña cambiada para usuario: ${userData.email} (ID: ${userData.id})`);

        return NextResponse.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}