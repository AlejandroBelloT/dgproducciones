import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';

export const dynamic = 'force-static';

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
        let title, description, category;
        let imagesPaths = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            title = formData.get('title')?.toString().trim();
            description = formData.get('description')?.toString().trim() || null;
            category = formData.get('category') || 'eventos';
            const files = formData.getAll('images');

            // Guardar imágenes en /public/uploads (creamos carpeta si no existe)
            if (files.length) {
                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                try { await fs.mkdir(uploadDir, { recursive: true }); } catch { }
                for (const file of files) {
                    if (typeof file === 'string') continue; // ignorar strings accidentales
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
            imagesPaths = Array.isArray(body.images) ? body.images : [];
        }

        if (!title) {
            return NextResponse.json({ error: 'Título es requerido' }, { status: 400 });
        }

        if (!category) {
            return NextResponse.json({ error: 'Categoría es requerida' }, { status: 400 });
        }

        if (!imagesPaths.length) {
            return NextResponse.json({ error: 'Al menos una imagen es requerida' }, { status: 400 });
        }

        const mainImage = imagesPaths[0];
        const imagesJSON = JSON.stringify(imagesPaths);

        console.log('🔧 Datos antes de INSERT:', {
            title,
            description,
            category,
            mainImage,
            imagesPaths: imagesPaths,
            imagesJSON
        });

        // INSERT solo con los campos del formulario
        const insertQuery = `
            INSERT INTO projects (title, description, category, main_image, images, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `;

        console.log('🔧 Intentando INSERT con:', { title, description, category, mainImage, imagesJSON });
        const insertResult = await executeQuery(insertQuery, [
            title, description, category, mainImage, imagesJSON
        ]);
        console.log('✅ INSERT exitoso, ID:', insertResult.insertId);

        // SELECT solo los campos que necesita el frontend
        const [row] = await executeQuery(`
            SELECT id, title, description, category, main_image AS mainImage, images, created_at AS createdAt
            FROM projects WHERE id = ?
        `, [insertResult.insertId]);

        console.log('📄 Datos recuperados de la BD:', {
            row: row,
            imagesType: typeof row?.images,
            imagesValue: row?.images
        });

        // Parsear imágenes de forma segura
        let parsedImages = imagesPaths;
        if (row?.images) {
            try {
                // Si es un string que parece JSON, intentar parsearlo
                if (typeof row.images === 'string' && row.images.startsWith('[')) {
                    parsedImages = JSON.parse(row.images);
                } else if (typeof row.images === 'string') {
                    // Si es solo un string, convertirlo a array
                    parsedImages = [row.images];
                } else if (Array.isArray(row.images)) {
                    parsedImages = row.images;
                }
            } catch (parseError) {
                console.error('⚠️ Error parseando imágenes, usando fallback:', parseError.message);
                parsedImages = imagesPaths; // Usar las imágenes originales como fallback
            }
        }

        return NextResponse.json({
            ...row,
            images: parsedImages
        }, { status: 201 });
    } catch (error) {
        console.error('❌ Error completo creando proyecto:', error);
        console.error('❌ Stack trace:', error.stack);
        return NextResponse.json({
            error: 'Error interno al crear proyecto',
            details: error.message,
            hint: 'Verifica que la tabla projects existe en la BD'
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