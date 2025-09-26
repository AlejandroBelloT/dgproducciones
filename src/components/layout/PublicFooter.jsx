import Image from 'next/image';

export default function PublicFooter() {
    return (
        <footer className="mt-16 border-t border-neutral-200 bg-[#225669]/40">
            <div className="max-w-6xl mx-auto px-4 py-10 grid gap-6 sm:grid-cols-3 items-center">
                <div className="flex items-center gap-3">
                    <Image src="/images/logo/logo.svg" alt="DG Producciones" width={158} height={40} />
                    <div>
                        <div className="font-title text-lg">DG Producciones</div>
                        <div className="text-sm text-neutral-500">Pasión por lo que hacemos</div>
                    </div>
                </div>
                <div className="text-sm">
                    <div><b>Email:</b> contacto@dgproducciones.cl</div>
                    <div><b>Teléfono:</b> +56 9 1234 5678</div>
                </div>
                <div className="flex gap-3 justify-start sm:justify-end">
                    <a href="#" className="hover:text-accent" aria-label="Instagram">Instagram</a>
                    <a href="#" className="hover:text-accent" aria-label="LinkedIn">LinkedIn</a>
                    <a href="#" className="hover:text-accent" aria-label="Facebook">Facebook</a>
                </div>
            </div>
            <div className="text-center text-xs text-neutral-500 pb-6">© {new Date().getFullYear()} DG Producciones. Todos los derechos reservados.</div>
        </footer>
    );
}
