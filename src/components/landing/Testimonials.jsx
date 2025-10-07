export default function Testimonials() {
    const items = [
        {
            quote: 'DG Producciones llevó nuestra idea desde un bosquejo en papel hasta una activación BTL que superó todas nuestras expectativas. Profesionalismo excepcional.',
            author: 'Gerente de Marketing, Multinacional Retail',
        },
        {
            quote: 'Su equipo humano es increíble. Modelos, promotores y staff perfectamente capacitados que representaron nuestra marca con pasión y profesionalismo.',
            author: 'Director de Marca, Empresa Tecnológica',
        },
        {
            quote: 'Stands impactantes y funcionales hechos a la medida. Desde la primera idea hasta el último tornillo, todo in-house. Resultados que dejan huella.',
            author: 'Marketing Manager, Sector Automotriz',
        },
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/10 to-white"></div>

            {/* Efectos de fondo sutiles */}
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-200/8 to-gray-200/8 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <h2 className="font-title text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-700 via-green-600 to-blue-700 bg-clip-text text-transparent">
                    Grandes marcas confían en nosotros
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {items.map((t, i) => (
                        <figure key={i} className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow animate-fade-up">
                            <div className="text-blue-800 text-xl mb-3">★ ★ ★ ★ ★</div>
                            <blockquote className="text-gray-700 leading-relaxed mb-4">"{t.quote}"</blockquote>
                            <figcaption className="text-sm text-gray-600 font-medium">— {t.author}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}