export default function FAQ() {
    const faqs = [
        {
            question: "¿Qué incluye el servicio de producción de eventos BTL?",
            answer: "Nuestro servicio de producción de eventos BTL incluye conceptualización estratégica, diseño y planificación, coordinación integral, montaje y desmontaje, gestión de permisos, personal especializado, y seguimiento post-evento. Nos encargamos de todos los aspectos técnicos y creativos para garantizar el éxito de tu activación de marca."
        },
        {
            question: "¿Cómo seleccionan y capacitan al personal para eventos?",
            answer: "Contamos con un riguroso proceso de reclutamiento que incluye entrevistas especializadas, verificación de antecedentes y evaluación de habilidades. Todo nuestro personal recibe capacitación específica en protocolos de marca, atención al cliente, y procedimientos de seguridad antes de participar en cualquier evento."
        },
        {
            question: "¿Qué tipo de logística y transporte manejan?",
            answer: "Manejamos logística integral que incluye transporte de equipos, materiales, estructuras y personal. Contamos con flota propia y aliados estratégicos para garantizar movilización segura y puntual. Ofrecemos desde transporte local hasta distribución nacional, adaptándonos a las necesidades específicas de cada proyecto."
        },
        {
            question: "¿Cuál es el tiempo mínimo para planificar un evento BTL?",
            answer: "Recomendamos un mínimo de 4-6 semanas para eventos medianos y 8-12 semanas para proyectos complejos. Sin embargo, también manejamos activaciones de emergencia con 48-72 horas de anticipación, dependiendo de la complejidad y disponibilidad de recursos."
        },
        {
            question: "¿Trabajan con empresas de todos los tamaños?",
            answer: "Sí, trabajamos con empresas de todos los tamaños, desde startups hasta grandes corporaciones. Adaptamos nuestras soluciones y propuestas a diferentes presupuestos y escalas, manteniendo siempre altos estándares de calidad y profesionalismo."
        },
        {
            question: "¿Qué diferencia a DG Producciones de otras empresas de eventos?",
            answer: "Nuestra ventaja competitiva radica en la integración de tres servicios esenciales: producción de eventos, recursos humanos y logística. Esta sinergia nos permite ofrecer soluciones completas, mayor control de calidad, optimización de costos y coordinación más eficiente en cada proyecto."
        },
        {
            question: "¿Cómo miden el éxito de un evento BTL?",
            answer: "Utilizamos métricas específicas como alcance de audiencia, engagement generado, leads capturados, impacto en redes sociales, satisfacción de participantes y retorno de inversión. Proporcionamos reportes detallados post-evento con análisis de resultados y recomendaciones para futuras activaciones."
        },
        {
            question: "¿Ofrecen servicios fuera de Santiago?",
            answer: "Sí, ofrecemos servicios a nivel nacional en Chile. Contamos con una red de colaboradores en regiones y la logística necesaria para ejecutar proyectos en cualquier ciudad del país, manteniendo nuestros estándares de calidad sin importar la ubicación."
        }
    ];

    return (
        <section id="faq" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <header className="text-center mb-16">
                    <h2 className="font-title text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Preguntas Frecuentes
                    </h2>
                    <p className="text-lg text-gray-600">
                        Respuestas a las consultas más comunes sobre nuestros servicios de eventos BTL, recursos humanos y logística
                    </p>
                </header>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 group hover:shadow-md transition-shadow duration-300"
                        >
                            <summary className="cursor-pointer font-semibold text-gray-900 text-lg mb-3 list-none flex items-center justify-between">
                                <span>{faq.question}</span>
                                <svg
                                    className="w-6 h-6 text-blue-600 transform group-open:rotate-45 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </summary>
                            <div className="text-gray-600 leading-relaxed text-base">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-6">
                        ¿No encontraste la respuesta que buscabas?
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                        Contáctanos directamente
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}