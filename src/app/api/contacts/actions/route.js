import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const body = await req.json();
        const { contactId, actionType, notes } = body;

        // Obtener datos del usuario autenticado
        const userData = getUserFromRequest(req);

        if (!userData) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        if (!contactId || !actionType) {
            return NextResponse.json(
                { error: 'Contact ID y tipo de acción son requeridos' },
                { status: 400 }
            );
        }

        // Obtener información del contacto
        const contactQuery = 'SELECT name, email, phone FROM contacts WHERE id = ?';
        const contactResult = await executeQuery(contactQuery, [contactId]);
        const contact = contactResult[0];

        if (!contact) {
            return NextResponse.json(
                { error: 'Contacto no encontrado' },
                { status: 404 }
            );
        }

        // Definir mensajes de notas según el tipo de acción
        let actionNotes = notes;
        if (!actionNotes) {
            switch (actionType) {
                case 'call':
                    actionNotes = `Llamada realizada a ${contact.phone}`;
                    break;
                case 'whatsapp':
                    actionNotes = `Mensaje de WhatsApp enviado a ${contact.phone}`;
                    break;
                case 'email':
                    actionNotes = `Email enviado a ${contact.email}`;
                    break;
                default:
                    actionNotes = `Acción de contacto: ${actionType}`;
            }
        }

        // Registrar la acción
        const actionQuery = `
            INSERT INTO contact_actions (
                contact_id, user_id, action_type, notes, user_name, user_email
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        const result = await executeQuery(actionQuery, [
            contactId,
            userData.id,
            actionType,
            actionNotes,
            userData.name,
            userData.email
        ]);

        return NextResponse.json({
            success: true,
            actionId: result.insertId,
            message: 'Acción registrada exitosamente'
        });

    } catch (error) {
        console.error('Error registrando acción de contacto:', error);
        return NextResponse.json(
            { error: 'Error al registrar acción de contacto' },
            { status: 500 }
        );
    }
}