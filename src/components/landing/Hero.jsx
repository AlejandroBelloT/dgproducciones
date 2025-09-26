"use client";
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Overlay dinámico con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-transparent to-amber-50/30"></div>

            {/* Formas flotantes animadas */}
            <div className="absolute inset-0 floating-shapes"></div>

            {/* Patrón de puntos dinámico */}
            <div className="absolute inset-0 pattern-dots opacity-30"></div>

            {/* Efectos de luz mejorados */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-400/15 to-cyan-300/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-amber-400/15 to-orange-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <h1 className="font-title text-[44px] md:text-7xl font-bold mb-8 animate-bounce-in bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700 bg-clip-text text-transparent">
                    DG PRODUCCIONES
                </h1>

                <p className="text-xl md:text-2xl mb-4 text-gray-700 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                    <span className="font-semibold text-amber-600">Creamos experiencias BTL</span> que conectan marcas con audiencias
                </p>

                <p className="text-lg mb-12 text-gray-600 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.6s' }}>
                    Especialistas en producción de eventos, stands innovadores y material publicitario que impacta
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.9s' }}>
                    <Link href="#projects">
                        <Button size="xl">
                            🚀 Ver Nuestros Proyectos
                        </Button>
                    </Link>
                    <Link href="#contact">
                        <Button variant="outline" size="xl" className="hover-lift">
                            💬 Conversemos
                        </Button>
                    </Link>
                </div>

                {/* Badges llamativos */}
                <div className="mt-16 flex flex-wrap justify-center gap-4 animate-slide-in-left" style={{ animationDelay: '1.2s' }}>
                    <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-teal-200 pulse-glow">
                        <span className="text-teal-700 font-semibold">✨ +500 Eventos</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-amber-200">
                        <span className="text-amber-700 font-semibold">🏆 Experiencia BTL</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-cyan-200">
                        <span className="text-cyan-700 font-semibold">🎯 Resultados Medibles</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
