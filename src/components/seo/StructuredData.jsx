'use client'

export default function StructuredData() {
    // Schema.org para Organización
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "DG Producciones",
        "alternateName": ["DG Producciones Chile", "DG Eventos"],
        "url": "https://dgproducciones.cl",
        "logo": "https://dgproducciones.cl/images/logo/logo.png",
        "image": "https://dgproducciones.cl/images/logo/logo.png",
        "description": "Especialistas en producción de eventos BTL, gestión de recursos humanos y logística de transporte. Creamos experiencias memorables que impulsan tu marca.",
        "foundingDate": "2020",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+56995777796",
            "contactType": "customer service",
            "email": "daniel@dgproducciones.cl",
            "areaServed": "CL",
            "availableLanguage": "Spanish"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "CL",
            "addressRegion": "Región Metropolitana",
            "addressLocality": "Santiago"
        },
        "sameAs": [
            // Agregar redes sociales cuando estén disponibles
            "https://www.instagram.com/dgproducciones",
            "https://www.linkedin.com/company/dgproducciones"
        ]
    };

    // Schema.org para Servicios
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Event Production Services",
        "provider": {
            "@type": "Organization",
            "name": "DG Producciones"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicios DG Producciones",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Producción de Eventos BTL",
                        "description": "Creamos experiencias inolvidables que conectan marcas con audiencias. Desde conceptualización hasta ejecución."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Gestión de Recursos Humanos",
                        "description": "Personal especializado, capacitado y comprometido para garantizar la excelencia en cada activación y evento."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Transporte y Logística",
                        "description": "Soluciones logísticas integrales que aseguran la movilidad eficiente de equipos, materiales y personal."
                    }
                }
            ]
        }
    };

    // Schema.org para FAQ
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "¿Qué servicios ofrece DG Producciones?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DG Producciones se especializa en tres áreas principales: Producción de Eventos BTL (activaciones de marca, lanzamientos, conferencias), Gestión de Recursos Humanos (reclutamiento especializado, coordinación de equipos) y Transporte y Logística (movilización de equipos y materiales, coordinación de flota vehicular)."
                }
            },
            {
                "@type": "Question",
                "name": "¿En qué ciudades de Chile operan?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DG Producciones opera principalmente en Santiago y la Región Metropolitana, con capacidad de expansión a otras regiones de Chile según las necesidades del proyecto."
                }
            },
            {
                "@type": "Question",
                "name": "¿Cómo puedo solicitar una cotización?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Puedes solicitar una cotización gratuita a través de nuestro formulario web, por WhatsApp al +56 9 9577 7796 o por email a daniel@dgproducciones.cl. Respondemos en menos de 24 horas."
                }
            },
            {
                "@type": "Question",
                "name": "¿Qué incluye el servicio de producción de eventos BTL?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Nuestro servicio incluye planificación estratégica, diseño conceptual, coordinación logística, montaje y desmontaje, personal especializado, materiales promocionales y seguimiento post-evento."
                }
            }
        ]
    };

    // Schema.org para Local Business
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "DG Producciones",
        "image": "https://dgproducciones.cl/images/logo/logo.png",
        "telephone": "+56995777796",
        "email": "daniel@dgproducciones.cl",
        "url": "https://dgproducciones.cl",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "CL",
            "addressRegion": "Región Metropolitana",
            "addressLocality": "Santiago"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-33.4489",
            "longitude": "-70.6693"
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
            ],
            "opens": "09:00",
            "closes": "18:00"
        },
        "priceRange": "$$",
        "currenciesAccepted": "CLP"
    };

    return (
        <>
            {/* Schema de Organización */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema)
                }}
            />

            {/* Schema de Servicios */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(serviceSchema)
                }}
            />

            {/* Schema de FAQ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema)
                }}
            />

            {/* Schema de Local Business */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(localBusinessSchema)
                }}
            />
        </>
    );
}