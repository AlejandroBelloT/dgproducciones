import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'ID de contacto es requerido' }, { status: 400 });
        }

        // Obtener historial de acciones para el contacto
        const actionsQuery = `
            SELECT 
                ca.id,
                ca.action_type,
                ca.previous_status,
                ca.new_status,
                ca.notes,
                ca.action_date,
                ca.user_name,
                ca.user_email,
                u.name as current_user_name
            FROM contact_actions ca
            LEFT JOIN users u ON ca.user_id = u.id
            WHERE ca.contact_id = ?
            ORDER BY ca.action_date DESC
        `;

        const actions = await executeQuery(actionsQuery, [id]);

        // Obtener información básica del contacto
        const contactQuery = `
            SELECT id, name, email, status, created_at, 
                   created_by_name, last_modified_by_name, last_modified_at
            FROM contacts 
            WHERE id = ?
        `;

        const contactResult = await executeQuery(contactQuery, [id]);
        const contact = contactResult[0];

        if (!contact) {
            return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
        }

        return NextResponse.json({
            contact,
            actions,
            totalActions: actions.length
        });

    } catch (error) {
        console.error('Error fetching contact history:', error);
        return NextResponse.json(
            { error: 'Error al obtener historial del contacto' },
            { status: 500 }
        );
    }
}