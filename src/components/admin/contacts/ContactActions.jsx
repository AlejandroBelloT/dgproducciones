'use client'

import Button from '@/components/ui/Button'

const ACTION_CONFIG = {
    call: {
        icon: '📞',
        label: 'Llamar',
        color: 'text-green-600 hover:bg-green-50',
        unavailableColor: 'text-gray-400'
    },
    whatsapp: {
        icon: '💬',
        label: 'WhatsApp',
        color: 'text-green-600 hover:bg-green-50',
        unavailableColor: 'text-gray-400'
    },
    email: {
        icon: '✉️',
        label: 'Email',
        color: 'text-blue-600 hover:bg-blue-50',
        unavailableColor: 'text-gray-400'
    }
}

// Plantillas de mensajes predefinidas
const MESSAGE_TEMPLATES = {
    customer: {
        whatsapp: (name) => `Hola ${name}, nos contactaste a través de nuestra página web. ¿En qué podemos ayudarte?`,
        email: {
            subject: (name) => `Seguimiento - Solicitud de cotización`,
            body: (name) => `Estimado/a ${name},\n\nGracias por contactarnos. Nos ponemos en contacto para dar seguimiento a tu solicitud.\n\nSaludos cordiales,\nEquipo DG Producciones`
        }
    },
    team: {
        whatsapp: () => '', // Mensaje vacío para contactos del equipo
        email: {
            subject: () => '', // Asunto vacío para contactos del equipo
            body: () => '' // Cuerpo vacío para contactos del equipo
        }
    },
    generic: {
        whatsapp: (name) => `Hola ${name}, ¿cómo estás?`,
        email: {
            subject: (name) => `Contacto`,
            body: (name) => `Hola ${name},\n\nEspero que estés bien.\n\nSaludos cordiales`
        }
    }
}

export default function ContactActions({
    email,
    phone,
    name,
    disabled = false,
    size = "md",
    layout = "horizontal", // "horizontal" | "vertical"
    context = "customer", // "customer" | "team" | "generic" | "custom"
    customMessages = null, // Para mensajes completamente personalizados
    showLabels = true, // Mostrar/ocultar labels de botones
    actions = ['call', 'whatsapp', 'email'], // Qué acciones mostrar
    onActionClick = null // Callback opcional para tracking
}) {
    const cleanPhone = phone ? phone.replace(/\s/g, '').replace(/^\+/, '') : null

    // Obtener plantillas de mensaje según el contexto
    const getMessageTemplate = () => {
        if (customMessages) return customMessages
        return MESSAGE_TEMPLATES[context] || MESSAGE_TEMPLATES.generic
    }

    const messageTemplate = getMessageTemplate()

    const handleCall = () => {
        if (phone && !disabled) {
            window.location.href = `tel:${cleanPhone}`
            onActionClick?.('call', { name, phone, email })
        }
    }

    const handleWhatsApp = () => {
        if (phone && !disabled) {
            const message = typeof messageTemplate.whatsapp === 'function'
                ? messageTemplate.whatsapp(name)
                : messageTemplate.whatsapp || ''

            // Si el mensaje está vacío, abrir WhatsApp sin parámetro text
            const whatsappUrl = message.trim() === ''
                ? `https://wa.me/${cleanPhone}`
                : `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

            window.open(whatsappUrl, '_blank')
            onActionClick?.('whatsapp', { name, phone, email })
        }
    }

    const handleEmail = () => {
        if (email && !disabled) {
            const emailTemplate = messageTemplate.email || {}

            const subject = typeof emailTemplate.subject === 'function'
                ? emailTemplate.subject(name)
                : emailTemplate.subject || ''

            const body = typeof emailTemplate.body === 'function'
                ? emailTemplate.body(name)
                : emailTemplate.body || ''

            // Construir la URL del email solo con parámetros que no estén vacíos
            let emailUrl = `mailto:${email}`
            const params = []

            if (subject.trim() !== '') {
                params.push(`subject=${encodeURIComponent(subject)}`)
            }

            if (body.trim() !== '') {
                params.push(`body=${encodeURIComponent(body)}`)
            }

            if (params.length > 0) {
                emailUrl += `?${params.join('&')}`
            }

            window.location.href = emailUrl
            onActionClick?.('email', { name, phone, email })
        }
    }

    // Configuración de todas las acciones posibles
    const allActions = {
        call: {
            key: 'call',
            onClick: handleCall,
            available: !!phone,
            config: ACTION_CONFIG.call
        },
        whatsapp: {
            key: 'whatsapp',
            onClick: handleWhatsApp,
            available: !!phone,
            config: ACTION_CONFIG.whatsapp
        },
        email: {
            key: 'email',
            onClick: handleEmail,
            available: !!email,
            config: ACTION_CONFIG.email
        }
    }

    // Filtrar solo las acciones solicitadas
    const filteredActions = actions
        .filter(actionKey => allActions[actionKey])
        .map(actionKey => allActions[actionKey])

    const containerClass = layout === 'vertical'
        ? 'flex flex-col gap-2'
        : 'flex gap-2 flex-wrap'

    return (
        <div className={containerClass}>
            {filteredActions.map((action) => {
                const isDisabled = disabled || !action.available
                const colorClass = isDisabled
                    ? action.config.unavailableColor
                    : action.config.color

                return (
                    <Button
                        key={action.key}
                        size={size}
                        variant="outline"
                        onClick={action.onClick}
                        disabled={isDisabled}
                        className={`flex items-center gap-1 ${colorClass} transition-colors`}
                        title={
                            isDisabled
                                ? `${action.config.label} no disponible`
                                : `${action.config.label} a ${name}`
                        }
                    >
                        <span>{action.config.icon}</span>
                        {showLabels && (
                            <span className="hidden sm:inline">{action.config.label}</span>
                        )}
                    </Button>
                )
            })}
        </div>
    )
}