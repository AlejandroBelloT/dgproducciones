export default function Testimonials() {
    const items = [
        {
            quote: 'DG Producciones transformó nuestra activación en una experiencia inolvidable. Equipo comprometido y resultados impecables.',
            author: 'Gerente de Marca, Empresa Retail',
        },
        {
            quote: 'Excelente gestión y diseño de stand. Cumplieron plazos y superaron expectativas en cada detalle.',
            author: 'Marketing Manager, Industria Tecnología',
        },
        {
            quote: 'Profesionales, creativos y muy flexibles. Nuestros eventos han subido de nivel desde que trabajamos con ellos.',
            author: 'Directora de Comunicaciones, Bebidas',
        },
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-purple-50/20 to-white/30"></div>
            
            {/* Efectos de fondo */}
            <div className="absolute inset-0 pattern-dots opacity-10"></div>
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <h2 className="font-title text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">
                    Lo que dicen nuestros clientes
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {items.map((t, i) => (
                        <figure key={i} className="rounded-2xl border border-neutral-200 p-6 bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow animate-fade-up hover-lift">
                            <div className="text-amber-400 text-2xl mb-3">★ ★ ★ ★ ★</div>
                            <blockquote className="text-gray-700 leading-relaxed mb-4">"{t.quote}"</blockquote>
                            <figcaption className="text-sm text-gray-500 font-medium">— {t.author}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}