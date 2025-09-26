'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function FloatingButtons() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 100) {
                setIsVisible(true)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const handleWhatsAppClick = () => {
        const phoneNumber = '56995777796'
        const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus servicios de producción BTL.')

        // Detectar si es dispositivo móvil
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        if (isMobile) {
            // En móviles, intentar abrir la app nativa primero
            window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${message}`

            // Fallback a WhatsApp Web si la app no está instalada
            setTimeout(() => {
                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
            }, 1000)
        } else {
            // En escritorio, abrir WhatsApp Web directamente
            window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank')
        }
    }

    return (
        <div className={`fixed right-4 bottom-4 z-50 flex flex-col gap-3 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
            {/* Botón WhatsApp */}
            <button
                onClick={handleWhatsAppClick}
                className="group relative w-14 h-14 flex items-center justify-center hover:shadow-xl transform hover:scale-110 transition-all duration-300 "
                title="WhatsApp - ¡Conversemos!"
            >
                <Image
                    src="/iconos/whatsapp.png"
                    alt="WhatsApp"
                    width={56}
                    height={56}
                    className="object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                />
                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    ¡Conversemos por WhatsApp!
                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
                </div>
            </button>

            {/* Botón Instagram */}
            <a
                href="https://instagram.com/dgproducciones"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 flex items-center justify-center hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                title="Instagram - Síguenos"
            >
                <Image
                    src="/iconos/instagram.png"
                    alt="Instagram"
                    width={56}
                    height={56}
                    className="object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                />
                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    ¡Síguenos en Instagram!
                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
                </div>
            </a>
        </div>
    )
}