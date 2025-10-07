import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET() {
    try {
        // Verificar si la tabla users existe
        const tableCheck = await executeQuery(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE() 
            AND table_name = 'users'
        `);

        if (tableCheck[0].count === 0) {
            return NextResponse.json({
                error: 'La tabla users no existe. Ejecuta el script SQL primero.',
                needsSetup: true
            }, { status: 404 });
        }

        // Verificar estructura de la tabla
        const columns = await executeQuery(`
            DESCRIBE users
        `);

        // Contar usuarios existentes
        const userCount = await executeQuery(`
            SELECT COUNT(*) as total FROM users
        `);

        return NextResponse.json({
            message: 'Base de datos de usuarios configurada correctamente',
            tableExists: true,
            columns: columns.map(col => ({
                field: col.Field,
                type: col.Type,
                null: col.Null,
                key: col.Key,
                default: col.Default
            })),
            totalUsers: userCount[0].total
        });

    } catch (error) {
        console.error('Error checking users database:', error);
        return NextResponse.json({
            error: 'Error al verificar la base de datos',
            details: error.message
        }, { status: 500 });
    }
}