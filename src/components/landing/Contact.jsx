"use client";
import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function Contact() {
    const [status, setStatus] = useState(null);

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

    async function onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const payload = {
            name: fd.get('name'),
            email: fd.get('email'),
            phone: fd.get('phone'),
            company: fd.get('company'),
            message: fd.get('message'),
            service_type: fd.get('service_type'),
            budget_estimated: fd.get('budget_estimated') || null,
            event_date: fd.get('event_date') || null
        };
        
        setStatus('loading');
        
        try {
            const res = await fetch('/api/contacts', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            
            if (res.ok) {
                setStatus('ok');
                // Limpiar completamente el formulario
                form.reset();
                
                // Opcional: Scroll hacia arriba para mostrar el mensaje de éxito
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Resetear el estado después de 5 segundos
                setTimeout(() => {
                    setStatus(null);
                }, 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error enviando formulario:', error);
            setStatus('error');
        }
    }

    return (
        <section id="contact" className="relative py-24 overflow-hidden">
            {/* Overlay premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white/30 to-green-50/40"></div>
            {/* Efectos de fondo */}
            <div className="absolute inset-0 pattern-dots opacity-20"></div>
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-bl from-orange-300/20 to-orange-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-blue-300/20 to-blue-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 animate-fade-up">
                    <h2 className="font-title text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-green-600 to-blue-700 bg-clip-text text-transparent">
                        Hagamos realidad tu próximo proyecto
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Cuéntanos tu visión y te ayudaremos a crear una experiencia BTL que impacte y genere resultados medibles
                    </p>
                </div>

                <div className="grid xl:grid-cols-3 lg:grid-cols-5 gap-12 items-start">
                    {/* Formulario mejorado - ocupa más espacio */}
                    <div className="xl:col-span-2 lg:col-span-3 bg-white/80 backdrop-blur rounded-3xl p-10 shadow-2xl border border-gray-100 animate-slide-in-left">
                        <h3 className="font-title text-2xl font-bold mb-6 text-gray-800 text-center">Solicita tu cotización gratuita</h3>
                        <form onSubmit={onSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <input
                                        name="name"
                                        placeholder="Nombre completo"
                                        required
                                        className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-lg"
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        name="company"
                                        placeholder="Empresa / Marca"
                                        className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-lg"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <select
                                        name="service_type"
                                        className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                                    >
                                        <option value="">Tipo de servicio</option>
                                        <option value="eventos_btl">🎭 Eventos BTL</option>
                                        <option value="stands">🏢 Stands y Módulos</option>
                                        <option value="activaciones">📱 Activaciones de Marca</option>
                                        <option value="material_publicitario">📄 Material Publicitario</option>
                                        <option value="logistica_eventos">🚛 Logística de Eventos</option>
                                        <option value="consulta_general">💬 Consulta General</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <select
                                        name="budget_estimated"
                                        className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                                    >
                                        <option value="">Presupuesto estimado</option>
                                        <option value="500000">Menos de $500.000</option>
                                        <option value="1000000">$500.000 - $1.000.000</option>
                                        <option value="2000000">$1.000.000 - $2.000.000</option>
                                        <option value="5000000">$2.000.000 - $5.000.000</option>
                                        <option value="10000000">Más de $5.000.000</option>
                                        <option value="0">A definir en reunión</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email corporativo"
                                    required
                                    className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-lg"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Teléfono de contacto"
                                    className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 text-lg"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="event_date"
                                    className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                                    title="Fecha estimada del evento (opcional)"
                                />
                                <label className="absolute -top-2 left-4 bg-white px-2 text-sm text-gray-600">
                                    Fecha estimada del evento (opcional)
                                </label>
                            </div>
                            <textarea
                                name="message"
                                rows={6}
                                placeholder="Describe tu proyecto: tipo de evento, objetivos, presupuesto estimado, fechas..."
                                className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 resize-none text-lg"
                            />
                            <div className="text-center">
                                <Button
                                    size="xl"
                                    className="w-fit pulse-glow"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? '📤 Enviando...' : '🚀 Enviar Solicitud de Cotización'}
                                </Button>
                            </div>
                            {status === 'ok' && (
                                <div className="text-center bg-green-50 border border-green-200 rounded-xl p-4">
                                    <div className="text-green-600 font-medium mb-2">
                                        ✅ ¡Solicitud enviada exitosamente!
                                    </div>
                                    <div className="text-green-700 text-sm">
                                        <p className="mb-1">📞 Te contactaremos en las próximas 2-4 horas hábiles</p>
                                        <p>📧 Revisa tu email para confirmación y detalles del seguimiento</p>
                                    </div>
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="text-center bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="text-red-600 font-medium mb-2">
                                        ❌ Error al enviar la solicitud
                                    </div>
                                    <div className="text-red-700 text-sm">
                                        <p className="mb-2">Por favor intenta nuevamente o contáctanos directamente:</p>
                                        <button
                                            onClick={handleWhatsAppClick}
                                            className="text-green-600 font-medium hover:underline cursor-pointer"
                                        >
                                            📱 WhatsApp: +56 9 9577 7796
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Confianza y seguridad */}
                        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Información segura
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Respuesta en 24hrs
                            </div>
                        </div>
                    </div>

                    {/* Info de contacto mejorada - ocupa menos espacio */}
                    <div className="xl:col-span-1 lg:col-span-2 animate-fade-up" style={{ animationDelay: '300ms' }}>
                        <div className="space-y-8">
                            {/* Contacto directo */}
                            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-1 shadow-xl">
                                <div className="bg-white rounded-[22px] p-8">
                                    <h3 className="font-title text-xl font-bold mb-6 text-gray-800">Contacto Directo</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">

                                            <Image
                                                src="/iconos/whatsapp.png"
                                                alt="WhatsApp - Contacta a DG Producciones para cotización de eventos BTL y servicios de marketing experiencial"
                                                width={48}
                                                height={48}
                                                onClick={handleWhatsAppClick}
                                                className="transform group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                                            />                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-1">WhatsApp Business</h4>
                                                <button
                                                    onClick={handleWhatsAppClick}
                                                    className="text-green-600 font-medium hover:underline cursor-pointer"
                                                >
                                                    +56 9 9577 7796
                                                </button>
                                                <p className="text-gray-600 text-sm">Atención directa vía WhatsApp</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <Image
                                                src="/iconos/instagram.png"
                                                alt="Instagram - Síguenos en redes sociales para ver nuestros últimos proyectos BTL"
                                                width={48}
                                                height={48}
                                                onClick={() => window.open('https://www.instagram.com/dg_producciones?igsh=Z3JudW00NXY2bWdv', '_blank')}
                                                className="transform group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-1">Instagram</h4>
                                                <button
                                                    onClick={() => window.open('https://www.instagram.com/dg_producciones?igsh=Z3JudW00NXY2bWdv', '_blank')}
                                                    className="text-purple-600 font-medium hover:underline cursor-pointer"
                                                >
                                                    @dg_producciones
                                                </button>
                                                <p className="text-gray-600 text-sm">Síguenos para ver nuestros proyectos</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-1">Email Corporativo</h4>
                                                <a href="mailto:daniel@dgproducciones.cl" className="text-amber-600 font-medium hover:underline">daniel@dgproducciones.cl</a>
                                                <p className="text-gray-600 text-sm">Cotizaciones y proyectos</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}