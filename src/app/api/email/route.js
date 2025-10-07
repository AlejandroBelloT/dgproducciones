import { NextResponse } from 'next/server';
import { sendEmail, sendContactConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (!type) {
            return NextResponse.json(
                { error: 'Tipo de email requerido' },
                { status: 400 }
            );
        }

        let result;

        switch (type) {
            case 'contact_confirmation':
                if (!data.email || !data.name) {
                    return NextResponse.json(
                        { error: 'Email y nombre son requeridos para confirmación de contacto' },
                        { status: 400 }
                    );
                }

                result = await sendContactConfirmationEmail(data);
                break;

            case 'custom':
                if (!data.to || !data.subject || (!data.html && !data.text)) {
                    return NextResponse.json(
                        { error: 'Para email personalizado se requiere: to, subject y html/text' },
                        { status: 400 }
                    );
                }

                result = await sendEmail(data);
                break;

            default:
                return NextResponse.json(
                    { error: 'Tipo de email no válido' },
                    { status: 400 }
                );
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
                messageId: result.messageId
            });
        } else {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error en API de email:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}