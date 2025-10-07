'use client'

import Image from 'next/image'

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
            {/* Efectos de fondo */}
            <div className="absolute inset-0 pattern-dots opacity-10"></div>
            <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-gradient-to-bl from-orange-300/20 to-orange-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-tr from-blue-300/20 to-blue-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
                {/* Logo y título - más compacto */}
                <div className="mb-4 animate-fade-up">
                    <div className="flex justify-center mb-3">
                        <div className="">
                            <Image
                                src="/images/logo/logo.png"
                                alt="DG Producciones Logo"
                                width={200}
                                height={200}
                                className="mx-auto"
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="font-title text-2xl md:text-3xl lg:text-7xl font-bold mb-2 bg-gradient-to-r from-blue-700 via-green-600 to-blue-700 bg-clip-text text-transparent">
                        DG PRODUCCIONES
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-4">
                        Eventos BTL & Marketing Experiencial
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 items-start">
                    {/* Imagen de construcción - más pequeña */}
                    <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: '200ms' }}>
                        <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56">
                            <div className="text-4xl md:text-[200px] mb-2">🚧</div>
                        </div>
                    </div>

                    {/* Mensaje principal - centro */}
                    <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: '300ms' }}>
                        <h2 className="font-title text-2xl md:text-3xl font-bold mb-3 text-gray-800">
                            Sitio en Mantenimiento
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 mb-3 leading-relaxed">
                            Estamos trabajando para mejorar tu experiencia
                        </p>
                        <p className="text-base text-gray-500 leading-relaxed">
                            Nuestro equipo está realizando actualizaciones importantes.
                            Estaremos de vuelta muy pronto.
                        </p>
                    </div>

                    {/* Información de contacto - derecha */}
                    <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: '400ms' }}>
                        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-xl border border-gray-100">
                            <h3 className="font-title text-lg font-bold mb-4 text-gray-800">
                                ¿Necesitas contactarnos?
                            </h3>
                            <div className="space-y-3">
                                {/* WhatsApp */}
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                                    <Image
                                        src="/iconos/whatsapp.png"
                                        alt="WhatsApp"
                                        width={32}
                                        height={32}
                                        className="flex-shrink-0"
                                    />
                                    <div className="text-left">
                                        <h4 className="font-semibold text-gray-800 text-sm mb-1">WhatsApp</h4>
                                        <a
                                            href="https://wa.me/56995777796?text=Hola,%20vi%20que%20el%20sitio%20está%20en%20mantenimiento.%20¿Cuándo%20estará%20disponible?"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 font-medium hover:underline text-sm"
                                        >
                                            +56 9 9577 7796
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                    <div className="text-2xl">📧</div>
                                    <div className="text-left">
                                        <h4 className="font-semibold text-gray-800 text-sm mb-1">Email</h4>
                                        <a
                                            href="mailto:daniel@dgproducciones.cl?subject=Consulta%20-%20Sitio%20en%20Mantenimiento"
                                            className="text-blue-600 font-medium hover:underline text-sm"
                                        >
                                            daniel@dgproducciones.cl
                                        </a>
                                    </div>
                                </div>

                                {/* Tiempo estimado */}
                                <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                                    <div className="flex items-center gap-2 text-orange-700">
                                        <div className="text-xl">⏱️</div>
                                        <div>
                                            <p className="font-semibold text-sm mb-1">PRONTO ESTAREMOS DE REGRESO</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - más compacto */}
                <div className="mt-6 animate-fade-up" style={{ animationDelay: '500ms' }}>
                    <p className="text-gray-400 text-xs">
                        © {new Date().getFullYear()} DG Producciones - Todos los derechos reservados
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-up {
                    animation: fade-up 0.8s ease-out forwards;
                }
                
                .pattern-dots {
                    background-image: radial-gradient(circle, #94a3b8 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    )
// Eliminado: componente MaintenancePage