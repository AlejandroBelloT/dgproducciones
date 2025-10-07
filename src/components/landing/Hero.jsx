"use client";
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30"></div>

            {/* Efectos de luz sutiles */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-300/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-gray-400/10 to-blue-300/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <h1 className="font-title text-[44px] md:text-7xl font-bold mb-8 animate-bounce-in bg-gradient-to-r from-blue-800 via-green-600 to-blue-800 bg-clip-text text-transparent">
                    DG PRODUCCIONES prueba
                </h1>

                <p className="text-xl md:text-2xl mb-4 text-gray-700 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                    <span className="font-semibold text-blue-600">Creamos experiencias únicas, memorables e impactantes</span> 
                </p>

                <p className="text-lg mb-12 text-gray-600 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.6s' }}>
                    Activaciones BTL que dejan huella, talento humano especializado y stands con identidad propia
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.9s' }}>
                    <Link href="#projects">
                        <Button variant="primary" size="xl">
                            🎯 Ver Nuestros Proyectos
                        </Button>
                    </Link>
                    <Link href="#contact">
                        <Button variant="outline" size="xl" className="hover-lift">
                            💬 Conversemos tu Idea
                        </Button>
                    </Link>
                </div>

                {/* Badges limpios */}
                <div className="mt-16 flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: '1.2s' }}>
                    <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-sm border border-blue-200">
                        <span className="text-blue-800 font-medium">🏆 Experiencias BTL</span>
                    </div>
                    <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-sm border border-gray-200">
                        <span className="text-gray-700 font-medium">✨ Grandes Marcas</span>
                    </div>
                    <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-sm border border-blue-200">
                        <span className="text-blue-800 font-medium">🚀 Ideas a Realidad</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
