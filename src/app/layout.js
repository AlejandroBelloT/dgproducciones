import { Rajdhani, Inter, Audiowide } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/seo/StructuredData";

const rajdhani = Rajdhani({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const audiowide = Audiowide({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  // URL base para resolver rutas relativas en Open Graph y Twitter
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://dgproducciones.cl'),

  // Meta título optimizado con palabras clave principales
  title: {
    default: "DG Producciones | Eventos BTL, Recursos Humanos y Transporte en Chile",
    template: "%s | DG Producciones"
  },

  // Meta descripción optimizada con llamada a la acción
  description: "Especialistas en producción de eventos BTL, gestión de recursos humanos y logística de transporte. Creamos experiencias memorables que impulsan tu marca. ¡Cotiza gratis!",

  // Configuración de iconos/favicons
  icons: {
    icon: [
      { url: '/images/logo/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo/logo.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/images/logo/logo.png',
    apple: [
      { url: '/images/logo/logo.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/images/logo/logo.png',
      }
    ]
  },

  // Palabras clave estratégicas con enfoque semántico
  keywords: [
    // Palabras clave principales
    "eventos BTL Chile", "producción de eventos", "marketing experiencial",
    "recursos humanos Chile", "gestión de RRHH", "personal especializado",
    "transporte logístico", "movilización de equipos", "logística eventos",

    // Long-tail keywords
    "producción eventos corporativos Chile", "activaciones de marca Santiago",
    "reclutamiento personal eventos", "coordinación equipos trabajo",
    "transporte materiales eventos", "logística integral BTL",

    // Términos relacionados
    "stands ferias", "material publicitario", "POP promocional",
    "lanzamientos productos", "conferencias empresariales",
    "DG Producciones", "eventos profesionales Chile"
  ].join(", "),

  // Información del autor y organización (E-E-A-T)
  authors: [{
    name: "DG Producciones",
    url: "https://dgproducciones.cl"
  }],

  creator: "DG Producciones",
  publisher: "DG Producciones",

  // Meta robots optimizado
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph para redes sociales
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://dgproducciones.cl",
    title: "DG Producciones | Eventos BTL, RRHH y Transporte en Chile",
    description: "Especialistas en producción de eventos BTL, gestión de recursos humanos y logística de transporte. Experiencias memorables que impulsan tu marca.",
    siteName: "DG Producciones",
    images: [{
      url: "/images/logo/logo.png",
      width: 1200,
      height: 630,
      alt: "DG Producciones - Eventos BTL, Recursos Humanos y Transporte",
    }],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "DG Producciones | Eventos BTL, RRHH y Transporte",
    description: "Especialistas en eventos BTL, recursos humanos y transporte logístico. ¡Cotización gratuita!",
    images: ["/images/logo/logo.png"],
  },

  // Información de contacto y ubicación
  alternates: {
    canonical: "https://dgproducciones.cl",
  },

  // Verificación y otros metadatos técnicos
  verification: {
    // google: "código-verificación-google",
    // otros verificadores se pueden agregar aquí
  },

  // Categorización del contenido
  category: "Business Services",

  // Información adicional para IA
  other: {
    "business:contact_data:email": "daniel@dgproducciones.cl",
    "business:contact_data:phone_number": "+56995777796",
    "business:contact_data:country_name": "Chile",
    "business:contact_data:locality": "Santiago",
    "geo.region": "CL",
    "geo.placename": "Chile",
    "DC.language": "es-CL",
    "DC.subject": "Eventos BTL, Recursos Humanos, Transporte Logístico",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <StructuredData />
        {/* Favicon y iconos */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo/logo.png" />
        <link rel="apple-touch-icon-precomposed" href="/images/logo/logo.png" />

        {/* PWA y mobile */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f766e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DG Producciones" />

        {/* MS Tiles */}
        <meta name="msapplication-TileColor" content="#0f766e" />
        <meta name="msapplication-TileImage" content="/images/logo/logo.png" />
      </head>
      <body
        className={`${rajdhani.variable} ${audiowide.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
