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
            className={`group relative rounded-2xl border p-8 transition-all duration-300 hover:scale-102 shadow-lg hover:shadow-xl animate-fade-up bg-white/80 backdrop-blur-sm border-gray-200/60`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="relative z-10">
                <div className="w-16 h-16 mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl grid place-items-center shadow-sm transform group-hover:scale-105 transition-transform duration-300 border border-blue-200">
                    <div className="w-8 h-8 text-blue-800">{icon}</div>
                </div>

                <h3 className="font-title text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-800 transition-colors duration-300">
                    {title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-base">
                    {desc}
                </p>
            </div>
        </article>
    );
}

export default function Services() {
    return (
        <section id="services" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white"></div>

            <div className="absolute top-32 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-800/6 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-32 right-1/3 w-80 h-80 bg-gradient-to-br from-blue-600/6 to-transparent rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <header className="text-center mb-20 animate-fade-up">
                    <div className="inline-block bg-gradient-to-r from-blue-800/10 to-blue-600/10 rounded-full px-6 py-2 mb-6 backdrop-blur-sm border border-blue-200/30">
                        <span className="text-blue-800 font-medium">Nuestras Especialidades</span>
                    </div>
                    <h1 className="font-title text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-800 via-green-600 to-blue-800 bg-clip-text text-transparent">
                        Qué Hacemos
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Nos alejamos de lo convencional para crear experiencias que conectan marcas con personas de forma auténtica. Cada proyecto lo desarrollamos con un solo objetivo: que los asistentes lo recuerden y nuestros clientes nos recomienden.
                    </p>
                </header>

                <main className="grid md:grid-cols-3 gap-8 mb-20">
                    <ServiceCard
                        title="🔹 ACTIVACIONES BTL QUE DEJAN HUELLA"
                        desc="Nos alejamos de lo convencional para diseñar campañas vivenciales, disruptivas y efectivas. Tu marca no solo se verá: se sentirá."
                        color="blue"
                        delay={0}
                        icon={
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        }
                    />

                    <ServiceCard
                        title="🔹 TALENTO HUMANO QUE IMPULSA TU EVENTO"
                        desc="Modelos, promotores, anfitriones, staff logístico... Contamos con el recurso humano ideal, capacitado para representar tu marca con pasión y profesionalismo."
                        color="green"
                        delay={200}
                        icon={
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7H17c-.8 0-1.54.37-2.01.99L14 9l2 2v10h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9.5l-2.54-7.63A1.5 1.5 0 0 0 5.5 6H4c-.8 0-1.54.37-2.01.99L1 8l2 2v10h4.5z" />
                            </svg>
                        }
                    />

                    <ServiceCard
                        title="🔹 STANDS CON IDENTIDAD"
                        desc="Diseñamos y construimos stands impactantes, funcionales y hechos a la medida de tu concepto. Desde la primera idea hasta el último tornillo, lo hacemos todo in-house."
                        color="orange"
                        delay={400}
                        icon={
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                        }
                    />
                </main>

                <div className="text-center animate-fade-up" style={{ animationDelay: '1000ms' }}>
                    <div className="relative inline-block">
                        <div className="bg-white rounded-2xl px-12 py-8 text-center shadow-lg border border-gray-200/50">
                            <div className="mb-6">
                                <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
                                    <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                                    <span className="text-blue-800 font-medium text-sm">Consulta Gratuita</span>
                                </div>
                                <h3 className="font-title text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                                    ¿Tienes una idea en mente?
                                </h3>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Llevemos tu concepto desde un bosquejo en papel hasta la realidad. Crear experiencias memorables es nuestra pasión.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Button variant="primary" size="lg" className="group">
                                    <span className="flex items-center space-x-2">
                                        <span>Solicitar Cotización</span>
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </Button>

                                <Button variant="outline" size="lg" className="group">
                                    <span className="flex items-center space-x-2">
                                        <span>Conversemos</span>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}