import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import { sendContactConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Constantes para valores ENUM de la base de datos
const VALID_STATUSES = ['nuevo', 'contactado', 'seguimiento', 'cerrado'];
const VALID_PRIORITIES = ['baja', 'media', 'alta'];

// Función helper para validar ENUM values
function validateEnumValues(status, priority) {
    const errors = [];

    if (status && !VALID_STATUSES.includes(status)) {
        errors.push(`Status inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`);
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
        errors.push(`Prioridad inválida. Valores permitidos: ${VALID_PRIORITIES.join(', ')}`);
    }

    return errors;
}

// Función para registrar acciones de auditoría
async function logContactAction(contactId, actionType, previousStatus, newStatus, notes, userData) {
    try {
        const actionQuery = `
            INSERT INTO contact_actions (
                contact_id, user_id, action_type, previous_status, 
                new_status, notes, user_name, user_email
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await executeQuery(actionQuery, [
            contactId,
            userData?.id || 1, // Default a admin si no hay usuario
            actionType,
            previousStatus,
            newStatus,
            notes,
            userData?.name || 'Sistema',
            userData?.email || 'sistema@dgproducciones.com'
        ]);
    } catch (error) {
        console.error('Error logging contact action:', error);
        // No lanzar error para no interrumpir la operación principal
    }
}

export async function GET() {
    try {
        const query = `
            SELECT id, name, email, phone, company, message, status, priority, 
                   source, budget_estimated, event_date, service_type, notes, 
                   assigned_to, created_by, created_by_name, last_modified_by, 
                   last_modified_by_name, last_modified_at, created_at, updated_at
            FROM contacts 
            ORDER BY created_at DESC
        `;
        const contacts = await executeQuery(query);
        return NextResponse.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'Error al obtener contactos' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            name, email, message, company, phone,
            service_type, budget_estimated, event_date
        } = body || {};

        // Obtener datos del usuario (puede ser null para formularios públicos)
        const userData = getUserFromRequest(req);

        // Para formularios públicos, usar datos por defecto
        const defaultUserData = {
            id: 1, // Usuario del sistema por defecto
            name: 'Sistema Web'
        };

        const effectiveUserData = userData || defaultUserData;

        // Validación básica
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Nombre, email y mensaje son requeridos' },
                { status: 400 }
            );
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Email no válido' },
                { status: 400 }
            );
        }

        // Determinar prioridad basada en presupuesto
        let priority = 'media';
        if (budget_estimated) {
            const budget = parseFloat(budget_estimated);
            if (budget >= 5000000) {
                priority = 'alta';
            } else if (budget >= 1000000) {
                priority = 'media';
            } else {
                priority = 'baja';
            }
        }

        const query = `
            INSERT INTO contacts (
                name, email, phone, company, message, 
                source, status, priority, service_type, 
                budget_estimated, event_date, created_by, created_by_name
            )
            VALUES (?, ?, ?, ?, ?, 'formulario_web', 'nuevo', ?, ?, ?, ?, ?, ?)
        `;

        console.log('📝 Guardando contacto:', {
            name, email, phone, company, service_type,
            budget_estimated, event_date, priority,
            userData: effectiveUserData
        });

        const result = await executeQuery(query, [
            name,
            email,
            phone || null,
            company || null,
            message,
            priority,
            service_type || null,
            budget_estimated ? parseFloat(budget_estimated) : null,
            event_date || null,
            effectiveUserData.id,
            effectiveUserData.name
        ]);

        // Registrar acción de creación
        await logContactAction(
            result.insertId,
            'created',
            null,
            'nuevo',
            `Contacto creado desde formulario web. Mensaje: ${message.substring(0, 100)}...`,
            userData
        );

        // Obtener el contacto recién creado
        const newContactQuery = `
            SELECT id, name, email, phone, company, message, status, priority,
                   service_type, budget_estimated, event_date, created_by, 
                   created_by_name, created_at
            FROM contacts 
            WHERE id = ?
        `;
        const newContactResult = await executeQuery(newContactQuery, [result.insertId]);
        const newContact = newContactResult[0];

        console.log('✅ Contacto guardado exitosamente:', newContact);

        // Enviar email automático de confirmación
        try {
            console.log('📧 Enviando email de confirmación a:', email);

            const emailResult = await sendContactConfirmationEmail({
                name,
                email,
                phone,
                company,
                message,
                service_type,
                budget_estimated,
                event_date
            });

            if (emailResult.success) {
                console.log('✅ Email de confirmación enviado exitosamente:', emailResult.messageId);
            } else {
                console.error('❌ Error enviando email de confirmación:', emailResult.error);
                // No fallar la operación si el email falla, solo logear el error
            }
        } catch (emailError) {
            console.error('❌ Error enviando email de confirmación:', emailError);
            // No fallar la operación si el email falla
        }

        return NextResponse.json(newContact, { status: 201 });

    } catch (error) {
        console.error('❌ Error creating contact:', error);
        return NextResponse.json(
            { error: 'Error al crear contacto' },
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, status, priority, assigned_to, notes, service_type } = body || {};

        console.log('📥 PATCH request received:', { id, status, priority, assigned_to, notes, service_type });

        // Obtener datos del usuario
        const userData = getUserFromRequest(req);

        if (!id) {
            console.log('❌ ID missing in PATCH request');
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        // Obtener estado actual del contacto para auditoría
        const currentContactQuery = `
            SELECT status, priority, assigned_to, notes, service_type 
            FROM contacts WHERE id = ?
        `;
        const currentContactResult = await executeQuery(currentContactQuery, [id]);
        const currentContact = currentContactResult[0];

        if (!currentContact) {
            return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
        }

        // Validar valores ENUM
        const validationErrors = validateEnumValues(status, priority);
        if (validationErrors.length > 0) {
            console.log('❌ ENUM validation failed:', validationErrors);
            return NextResponse.json({
                error: validationErrors.join('. ')
            }, { status: 400 });
        }

        console.log('🔧 Actualizando contacto:', { id, status, priority, assigned_to, notes, service_type });

        // Construir query dinámico basado en los campos proporcionados
        const updates = [];
        const values = [];

        if (status) {
            updates.push('status = ?');
            values.push(status);
        }
        if (priority) {
            updates.push('priority = ?');
            values.push(priority);
        }
        if (assigned_to !== undefined) {
            updates.push('assigned_to = ?');
            values.push(assigned_to);
        }
        if (notes !== undefined) {
            updates.push('notes = ?');
            values.push(notes);
        }
        if (service_type) {
            updates.push('service_type = ?');
            values.push(service_type);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
        }

        // Agregar campos de auditoría
        updates.push('last_modified_by = ?', 'last_modified_by_name = ?', 'last_modified_at = CURRENT_TIMESTAMP');
        values.push(userData.id, userData.name);

        values.push(id);

        const query = `
            UPDATE contacts 
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        console.log('🔧 Ejecutando query:', query);
        console.log('🔧 Con valores:', values);

        await executeQuery(query, values);

        // Registrar acciones de auditoría
        if (status && status !== currentContact.status) {
            await logContactAction(
                id,
                'status_changed',
                currentContact.status,
                status,
                `Estado cambiado de "${currentContact.status}" a "${status}"`,
                userData
            );
        }

        if (notes && notes !== currentContact.notes) {
            await logContactAction(
                id,
                'note_added',
                null,
                null,
                notes,
                userData
            );
        }

        if (assigned_to !== undefined && assigned_to !== currentContact.assigned_to) {
            await logContactAction(
                id,
                'updated',
                null,
                null,
                `Contacto asignado a: ${assigned_to || 'Sin asignar'}`,
                userData
            );
        }

        // Obtener el contacto actualizado
        const updatedContactQuery = `
            SELECT id, name, email, phone, company, message, status, priority, 
                   source, assigned_to, notes, service_type, last_modified_by,
                   last_modified_by_name, last_modified_at, created_at, updated_at
            FROM contacts 
            WHERE id = ?
        `;
        const updatedContactResult = await executeQuery(updatedContactQuery, [id]);
        const updatedContact = updatedContactResult[0];

        if (!updatedContact) {
            return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
        }

        return NextResponse.json(updatedContact);

    } catch (error) {
        console.error('❌ Error updating contact (PATCH):', error);
        console.error('❌ Stack trace:', error.stack);
        return NextResponse.json(
            {
                error: 'Error al actualizar contacto',
                details: error.message
            },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            id, name, email, phone, company, message,
            status, priority, assigned_to, notes, service_type,
            budget_estimated, event_date
        } = body || {};

        if (!id || !name || !email) {
            return NextResponse.json(
                { error: 'ID, nombre y email son requeridos' },
                { status: 400 }
            );
        }

        // Validar valores ENUM
        const validationErrors = validateEnumValues(status, priority);
        if (validationErrors.length > 0) {
            return NextResponse.json({
                error: validationErrors.join('. ')
            }, { status: 400 });
        }

        console.log('🔧 Actualizando contacto completo:', {
            id, name, email, status, priority, service_type, budget_estimated, event_date
        });

        // Validación adicional de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Email no válido' },
                { status: 400 }
            );
        }

        const query = `
            UPDATE contacts 
            SET name = ?, email = ?, phone = ?, company = ?, message = ?,
                status = ?, priority = ?, assigned_to = ?, notes = ?, 
                service_type = ?, budget_estimated = ?, event_date = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        console.log('🔧 Ejecutando query PUT:', query);

        await executeQuery(query, [
            name, email, phone || null, company || null, message || '',
            status || 'nuevo', priority || 'media', assigned_to || null,
            notes || null, service_type || null, budget_estimated || null,
            event_date || null, id
        ]);

        // Obtener el contacto actualizado
        const updatedContactQuery = `
            SELECT id, name, email, phone, company, message, status, priority, 
                   source, assigned_to, notes, service_type, budget_estimated,
                   event_date, created_at, updated_at
            FROM contacts 
            WHERE id = ?
        `;
        const [updatedContact] = await executeQuery(updatedContactQuery, [id]);

        if (!updatedContact) {
            return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
        }

        return NextResponse.json(updatedContact);

    } catch (error) {
        console.error('Error updating full contact:', error);
        return NextResponse.json(
            { error: 'Error al actualizar contacto completo' },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body || {};

        // Obtener datos del usuario
        const userData = getUserFromRequest(req);

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        // Verificar que el contacto existe antes de eliminarlo y obtener sus datos
        const checkQuery = 'SELECT id, name, email, status FROM contacts WHERE id = ?';
        const checkResult = await executeQuery(checkQuery, [id]);
        const existingContact = checkResult[0];

        if (!existingContact) {
            return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
        }

        // Registrar acción de eliminación antes de eliminar
        await logContactAction(
            id,
            'deleted',
            existingContact.status,
            null,
            `Contacto eliminado: ${existingContact.name} (${existingContact.email})`,
            userData
        );

        const query = 'DELETE FROM contacts WHERE id = ?';
        await executeQuery(query, [id]);

        return NextResponse.json({
            ok: true,
            message: 'Contacto eliminado exitosamente',
            deletedBy: userData.name
        });

    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json(
            { error: 'Error al eliminar contacto' },
            { status: 500 }
        );
    }
}
