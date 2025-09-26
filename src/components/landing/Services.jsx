import Button from '@/components/ui/Button';

function ServiceCard({ title, desc, icon, color = "teal", delay = 0 }) {
    const colorClasses = {
        teal: "border-teal-300/60 bg-gradient-to-br from-white via-teal-50/40 to-teal-100/30 hover:from-teal-50/60 hover:to-teal-100/50 text-teal-700 shadow-teal-100/60",
        blue: "border-blue-300/60 bg-gradient-to-br from-white via-blue-50/40 to-blue-100/30 hover:from-blue-50/60 hover:to-blue-100/50 text-blue-700 shadow-blue-100/60",
        green: "border-green-300/60 bg-gradient-to-br from-white via-green-50/40 to-green-100/30 hover:from-green-50/60 hover:to-green-100/50 text-green-700 shadow-green-100/60",
        orange: "border-orange-300/60 bg-gradient-to-br from-white via-orange-50/40 to-orange-100/30 hover:from-orange-50/60 hover:to-orange-100/50 text-orange-700 shadow-orange-100/60",
    };

    return (
        <article
            className={`group relative rounded-3xl border-2 p-8 transition-all duration-700 hover:scale-105 shadow-xl hover:shadow-2xl animate-bounce-in backdrop-blur-sm ${colorClasses[color]}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-white/40 rounded-3xl backdrop-blur-sm"></div>

            <div className="relative z-10">
                <div className="w-20 h-20 mb-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl grid place-items-center shadow-lg transform group-hover:rotate-6 transition-transform duration-500 border border-gray-200/50">
                    <div className="w-12 h-12 text-current">{icon}</div>
                </div>

                <h3 className="font-title text-2xl font-bold mb-4 text-gray-800 group-hover:text-current transition-colors duration-300">
                    {title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 text-base">
                    {desc}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-b-3xl"></div>
            </div>
        </article>
    );
}

export default function Services() {
    return (
        <section id="services" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-gray-50/40 to-white/60"></div>
            <div className="absolute inset-0 pattern-grid opacity-10"></div>

            <div className="absolute -top-32 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/15 via-blue-300/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-32 right-1/3 w-80 h-80 bg-gradient-to-br from-orange-400/15 via-orange-300/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-400/10 via-green-300/8 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <header className="text-center mb-20 animate-fade-up">
                    <div className="inline-block bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-full px-6 py-2 mb-6 backdrop-blur-sm border border-blue-200/30">
                        <span className="text-blue-800 font-medium">Servicios Especializados</span>
                    </div>
                    <h2 className="font-title text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-800 via-blue-700 to-gray-800 bg-clip-text text-transparent">
                        Nuestros Servicios
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Ofrecemos soluciones integrales en producción de eventos, gestión de recursos humanos y logística de transporte. Cada servicio está diseñado para crear experiencias memorables y resultados excepcionales.
                    </p>
                </header>

                <main className="grid md:grid-cols-3 gap-8 mb-20">
                    <ServiceCard
                        title="PRODUCCIÓN DE EVENTOS"
                        desc="Creamos experiencias inolvidables que conectan tu marca con tu audiencia. Desde la conceptualización hasta la ejecución, cada detalle está cuidadosamente planificado para generar impacto y resultados medibles."
                        color="blue"
                        delay={0}
                        icon={
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3zM5 6v12h14V6H5zm2-2V3h6v1H7zm2 6h2v2H9v-2zm0 4h2v2H9v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                            </svg>
                        }
                    />

                    <ServiceCard
                        title="RECURSOS HUMANOS"
                        desc="Gestionamos el talento humano que da vida a tus proyectos. Reclutamiento, selección y coordinación de personal especializado que garantiza la excelencia en cada activación."
                        color="green"
                        delay={200}
                        icon={
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M12 2a5 5 0 0 1 5 5c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm9 11a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h18zm-1 2H4v1h16v-1zm-2 3H6v1h12v-1zm-6-9c3.31 0 6 2.69 6 6H6c0-3.31 2.69-6 6-6z" />
                            </svg>
                        }
                    />

                    <ServiceCard
                        title="TRANSPORTE Y LOGÍSTICA"
                        desc="Soluciones logísticas integrales que aseguran la movilidad eficiente de equipos, materiales y personal. Coordinación precisa para que cada elemento llegue en tiempo y forma."
                        color="orange"
                        delay={400}
                        icon={
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-5.99zM6.5 7h11l1.33 4H5.17L6.5 7zM19 16H5v-3h14v3zm-1.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                            </svg>
                        }
                    />
                </main>

                <div className="text-center animate-fade-up" style={{ animationDelay: '1000ms' }}>
                    <div className="relative inline-block">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl opacity-20 blur-lg animate-pulse-slow"></div>

                        <div className="relative bg-gradient-to-r from-white via-gray-50 to-white p-1 rounded-3xl shadow-2xl border border-gray-200/50 backdrop-blur-sm">
                            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl px-12 py-8 text-center">
                                <div className="mb-6">
                                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full px-4 py-2 mb-4">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                        <span className="text-blue-800 font-medium text-sm">Consulta Gratuita</span>
                                    </div>
                                    <h3 className="font-title text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                                        ¿Listo para crear tu próximo proyecto?
                                    </h3>
                                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                        Nuestro equipo está preparado para convertir tu visión en una experiencia extraordinaria
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <Button variant="warm" size="lg" className="shimmer group">
                                        <span className="flex items-center space-x-2">
                                            <span>Solicitar Cotización</span>
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </Button>

                                    <Button variant="outline" size="lg" className="group border-blue-200 text-blue-700 hover:bg-blue-50">
                                        <span className="flex items-center space-x-2">
                                            <span>Conversemos</span>
                                            <svg className="w-4 h-4 transform group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}