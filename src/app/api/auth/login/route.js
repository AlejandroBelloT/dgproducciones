import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Función para generar hash SHA256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Función para generar un token JWT simple (para desarrollo)
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        timestamp: Date.now()
    };

    // En producción, usar una librería JWT real con secret
    return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Validación básica
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        // Buscar usuario en la base de datos
        const userQuery = `
            SELECT id, name, email, password_hash, role, is_active, last_login
            FROM users 
            WHERE email = ? AND is_active = 1
        `;

        const users = await executeQuery(userQuery, [email]);
        const user = users[0];

        if (!user) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Verificar contraseña
        const hashedPassword = hashPassword(password);
        if (user.password_hash !== hashedPassword) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Actualizar último login
        const updateLoginQuery = `
            UPDATE users 
            SET last_login = NOW()
            WHERE id = ?
        `;
        await executeQuery(updateLoginQuery, [user.id]);

        // Generar token
        const token = generateToken(user);

        // Preparar datos del usuario (sin password_hash)
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            last_login: user.last_login
        };

        return NextResponse.json({
            message: 'Login exitoso',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}