import Image from 'next/image';

export default function PublicFooter() {
    return (
        <footer className="mt-16 border-t border-neutral-200 bg-gradient-to-br from-blue-50/30 via-white/60 to-green-50/30">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Contenido principal del footer */}
                <div className="grid gap-8 md:grid-cols-4 items-start">
                    {/* Logo y descripción */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <Image src="/images/logo/logo.svg" alt="DG Producciones" width={120} height={32} />
                            <div>
                                <div className="font-title text-lg font-bold text-gray-800">DG Producciones</div>
                                <div className="text-sm text-blue-700 font-medium">Experiencias BTL que dejan huella</div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                            Creamos experiencias únicas, memorables y emocionalmente impactantes que conectan marcas con personas de forma auténtica. Activaciones BTL, talento humano especializado y stands con identidad propia.
                        </p>
                    </div>

                    {/* Información de contacto */}
                    <div>
                        <h3 className="font-title text-lg font-bold text-gray-800 mb-4">Contacto</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <a href="mailto:daniel@dgproducciones.cl" className="hover:text-blue-600 transition-colors">
                                    daniel@dgproducciones.cl
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <a href="https://wa.me/56995777796" className="hover:text-green-600 transition-colors">
                                    +56 9 9577 7796
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <a href="https://www.instagram.com/dg_producciones?igsh=Z3JudW00NXY2bWdv" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
                                    @dg_producciones
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Enlaces útiles */}
                    <div>
                        <h3 className="font-title text-lg font-bold text-gray-800 mb-4">Información</h3>
                        <div className="space-y-2 text-sm">
                            <a href="#services" className="block text-gray-600 hover:text-blue-600 transition-colors">
                                Nuestros Servicios
                            </a>
                            <a href="#projects" className="block text-gray-600 hover:text-blue-600 transition-colors">
                                Proyectos
                            </a>
                            <a href="#contact" className="block text-gray-600 hover:text-blue-600 transition-colors">
                                Contacto
                            </a>
                            <a href="/privacy" className="block text-gray-600 hover:text-blue-600 transition-colors">
                                Política de Privacidad
                            </a>
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-gray-200 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xs text-gray-500">
                            © {new Date().getFullYear()} DG Producciones. Todos los derechos reservados.
                        </div>
                        <div className="text-xs text-gray-500">
                            Diseñado para crear experiencias que dejan huella
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
