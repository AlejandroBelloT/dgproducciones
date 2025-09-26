"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PublicHeader() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const sections = ['services', 'projects', 'contact'];
        const els = sections.map((id) => document.getElementById(id)).filter(Boolean);
        const obs = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: '-50% 0px -45% 0px', threshold: [0.1, 0.5, 1] }
        );
        els.forEach((el) => obs.observe(el));
        const onScroll = () => setScrolled(window.scrollY > 2);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            obs.disconnect();
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <header className={`sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200 ${scrolled ? 'shadow-sm' : ''}`}>
            <div className="max-w-6xl mx-auto px-4 h-22 flex items-center justify-between">
                <Link href="#" className="flex items-center gap-3">
                    <Image src="/images/logo/logo.svg" alt="DG Producciones" width={158} height={158} className="drop-shadow-sm" />
                    {/* <span className="font-title text-xl font-semibold">DG Producciones</span> */}
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#services" className={`hover:text-accent ${active === 'services' ? 'text-accent font-medium underline underline-offset-8' : ''}`}>Servicios</a>
                    <a href="#projects" className={`hover:text-accent ${active === 'projects' ? 'text-accent font-medium underline underline-offset-8' : ''}`}>Proyectos</a>
                    <a href="#contact" className={`hover:text-accent ${active === 'contact' ? 'text-accent font-medium underline underline-offset-8' : ''}`}>Contacto</a>
                </nav>
                <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menú">
                    <span className="i tabler-menu-2" />
                    <div className="w-6 h-0.5 bg-current mb-1" />
                    <div className="w-6 h-0.5 bg-current mb-1" />
                    <div className="w-6 h-0.5 bg-current" />
                </button>
            </div>
            {open && (
                <div className="md:hidden border-t border-neutral-200">
                    <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
                        <a href="#services" className="py-2" onClick={() => setOpen(false)}>Servicios</a>
                        <a href="#projects" className="py-2" onClick={() => setOpen(false)}>Proyectos</a>
                        <a href="#contact" className="py-2" onClick={() => setOpen(false)}>Contacto</a>
                    </div>
                </div>
            )}
        </header>
    );
}
