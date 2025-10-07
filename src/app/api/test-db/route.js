import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Probar la conexión básica
        const connectionTest = await testConnection()

        if (!connectionTest) {
            return NextResponse.json({
                success: false,
                error: 'No se pudo conectar a MySQL',
                details: 'Verifica que MySQL esté corriendo y las credenciales sean correctas'
            })
        }

        // 2. Verificar si la base de datos existe
        try {
            const [dbCheck] = await executeQuery("SELECT DATABASE() as current_db")

            // 3. Verificar si las tablas existen
            const tables = await executeQuery("SHOW TABLES")

            return NextResponse.json({
                success: true,
                message: 'Conexión exitosa a la base de datos',
                database: dbCheck.current_db,
                tables: tables.map(table => Object.values(table)[0]),
                tableCount: tables.length
            })
        } catch (dbError) {
            return NextResponse.json({
                success: false,
                error: 'Base de datos no existe',
                message: 'Debes ejecutar el script SQL para crear la base de datos dgproducciones',
                details: dbError.message
            })
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Error de conexión',
            details: error.message,
            hint: 'Verifica las variables de entorno en .env.local'
        })
    }
}