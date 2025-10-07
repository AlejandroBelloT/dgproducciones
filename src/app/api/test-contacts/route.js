import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test de conectividad básica
        const testData = {
            timestamp: new Date().toISOString(),
            status: 'API funcionando correctamente',
            endpoints: [
                'GET /api/test-contacts - Este endpoint',
                'GET /api/contacts - Obtener todos los contactos',
                'POST /api/contacts - Crear nuevo contacto',
                'PATCH /api/contacts - Actualizar contacto (parcial)',
                'PUT /api/contacts - Actualizar contacto (completo)',
                'DELETE /api/contacts - Eliminar contacto'
            ],
            validStatuses: ['nuevo', 'contactado', 'seguimiento', 'cerrado'],
            validPriorities: ['baja', 'media', 'alta']
        };

        return NextResponse.json(testData);
    } catch (error) {
        console.error('❌ Error en test endpoint:', error);
        return NextResponse.json(
            {
                error: 'Error en test endpoint',
                details: error.message
            },
            { status: 500 }
        );
    }
}