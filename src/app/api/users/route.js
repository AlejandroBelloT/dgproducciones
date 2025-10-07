import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import crypto from 'crypto';

export const dynamic = 'force-static';

// Función para hashear contraseñas
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export async function GET(req) {
    try {
        const query = `
            SELECT id, name, email, role, created_at AS createdAt, updated_at AS updatedAt, last_login AS lastLogin
            FROM users
            ORDER BY created_at DESC
        `;

        const rows = await executeQuery(query);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name, email, role = 'editor', password } = await req.json();

        // Validaciones
        if (!name?.trim()) {
            return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
        }

        if (!email?.trim()) {
            return NextResponse.json({ error: 'El email es requerido' }, { status: 400 });
        }

        if (!password?.trim()) {
            return NextResponse.json({ error: 'La contraseña es requerida' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'El email no tiene un formato válido' }, { status: 400 });
        }

        // Validar rol
        const validRoles = ['admin', 'editor', 'viewer'];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
        }

        // Verificar si el email ya existe
        const existingUserQuery = 'SELECT id FROM users WHERE email = ?';
        const existingUsers = await executeQuery(existingUserQuery, [email.toLowerCase()]);

        if (existingUsers.length > 0) {
            return NextResponse.json({ error: 'Ya existe un usuario con este email' }, { status: 409 });
        }

        // Hashear contraseña
        const passwordHash = hashPassword(password);

        // Insertar nuevo usuario
        const insertQuery = `
            INSERT INTO users (name, email, role, password_hash, created_at, updated_at)
            VALUES (?, ?, ?, ?, NOW(), NOW())
        `;

        const insertResult = await executeQuery(insertQuery, [
            name.trim(),
            email.toLowerCase().trim(),
            role,
            passwordHash
        ]);

        // Obtener el usuario creado (sin password_hash)
        const newUserQuery = `
            SELECT id, name, email, role, created_at AS createdAt, updated_at AS updatedAt
            FROM users WHERE id = ?
        `;
        const newUsers = await executeQuery(newUserQuery, [insertResult.insertId]);
        const newUser = newUsers[0];

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({
            error: 'Error interno al crear usuario',
            details: error.message
        }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        const { name, email, role, password } = await req.json();

        // Verificar que el usuario existe
        const existingUserQuery = `
            SELECT id, email FROM users WHERE id = ?
        `;
        const existingUsers = await executeQuery(existingUserQuery, [id]);
        const existingUser = existingUsers[0];

        if (!existingUser) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Validaciones
        if (!name?.trim()) {
            return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
        }

        if (!email?.trim()) {
            return NextResponse.json({ error: 'El email es requerido' }, { status: 400 });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'El email no tiene un formato válido' }, { status: 400 });
        }

        // Validar rol
        const validRoles = ['admin', 'editor', 'viewer'];
        if (role && !validRoles.includes(role)) {
            return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
        }

        // Verificar si el nuevo email ya existe (en otro usuario)
        if (email.toLowerCase() !== existingUser.email.toLowerCase()) {
            const emailCheckQuery = 'SELECT id FROM users WHERE email = ? AND id != ?';
            const emailExists = await executeQuery(emailCheckQuery, [email.toLowerCase(), id]);

            if (emailExists.length > 0) {
                return NextResponse.json({ error: 'Ya existe otro usuario con este email' }, { status: 409 });
            }
        }

        // Preparar query de actualización
        let updateQuery = `
            UPDATE users 
            SET name = ?, email = ?, role = ?, updated_at = NOW()
        `;
        let updateParams = [name.trim(), email.toLowerCase().trim(), role || 'editor'];

        // Si se proporciona nueva contraseña, incluirla
        if (password && password.trim()) {
            if (password.length < 6) {
                return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
            }

            const passwordHash = hashPassword(password);
            updateQuery += ', password_hash = ?';
            updateParams.push(passwordHash);
        }

        updateQuery += ' WHERE id = ?';
        updateParams.push(id);

        const updateResult = await executeQuery(updateQuery, updateParams);

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ error: 'No se pudo actualizar el usuario' }, { status: 500 });
        }

        // Obtener el usuario actualizado
        const updatedUserQuery = `
            SELECT id, name, email, role, created_at AS createdAt, updated_at AS updatedAt
            FROM users WHERE id = ?
        `;
        const updatedUsers = await executeQuery(updatedUserQuery, [id]);
        const updatedUser = updatedUsers[0];

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({
            error: 'Error interno al actualizar usuario',
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        // Verificar que el usuario existe
        const existingUserQuery = `
            SELECT id, name, email, role FROM users WHERE id = ?
        `;
        const existingUsers = await executeQuery(existingUserQuery, [id]);
        const existingUser = existingUsers[0];

        if (!existingUser) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Verificar que no sea el último admin
        if (existingUser.role === 'admin') {
            const adminCount = await executeQuery(`
                SELECT COUNT(*) as count FROM users WHERE role = 'admin'
            `);

            if (adminCount[0].count <= 1) {
                return NextResponse.json({
                    error: 'No se puede eliminar el último administrador del sistema'
                }, { status: 400 });
            }
        }

        // Eliminar usuario
        const deleteResult = await executeQuery(`
            DELETE FROM users WHERE id = ?
        `, [id]);

        if (deleteResult.affectedRows === 0) {
            return NextResponse.json({ error: 'No se pudo eliminar el usuario' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Usuario eliminado exitosamente',
            id: existingUser.id,
            name: existingUser.name
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({
            error: 'Error interno al eliminar usuario',
            details: error.message
        }, { status: 500 });
    }
}