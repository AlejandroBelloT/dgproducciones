import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const query = `
            SELECT id, name, role, phone, email, department, photo, status,
                   created_at AS createdAt, updated_at AS updatedAt
            FROM team 
            WHERE status = 'activo'
            ORDER BY created_at DESC
        `;
        const team = await executeQuery(query);
        return NextResponse.json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        return NextResponse.json(
            { error: 'Error al obtener el equipo' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        const name = formData.get('name');
        const role = formData.get('role');
        const phone = formData.get('phone') || null;
        const email = formData.get('email') || null;
        const department = formData.get('department') || 'general';
        const photoFile = formData.get('photo');

        // Validar campos requeridos
        if (!name || !role) {
            return NextResponse.json(
                { error: 'Nombre y rol son requeridos' },
                { status: 400 }
            );
        }

        let photoUrl = null;

        // Procesar la foto si se proporciona
        if (photoFile && photoFile instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(photoFile.type)) {
                return NextResponse.json(
                    { error: 'Tipo de archivo no válido. Solo se permiten JPG y PNG' },
                    { status: 400 }
                );
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (photoFile.size > maxSize) {
                return NextResponse.json(
                    { error: 'El archivo es demasiado grande. Máximo 5MB' },
                    { status: 400 }
                );
            }

            // Generar nombre único para la imagen
            const extension = path.extname(photoFile.name);
            const fileName = `team-${crypto.randomUUID()}${extension}`;
            const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);

            try {
                const bytes = await photoFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                await fs.writeFile(uploadPath, buffer);
                photoUrl = `/uploads/${fileName}`;
            } catch (uploadError) {
                console.error('Error uploading photo:', uploadError);
                return NextResponse.json(
                    { error: 'Error al subir la imagen' },
                    { status: 500 }
                );
            }
        }

        // Insertar en la base de datos
        const insertQuery = `
            INSERT INTO team (name, role, phone, email, department, photo, status)
            VALUES (?, ?, ?, ?, ?, ?, 'activo')
        `;

        const result = await executeQuery(insertQuery, [
            name,
            role,
            phone,
            email,
            department,
            photoUrl
        ]);

        // Obtener el registro recién creado
        const selectQuery = `
            SELECT id, name, role, phone, email, department, photo, status,
                   created_at AS createdAt, updated_at AS updatedAt
            FROM team 
            WHERE id = ?
        `;
        const [newTeamMember] = await executeQuery(selectQuery, [result.insertId]);

        console.log('Team member created:', newTeamMember);
        return NextResponse.json(newTeamMember);

    } catch (error) {
        console.error('Error creating team member:', error);
        return NextResponse.json(
            { error: 'Error al crear el miembro del equipo' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID es requerido para actualizar' },
                { status: 400 }
            );
        }

        // Verificar que el miembro del equipo existe
        const existingQuery = 'SELECT * FROM team WHERE id = ? AND status = "activo"';
        const [existingMember] = await executeQuery(existingQuery, [id]);

        if (!existingMember) {
            return NextResponse.json(
                { error: 'Miembro del equipo no encontrado' },
                { status: 404 }
            );
        }

        const name = formData.get('name');
        const role = formData.get('role');
        const phone = formData.get('phone') || null;
        const email = formData.get('email') || null;
        const department = formData.get('department') || 'general';
        const photoFile = formData.get('photo');

        // Validar campos requeridos
        if (!name || !role) {
            return NextResponse.json(
                { error: 'Nombre y rol son requeridos' },
                { status: 400 }
            );
        }

        let photoUrl = existingMember.photo; // Mantener la foto existente por defecto

        // Procesar nueva foto si se proporciona
        if (photoFile && photoFile instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(photoFile.type)) {
                return NextResponse.json(
                    { error: 'Tipo de archivo no válido. Solo se permiten JPG y PNG' },
                    { status: 400 }
                );
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (photoFile.size > maxSize) {
                return NextResponse.json(
                    { error: 'El archivo es demasiado grande. Máximo 5MB' },
                    { status: 400 }
                );
            }

            // Eliminar la foto anterior si existe
            if (existingMember.photo) {
                const oldPhotoPath = path.join(process.cwd(), 'public', existingMember.photo);
                try {
                    await fs.unlink(oldPhotoPath);
                } catch (error) {
                    console.log('Previous photo not found or already deleted:', error.message);
                }
            }

            // Generar nombre único para la nueva imagen
            const extension = path.extname(photoFile.name);
            const fileName = `team-${crypto.randomUUID()}${extension}`;
            const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);

            try {
                const bytes = await photoFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                await fs.writeFile(uploadPath, buffer);
                photoUrl = `/uploads/${fileName}`;
            } catch (uploadError) {
                console.error('Error uploading new photo:', uploadError);
                return NextResponse.json(
                    { error: 'Error al subir la nueva imagen' },
                    { status: 500 }
                );
            }
        }

        // Actualizar en la base de datos
        const updateQuery = `
            UPDATE team 
            SET name = ?, role = ?, phone = ?, email = ?, department = ?, photo = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        await executeQuery(updateQuery, [
            name,
            role,
            phone,
            email,
            department,
            photoUrl,
            id
        ]);

        // Obtener el registro actualizado
        const selectQuery = `
            SELECT id, name, role, phone, email, department, photo, status,
                   created_at AS createdAt, updated_at AS updatedAt
            FROM team 
            WHERE id = ?
        `;
        const [updatedMember] = await executeQuery(selectQuery, [id]);

        console.log('Team member updated:', updatedMember);
        return NextResponse.json(updatedMember);

    } catch (error) {
        console.error('Error updating team member:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el miembro del equipo' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID es requerido para eliminar' },
                { status: 400 }
            );
        }

        // Verificar que el miembro del equipo existe
        const existingQuery = 'SELECT * FROM team WHERE id = ? AND status = "activo"';
        const [existingMember] = await executeQuery(existingQuery, [id]);

        if (!existingMember) {
            return NextResponse.json(
                { error: 'Miembro del equipo no encontrado' },
                { status: 404 }
            );
        }

        // Eliminación lógica: cambiar status a 'inactivo'
        const deleteQuery = 'UPDATE team SET status = "inactivo", updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await executeQuery(deleteQuery, [id]);

        // Eliminar la foto del servidor si existe
        if (existingMember.photo) {
            const photoPath = path.join(process.cwd(), 'public', existingMember.photo);
            try {
                await fs.unlink(photoPath);
                console.log('Photo deleted:', existingMember.photo);
            } catch (error) {
                console.log('Photo not found or already deleted:', error.message);
            }
        }

        console.log('Team member deleted (logical):', id);
        return NextResponse.json({
            success: true,
            message: 'Miembro del equipo eliminado correctamente'
        });

    } catch (error) {
        console.error('Error deleting team member:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el miembro del equipo' },
            { status: 500 }
        );
    }
}