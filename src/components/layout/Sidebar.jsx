"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
    { href: '/admin', label: 'Resumen' },
    { href: '/admin/contacts', label: 'Contactos' },
    { href: '/admin/content', label: 'Contenido' },
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="w-56 shrink-0 h-full border-r border-neutral-200 p-3">
            <div className="font-bold mb-4">DG Admin</div>
            <nav className="space-y-1">
                {items.map((it) => {
                    const active = pathname === it.href || pathname?.startsWith(it.href + '/');
                    return (
                        <Link
                            key={it.href}
                            href={it.href}
                            className={`block rounded px-2 py-2 hover:bg-neutral-100 ${active ? 'bg-neutral-100 font-medium' : ''}`}
                        >
                            {it.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
