import { useState } from 'react'

const NAVIGATION_ITEMS = [
    {
        id: 'dashboard',
        label: '📊 Dashboard',
        icon: '📊'
    },
    {
        id: 'contacts',
        label: '📬 Contactos',
        icon: '📬',
        showBadge: true
    },
    {
        id: 'content',
        label: '🎨 Contenido',
        icon: '🎨'
    },
    {
        id: 'team',
        label: '👥 Equipo',
        icon: '👥'
    },
    {
        id: 'users',
        label: '👤 Usuarios',
        icon: '👤'
    }
]

export default function AdminNavigation({
    activeSection,
    onSectionChange,
    pendingContacts = 0
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSectionChange = (sectionId) => {
        onSectionChange(sectionId)
        setMobileMenuOpen(false)
    }

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Título */}
                    <div className="flex items-center">
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                            DG Producciones - Admin
                        </h1>
                    </div>

                    {/* Navegación Desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {NAVIGATION_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSectionChange(item.id)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${activeSection === item.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {item.label}
                                {item.showBadge && pendingContacts > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                        {pendingContacts}
                                    </span>
                                )}
                            </button>
                        ))}

                        <a
                            href="/"
                            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🌐 Ver Sitio Web
                        </a>
                    </div>

                    {/* Botón de menú móvil */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Abrir menú de navegación"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menú móvil */}
                {mobileMenuOpen && (
                    <div className="lg:hidden pb-3 pt-2 space-y-1 border-t border-gray-200">
                        {NAVIGATION_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSectionChange(item.id)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${activeSection === item.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span>{item.label}</span>
                                {item.showBadge && pendingContacts > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                        {pendingContacts}
                                    </span>
                                )}
                            </button>
                        ))}

                        <a
                            href="/"
                            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            🌐 Ver Sitio Web
                        </a>
                    </div>
                )}
            </div>
        </nav>
    )
}