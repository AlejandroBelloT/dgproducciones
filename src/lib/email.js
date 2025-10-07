// Configuración del servicio de email usando SMTP de cPanel
// Este archivo maneja el envío de emails automáticos
import nodemailer from 'nodemailer';

// Configuración del transportador SMTP con datos de cPanel
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'webmail.dgproducciones.cl',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // false para TLS, true para SSL (puerto 465)
    auth: {
        user: process.env.SMTP_USER || 'daniel@dgproducciones.cl',
        pass: process.env.SMTP_PASS || 'Xdaniel6196'
    },
    tls: {
        rejectUnauthorized: false // Para servidores con certificados auto-firmados
    }
});

// Verificar la configuración SMTP al cargar el módulo
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error de configuración SMTP:', error);
    } else {
        console.log('✅ Servidor SMTP listo para enviar emails');
    }
});

// Función para enviar email usando Nodemailer con SMTP real
export async function sendEmail({ to, subject, html, text }) {
    try {
        const emailData = {
            from: process.env.SMTP_FROM || '"DG Producciones" <daniel@dgproducciones.cl>',
            to: to,
            subject: subject,
            html: html,
            text: text
        };

        console.log('📧 Enviando email a:', to);
        console.log('📋 Asunto:', subject);

        // Enviar el email usando Nodemailer
        const result = await transporter.sendMail(emailData);

        console.log('✅ Email enviado exitosamente:', {
            messageId: result.messageId,
            to: to,
            timestamp: new Date().toISOString()
        });

        return {
            success: true,
            messageId: result.messageId,
            message: 'Email enviado exitosamente'
        };

    } catch (error) {
        console.error('❌ Error enviando email:', error);
        return {
            success: false,
            error: error.message
        };
    }
}// Función específica para email de confirmación de contacto
export async function sendContactConfirmationEmail(contactData) {
    const { name, email, company, phone, message, service_type, budget_estimated, event_date } = contactData;

    const subject = '✅ Confirmación de solicitud recibida - DG Producciones';

    // Template HTML del email
    const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Solicitud - DG Producciones</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                .header {
                    background: linear-gradient(135deg, #2563eb, #10b981);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 30px 20px;
                }
                .success-badge {
                    background: #10b981;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    display: inline-block;
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                .details-card {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 4px solid #2563eb;
                }
                .detail-row {
                    margin: 10px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                .detail-label {
                    font-weight: bold;
                    color: #374151;
                    display: inline-block;
                    width: 140px;
                }
                .detail-value {
                    color: #6b7280;
                }
                .next-steps {
                    background: #eff6ff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 4px solid #3b82f6;
                }
                .footer {
                    background: #374151;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    font-size: 14px;
                }
                .contact-info {
                    margin: 15px 0;
                }
                .social-links {
                    margin: 15px 0;
                }
                .social-links a {
                    color: #10b981;
                    text-decoration: none;
                    margin: 0 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 DG Producciones</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Especialistas en Marketing BTL y Eventos</p>
                </div>
                
                <div class="content">
                    <div class="success-badge">
                        ✅ Solicitud Recibida
                    </div>
                    
                    <h2 style="color: #1f2937; margin-bottom: 20px;">¡Hola ${name}!</h2>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        Gracias por contactarnos. Hemos recibido tu solicitud de cotización y nuestro equipo la revisará 
                        muy pronto para brindarte la mejor propuesta.
                    </p>
                    
                    <div class="details-card">
                        <h3 style="margin-top: 0; color: #374151;">📋 Resumen de tu solicitud:</h3>
                        
                        <div class="detail-row">
                            <span class="detail-label">👤 Nombre:</span>
                            <span class="detail-value">${name}</span>
                        </div>
                        
                        <div class="detail-row">
                            <span class="detail-label">📧 Email:</span>
                            <span class="detail-value">${email}</span>
                        </div>
                        
                        ${phone ? `
                        <div class="detail-row">
                            <span class="detail-label">📱 Teléfono:</span>
                            <span class="detail-value">${phone}</span>
                        </div>
                        ` : ''}
                        
                        ${company ? `
                        <div class="detail-row">
                            <span class="detail-label">🏢 Empresa:</span>
                            <span class="detail-value">${company}</span>
                        </div>
                        ` : ''}
                        
                        ${service_type ? `
                        <div class="detail-row">
                            <span class="detail-label">🎯 Servicio:</span>
                            <span class="detail-value">${getServiceTypeName(service_type)}</span>
                        </div>
                        ` : ''}
                        
                        ${budget_estimated ? `
                        <div class="detail-row">
                            <span class="detail-label">💰 Presupuesto:</span>
                            <span class="detail-value">${getBudgetName(budget_estimated)}</span>
                        </div>
                        ` : ''}
                        
                        ${event_date ? `
                        <div class="detail-row">
                            <span class="detail-label">📅 Fecha evento:</span>
                            <span class="detail-value">${new Date(event_date).toLocaleDateString('es-ES')}</span>
                        </div>
                        ` : ''}
                        
                        <div class="detail-row" style="border-bottom: none;">
                            <span class="detail-label">💬 Mensaje:</span>
                            <div class="detail-value" style="margin-top: 8px; padding: 10px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
                                ${message}
                            </div>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h3 style="margin-top: 0; color: #1e40af;">🚀 Próximos pasos:</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>Revisión:</strong> Analizaremos tu solicitud en detalle</li>
                            <li><strong>Contacto:</strong> Te contactaremos lo antes posible</li>
                            <li><strong>Propuesta:</strong> Te enviaremos una propuesta personalizada</li>
                            <li><strong>Reunión:</strong> Coordinaremos una reunión para afinar detalles</li>
                        </ul>
                    </div>
                    
                    <p style="font-size: 16px; color: #374151;">
                        Si tienes alguna consulta urgente, no dudes en contactarnos directamente:
                    </p>
                    
                    <div class="contact-info">
                        <p><strong>📱 WhatsApp:</strong> <a href="https://wa.me/56995777796" style="color: #10b981;">+56 9 9577 7796</a></p>
                        <p><strong>📧 Email:</strong> <a href="mailto:daniel@dgproducciones.cl" style="color: #2563eb;">daniel@dgproducciones.cl</a></p>
                    </div>
                </div>
                
                <div class="footer">
                    <p style="margin: 0 0 10px 0;"><strong>DG Producciones</strong></p>
                    <p style="margin: 5px 0;">Especialistas en Marketing BTL, Eventos y Activaciones de Marca</p>
                    
                    <div class="social-links">
                        <a href="https://www.instagram.com/dg_producciones">📱 Instagram</a>
                        <a href="https://wa.me/56995777796">💬 WhatsApp</a>
                    </div>
                    
                    <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
                        Este es un email automático. Por favor no responder a esta dirección.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    // Version en texto plano
    const text = `
¡Hola ${name}!

Gracias por contactarnos. Hemos recibido tu solicitud de cotización y nuestro equipo la revisará muy pronto.

RESUMEN DE TU SOLICITUD:
- Nombre: ${name}
- Email: ${email}
${phone ? `- Teléfono: ${phone}` : ''}
${company ? `- Empresa: ${company}` : ''}
${service_type ? `- Servicio: ${getServiceTypeName(service_type)}` : ''}
${budget_estimated ? `- Presupuesto: ${getBudgetName(budget_estimated)}` : ''}
${event_date ? `- Fecha evento: ${new Date(event_date).toLocaleDateString('es-ES')}` : ''}
- Mensaje: ${message}

PRÓXIMOS PASOS:
1. Revisaremos tu solicitud en detalle
2. Te contactaremos en las próximas 2-4 horas hábiles
3. Te enviaremos una propuesta personalizada
4. Coordinaremos una reunión para afinar detalles

CONTACTO DIRECTO:
WhatsApp: +56 9 9577 7796
Email: daniel@dgproducciones.cl

--
DG Producciones
Especialistas en Marketing BTL, Eventos y Activaciones de Marca
    `;

    return await sendEmail({
        to: email,
        subject,
        html,
        text
    });
}

// Funciones helper para convertir códigos a nombres legibles
function getServiceTypeName(serviceType) {
    const serviceNames = {
        'eventos_btl': '🎭 Eventos BTL',
        'stands': '🏢 Stands y Módulos',
        'activaciones': '📱 Activaciones de Marca',
        'material_publicitario': '📄 Material Publicitario',
        'logistica_eventos': '🚛 Logística de Eventos',
        'consulta_general': '💬 Consulta General'
    };
    return serviceNames[serviceType] || serviceType;
}

function getBudgetName(budget) {
    const budgets = {
        '500000': 'Menos de $500.000',
        '1000000': '$500.000 - $1.000.000',
        '2000000': '$1.000.000 - $2.000.000',
        '5000000': '$2.000.000 - $5.000.000',
        '10000000': 'Más de $5.000.000',
        '0': 'A definir en reunión'
    };
    return budgets[budget] || budget;
}