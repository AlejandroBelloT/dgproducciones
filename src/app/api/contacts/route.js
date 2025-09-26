import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export const dynamic = 'force-static';

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

export async function GET() {
    try {
        const query = `
            SELECT id, name, email, phone, company, message, status, priority, 
                   source, budget_estimated, event_date, service_type, notes, 
                   assigned_to, created_at, updated_at
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
                budget_estimated, event_date
            )
            VALUES (?, ?, ?, ?, ?, 'formulario_web', 'nuevo', ?, ?, ?, ?)
        `;

        console.log('📝 Guardando contacto:', {
            name, email, phone, company, service_type,
            budget_estimated, event_date, priority
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
            event_date || null
        ]);

        // Obtener el contacto recién creado
        const newContactQuery = `
            SELECT id, name, email, phone, company, message, status, priority,
                   service_type, budget_estimated, event_date, created_at
            FROM contacts 
            WHERE id = ?
        `;
        const [newContact] = await executeQuery(newContactQuery, [result.insertId]);

        console.log('✅ Contacto guardado exitosamente:', newContact);

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

        if (!id) {
            console.log('❌ ID missing in PATCH request');
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
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

        values.push(id);

        const query = `
            UPDATE contacts 
            SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        console.log('🔧 Ejecutando query:', query);
        console.log('🔧 Con valores:', values);

        await executeQuery(query, values);

        // Obtener el contacto actualizado
        const updatedContactQuery = `
            SELECT id, name, email, phone, company, message, status, priority, 
                   source, assigned_to, notes, service_type, created_at, updated_at
            FROM contacts 
            WHERE id = ?
        `;
        const [updatedContact] = await executeQuery(updatedContactQuery, [id]);

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

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        // Verificar que el contacto existe antes de eliminarlo
        const checkQuery = 'SELECT id FROM contacts WHERE id = ?';
        const [existingContact] = await executeQuery(checkQuery, [id]);

        if (!existingContact) {
            return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
        }

        const query = 'DELETE FROM contacts WHERE id = ?';
        await executeQuery(query, [id]);

        return NextResponse.json({ ok: true, message: 'Contacto eliminado exitosamente' });

    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json(
            { error: 'Error al eliminar contacto' },
            { status: 500 }
        );
    }
}
