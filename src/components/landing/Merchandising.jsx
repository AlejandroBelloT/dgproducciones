'use client'

import Button from '@/components/ui/Button'

const MERCHANDISING_ITEMS = [
    {
        id: 1,
        title: 'Tazones y Sublimados',
        description: 'Tazones, mouse pads, azulejos y más artículos con sublimación profesional',
        examples: ['Tazones cerámicos', 'Mouse pads', 'Azulejos decorativos', 'Termos personalizados'],
        gradient: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200'
    },
    {
        id: 2,
        title: 'Textiles y Prendas',
        description: 'Poleras, polerones, delantales y ropa personalizada con estampado de calidad',
        examples: ['Poleras corporativas', 'Polerones con capucha', 'Delantales promocionales', 'Gorros personalizados'],
        gradient: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
    },
    {
        id: 3,
        title: 'Artículos Promocionales',
        description: 'Llaveros, libretas, bolígrafos y accesorios corporativos personalizados',
        examples: ['Llaveros metálicos', 'Libretas corporativas', 'Bolígrafos grabados', 'Porta celulares'],
        gradient: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200'
    }
]

const FEATURES = [
    {
        title: 'Calidad Premium',
        description: 'Materiales de primera calidad y acabados profesionales',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
        title: 'Diseño Profesional',
        description: 'Adaptación de marca y creación de diseños únicos',
        icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
    },
    {
        title: 'Entrega Garantizada',
        description: 'Cumplimiento de plazos y tiempos de producción',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
        title: 'Asesoría Especializada',
        description: 'Acompañamiento técnico en todo el proceso',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    }
]

export default function Merchandising() {
    const handleContactClick = () => {
        const phoneNumber = '56995777796'
        const message = encodeURIComponent(
            'Hola, me interesa conocer más sobre sus servicios de merchandising corporativo. ¿Podrían enviarme información detallada?'
        )

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        if (isMobile) {
            window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${message}`
            setTimeout(() => {
                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
            }, 1000)
        } else {
            window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank')
        }
    }

    return (
        <section id="merchandising" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-block">
                        <h2 className="font-title text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Merchandising
                            <span className="block text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent font-light mt-2">
                                Corporativo
                            </span>
                        </h2>
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-gray-800 to-gray-600 mx-auto mb-8"></div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                        Soluciones profesionales de personalización con técnicas de
                        <span className="font-semibold text-gray-800"> sublimación</span> y
                        <span className="font-semibold text-gray-800"> estampado</span> de alta calidad
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-20">
                    {MERCHANDISING_ITEMS.map((item, index) => (
                        <div
                            key={item.id}
                            className={`group relative ${item.bgColor} rounded-2xl p-8 border ${item.borderColor} hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient} rounded-t-2xl"></div>

                            <div className="relative">
                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-xl text-white font-bold text-xl mb-6 shadow-lg`}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                <h3 className={`font-title text-2xl font-bold ${item.textColor} mb-4`}>
                                    {item.title}
                                </h3>

                                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                    {item.description}
                                </p>

                                {/* Examples list */}
                                <div className="space-y-2">
                                    {item.examples.map((example, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-gray-500">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.gradient} mr-3`}></div>
                                            {example}
                                        </div>
                                    ))}
                                    <div className="flex items-center text-sm text-gray-400 italic mt-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3"></div>
                                        Y muchos productos más...
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Products Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="font-title text-3xl font-bold text-gray-900 mb-4">
                            Nuestros Productos Destacados
                        </h3>
                        <div className="w-16 h-1 bg-gray-800 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Amplio catálogo de productos personalizables con las mejores técnicas de impresión
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Sublimación */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                                    S
                                </div>
                                <div>
                                    <h4 className="font-title text-xl font-bold text-orange-700">Técnica de Sublimación</h4>
                                    <p className="text-orange-600 text-sm">Impresión permanente y resistente</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-gray-800 mb-2">Productos populares:</h5>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>• Tazones cerámicos</div>
                                        <div>• Mouse pads</div>
                                        <div>• Azulejos personalizados</div>
                                        <div>• Termos y vasos</div>
                                        <div>• Cojines decorativos</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-gray-800 mb-2">Ventajas:</h5>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>• Colores vibrantes</div>
                                        <div>• Resistente al lavado</div>
                                        <div>• No se desprende</div>
                                        <div>• Acabado profesional</div>
                                        <div>• Durabilidad garantizada</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estampado */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                                    E
                                </div>
                                <div>
                                    <h4 className="font-title text-xl font-bold text-blue-700">Técnica de Estampado</h4>
                                    <p className="text-blue-600 text-sm">Personalización versátil en textiles</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-gray-800 mb-2">Productos textiles:</h5>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>• Poleras corporativas</div>
                                        <div>• Polerones con capucha</div>
                                        <div>• Delantales promocionales</div>
                                        <div>• Gorros y accesorios</div>
                                        <div>• Bolsas personalizadas</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-gray-800 mb-2">Características:</h5>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>• Múltiples colores</div>
                                        <div>• Diseños complejos</div>
                                        <div>• Variedad de tallas</div>
                                        <div>• Telas de calidad</div>
                                        <div>• Acabados flexibles</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional products note */}
                    <div className="mt-12 text-center bg-gray-50 rounded-2xl p-8">
                        <h4 className="font-title text-xl font-bold text-gray-800 mb-4">
                            ¿Buscas algo específico?
                        </h4>
                        <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                            Trabajamos con una amplia variedad de productos adicionales: llaveros metálicos y acrílicos,
                            libretas corporativas, bolígrafos grabados, porta celulares, calendarios, magnetos,
                            y muchos artículos promocionales más. Si no ves lo que buscas, ¡consulta por disponibilidad!
                        </p>
                        <div className="inline-flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-lg">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Catálogo completo disponible por WhatsApp
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-gray-50 rounded-3xl p-12 mb-20">
                    <div className="text-center mb-12">
                        <h3 className="font-title text-3xl font-bold text-gray-900 mb-4">
                            Por qué elegir nuestros servicios
                        </h3>
                        <div className="w-16 h-1 bg-gray-800 mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((feature, index) => (
                            <div key={index} className="text-center group">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-md group-hover:shadow-lg transition-shadow duration-300 mb-6">
                                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900 text-lg mb-3">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-20 translate-x-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-16 -translate-x-16"></div>

                    <div className="relative z-10">
                        <h3 className="font-title text-3xl sm:text-4xl font-bold mb-6">
                            ¿Listo para potenciar tu marca?
                        </h3>

                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
                            Obtén una cotización personalizada y descubre cómo podemos
                            ayudarte a crear productos únicos para tu empresa
                        </p>

                        <Button
                            variant="primary"
                            size="xl"
                            onClick={handleContactClick}
                            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-4 px-12 rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            Solicitar Información
                        </Button>

                        <div className="flex items-center justify-center mt-6 space-x-8 text-sm text-gray-400">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Respuesta en 24h
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Cotización gratuita
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Asesoría especializada
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}