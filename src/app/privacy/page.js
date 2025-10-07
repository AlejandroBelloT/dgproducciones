import React from "react";

export const metadata = {
    title: "Política de Privacidad - DG Producciones",
    description: "Lee nuestra política de privacidad y conoce cómo protegemos tus datos en DG Producciones.",
    robots: "noindex, nofollow"
};

export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
            <p className="mb-4">En DG Producciones valoramos y protegemos la privacidad de nuestros usuarios. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2">1. Información que recopilamos</h2>
            <ul className="list-disc pl-6 mb-4">
                <li>Datos de contacto proporcionados en formularios (nombre, correo, teléfono).</li>
                <li>Información técnica (IP, navegador, dispositivo).</li>
                <li>Datos de navegación y uso del sitio.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-8 mb-2">2. Uso de la información</h2>
            <ul className="list-disc pl-6 mb-4">
                <li>Responder consultas y solicitudes.</li>
                <li>Mejorar la experiencia y funcionalidad del sitio.</li>
                <li>Enviar información relevante sobre nuestros servicios.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-8 mb-2">3. Protección de datos</h2>
            <p className="mb-4">Implementamos medidas de seguridad para proteger tu información personal y evitar accesos no autorizados.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2">4. Derechos del usuario</h2>
            <p className="mb-4">Puedes solicitar la modificación o eliminación de tus datos escribiendo a <a href="mailto:daniel@dgproducciones.cl" className="text-blue-600 underline">daniel@dgproducciones.cl</a>.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2">5. Cambios en la política</h2>
            <p className="mb-4">Nos reservamos el derecho de actualizar esta política. Los cambios serán publicados en esta página.</p>
            <p className="mt-8 text-sm text-gray-500">Última actualización: septiembre 2025</p>
        </main>
    );
}
