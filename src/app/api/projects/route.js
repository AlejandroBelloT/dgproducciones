import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        let query = `
            SELECT id, title, description, category, main_image AS mainImage, images, created_at AS createdAt
            FROM projects
            WHERE 1=1
        `;
        const params = [];

        if (category && category !== 'todos') {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY created_at DESC';
        const rows = await executeQuery(query, params);

        const data = rows.map(r => {
            let parsedImages = [];
            if (r.images) {
                try {
                    // Si es un string que parece JSON, intentar parsearlo
                    if (typeof r.images === 'string' && r.images.startsWith('[')) {
                        parsedImages = JSON.parse(r.images);
                    } else if (typeof r.images === 'string') {
                        // Si es solo un string, convertirlo a array
                        parsedImages = [r.images];
                    } else if (Array.isArray(r.images)) {
                        parsedImages = r.images;
                    }
                } catch (parseError) {
                    console.error('⚠️ Error parseando imágenes en GET, usando array vacío:', parseError.message);
                    parsedImages = [];
                }
            }

            return {
                ...r,
                images: parsedImages
            };
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json([]); // fallback silencioso
    }
}

export async function POST(req) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let title, description, category, mainImageIndex = 0;
        let imagesPaths = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            title = formData.get('title')?.toString().trim();
            description = formData.get('description')?.toString().trim() || null;
            category = formData.get('category') || 'eventos';
            mainImageIndex = parseInt(formData.get('mainImageIndex') || '0');
            const files = formData.getAll('images');

            // Guardar imágenes en /public/uploads
            if (files.length) {
                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                try { await fs.mkdir(uploadDir, { recursive: true }); } catch { }
                for (const file of files) {
                    if (typeof file === 'string') continue;
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const ext = (file.name?.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '');
                    const filename = `${crypto.randomUUID()}.${ext}`;
                    const filePath = path.join(uploadDir, filename);
                    await fs.writeFile(filePath, buffer);
                    imagesPaths.push(`/uploads/${filename}`);
                }
            }
        } else {
            const body = await req.json();
            title = body.title?.trim();
            description = body.description || null;
            category = body.category || 'eventos';
            mainImageIndex = parseInt(body.mainImageIndex || '0');
            imagesPaths = Array.isArray(body.images) ? body.images : [];
        }

        if (!title) {
            return NextResponse.json({ error: 'Título es requerido' }, { status: 400 });
        }

        if (!imagesPaths.length) {
            return NextResponse.json({ error: 'Al menos una imagen es requerida' }, { status: 400 });
        }

        // Asegurar que mainImageIndex es válido
        if (mainImageIndex < 0 || mainImageIndex >= imagesPaths.length) {
            mainImageIndex = 0;
        }

        const mainImage = imagesPaths[mainImageIndex];
        const imagesJSON = JSON.stringify(imagesPaths);

        const insertQuery = `
            INSERT INTO projects (title, description, category, main_image, images, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const insertResult = await executeQuery(insertQuery, [
            title, description, category, mainImage, imagesJSON
        ]);

        const [row] = await executeQuery(`
            SELECT id, title, description, category, main_image AS mainImage, images, created_at AS createdAt
            FROM projects WHERE id = ?
        `, [insertResult.insertId]);

        let parsedImages = imagesPaths;
        if (row?.images) {
            try {
                if (typeof row.images === 'string' && row.images.startsWith('[')) {
                    parsedImages = JSON.parse(row.images);
                }
            } catch (parseError) {
                parsedImages = imagesPaths;
            }
        }

        return NextResponse.json({
            ...row,
            images: parsedImages
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({
            error: 'Error interno al crear proyecto',
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

        console.log('🔧 Intentando eliminar proyecto con ID:', id);

        // Primero obtener la información del proyecto para limpiar archivos
        const [existingProject] = await executeQuery(`
            SELECT id, title, main_image, images 
            FROM projects WHERE id = ?
        `, [id]);

        if (!existingProject) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        console.log('📋 Proyecto encontrado:', existingProject.title);

        // Eliminar archivos de imágenes del servidor
        try {
            const imagesToDelete = [];

            // Agregar imagen principal si existe
            if (existingProject.main_image && existingProject.main_image.startsWith('/uploads/')) {
                imagesToDelete.push(path.join(process.cwd(), 'public', existingProject.main_image));
            }

            // Agregar imágenes adicionales si existen
            if (existingProject.images) {
                const images = typeof existingProject.images === 'string'
                    ? JSON.parse(existingProject.images)
                    : existingProject.images;

                if (Array.isArray(images)) {
                    images.forEach(img => {
                        if (img && img.startsWith('/uploads/')) {
                            imagesToDelete.push(path.join(process.cwd(), 'public', img));
                        }
                    });
                }
            }

            // Eliminar archivos físicos
            console.log('🗑️ Eliminando archivos:', imagesToDelete.length);
            for (const filePath of imagesToDelete) {
                try {
                    await fs.unlink(filePath);
                    console.log('✅ Archivo eliminado:', filePath);
                } catch (fileError) {
                    console.log('⚠️ No se pudo eliminar archivo (puede que no exista):', filePath);
                }
            }
        } catch (cleanupError) {
            console.error('⚠️ Error limpiando archivos:', cleanupError);
            // Continuar con la eliminación de la BD aunque falle la limpieza de archivos
        }

        // Eliminar registro de la base de datos
        const deleteResult = await executeQuery(`
            DELETE FROM projects WHERE id = ?
        `, [id]);

        if (deleteResult.affectedRows === 0) {
            return NextResponse.json({ error: 'No se pudo eliminar el proyecto' }, { status: 500 });
        }

        console.log('✅ Proyecto eliminado exitosamente, ID:', id);

        return NextResponse.json({
            message: 'Proyecto eliminado exitosamente',
            id: parseInt(id),
            title: existingProject.title
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Error eliminando proyecto:', error);
        console.error('❌ Stack trace:', error.stack);
        return NextResponse.json({
            error: 'Error interno al eliminar proyecto',
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

        console.log('🔧 Actualizando proyecto con ID:', id);

        // Verificar que el proyecto existe
        const [existingProject] = await executeQuery(`
            SELECT id, title, main_image, images 
            FROM projects WHERE id = ?
        `, [id]);

        if (!existingProject) {
            return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
        }

        const contentType = req.headers.get('content-type') || '';
        let title, description, category, mainImageIndex = 0;
        let imagesPaths = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            title = formData.get('title')?.toString().trim();
            description = formData.get('description')?.toString().trim() || null;
            category = formData.get('category') || 'eventos';
            mainImageIndex = parseInt(formData.get('mainImageIndex') || '0');
            const files = formData.getAll('images');

            // Procesar nuevas imágenes
            if (files.length > 0) {
                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                try { await fs.mkdir(uploadDir, { recursive: true }); } catch { }

                for (const file of files) {
                    if (typeof file === 'string') continue;
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const ext = (file.name?.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '');
                    const filename = `${crypto.randomUUID()}.${ext}`;
                    const filePath = path.join(uploadDir, filename);
                    await fs.writeFile(filePath, buffer);
                    imagesPaths.push(`/uploads/${filename}`);
                }

                // Si hay nuevas imágenes, eliminar las antiguas
                try {
                    const oldImagesToDelete = [];

                    // Agregar imagen principal antigua
                    if (existingProject.main_image && existingProject.main_image.startsWith('/uploads/')) {
                        oldImagesToDelete.push(path.join(process.cwd(), 'public', existingProject.main_image));
                    }

                    // Agregar imágenes adicionales antiguas
                    if (existingProject.images) {
                        const oldImages = typeof existingProject.images === 'string'
                            ? JSON.parse(existingProject.images)
                            : existingProject.images;

                        if (Array.isArray(oldImages)) {
                            oldImages.forEach(img => {
                                if (img && img.startsWith('/uploads/')) {
                                    oldImagesToDelete.push(path.join(process.cwd(), 'public', img));
                                }
                            });
                        }
                    }

                    // Eliminar archivos físicos antiguos
                    for (const filePath of oldImagesToDelete) {
                        try {
                            await fs.unlink(filePath);
                            console.log('✅ Archivo antiguo eliminado:', filePath);
                        } catch (fileError) {
                            console.log('⚠️ No se pudo eliminar archivo antiguo:', filePath);
                        }
                    }
                } catch (cleanupError) {
                    console.error('⚠️ Error limpiando archivos antiguos:', cleanupError);
                }
            } else {
                // Mantener imágenes existentes si no se suben nuevas
                try {
                    const existingImages = typeof existingProject.images === 'string'
                        ? JSON.parse(existingProject.images)
                        : existingProject.images;
                    imagesPaths = Array.isArray(existingImages) ? existingImages : [];
                } catch (parseError) {
                    imagesPaths = [];
                }
            }
        } else {
            const body = await req.json();
            title = body.title?.trim();
            description = body.description || null;
            category = body.category || 'eventos';
            mainImageIndex = parseInt(body.mainImageIndex || '0');
            imagesPaths = Array.isArray(body.images) ? body.images : [];
        }

        if (!title) {
            return NextResponse.json({ error: 'Título es requerido' }, { status: 400 });
        }

        if (!imagesPaths.length) {
            return NextResponse.json({ error: 'Al menos una imagen es requerida' }, { status: 400 });
        }

        // Asegurar que mainImageIndex es válido
        if (mainImageIndex < 0 || mainImageIndex >= imagesPaths.length) {
            mainImageIndex = 0;
        }

        const mainImage = imagesPaths[mainImageIndex];
        const imagesJSON = JSON.stringify(imagesPaths);

        const updateQuery = `
            UPDATE projects 
            SET title = ?, description = ?, category = ?, main_image = ?, images = ?, updated_at = NOW()
            WHERE id = ?
        `;

        const updateResult = await executeQuery(updateQuery, [
            title, description, category, mainImage, imagesJSON, id
        ]);

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ error: 'No se pudo actualizar el proyecto' }, { status: 500 });
        }

        const [updatedProject] = await executeQuery(`
            SELECT id, title, description, category, main_image AS mainImage, images, created_at AS createdAt, updated_at AS updatedAt
            FROM projects WHERE id = ?
        `, [id]);

        let parsedImages = imagesPaths;
        if (updatedProject?.images) {
            try {
                if (typeof updatedProject.images === 'string' && updatedProject.images.startsWith('[')) {
                    parsedImages = JSON.parse(updatedProject.images);
                }
            } catch (parseError) {
                parsedImages = imagesPaths;
            }
        }

        console.log('✅ Proyecto actualizado exitosamente, ID:', id);

        return NextResponse.json({
            ...updatedProject,
            images: parsedImages
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Error actualizando proyecto:', error);
        return NextResponse.json({
            error: 'Error interno al actualizar proyecto',
            details: error.message
        }, { status: 500 });
    }
}