'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatusBadge, ContactActions } from './AdminComponents'
import Button from '@/components/ui/Button'

export default function ContactManagement() {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contacts')
            const data = await response.json()
            setContacts(data || [])
        } catch (error) {
            console.error('Error fetching contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateContactStatus = async (id, status) => {
        try {
            const response = await fetch('/api/contacts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            })

            if (response.ok) {
                setContacts(contacts.map(contact =>
                    contact.id === id ? { ...contact, status } : contact
                ))
            }
        } catch (error) {
            console.error('Error updating contact status:', error)
        }
    }

    const deleteContact = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este contacto?')) return

        try {
            const response = await fetch('/api/contacts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })

            if (response.ok) {
                setContacts(contacts.filter(contact => contact.id !== id))
            }
        } catch (error) {
            console.error('Error deleting contact:', error)
        }
    }

    const filteredContacts = contacts.filter(contact => {
        if (filter === 'all') return true
        return contact.status === filter
    })

    const getStatusCount = (status) => {
        return contacts.filter(c => c.status === status).length
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg">Cargando contactos...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Estadísticas - Responsivo */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-lg sm:text-2xl font-bold text-gray-800">{contacts.length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Total</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-lg sm:text-2xl font-bold text-yellow-600">{getStatusCount('nuevo')}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Nuevos</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-lg sm:text-2xl font-bold text-blue-600">{getStatusCount('contactado')}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Contactados</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 text-center">
                        <div className="text-lg sm:text-2xl font-bold text-green-600">{getStatusCount('seguimiento')}</div>
                        <div className="text-xs sm:text-sm text-gray-600">En Seguimiento</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros - Responsivo */}
            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">📋 Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        <Button
                            variant={filter === 'all' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">Todos </span>
                            <span className="sm:hidden">Todo </span>
                            ({contacts.length})
                        </Button>
                        <Button
                            variant={filter === 'nuevo' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('nuevo')}
                            className="text-xs sm:text-sm"
                        >
                            Nuevos ({getStatusCount('nuevo')})
                        </Button>
                        <Button
                            variant={filter === 'contactado' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('contactado')}
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">Contactados</span>
                            <span className="sm:hidden">Contact.</span>
                            ({getStatusCount('contactado')})
                        </Button>
                        <Button
                            variant={filter === 'seguimiento' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('seguimiento')}
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">En Seguimiento</span>
                            <span className="sm:hidden">Seguim.</span>
                            ({getStatusCount('seguimiento')})
                        </Button>
                        <Button
                            variant={filter === 'cerrado' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('cerrado')}
                            className="text-xs sm:text-sm col-span-2 sm:col-span-1"
                        >
                            Cerrados ({getStatusCount('cerrado')})
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de contactos - Responsivo */}
            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">
                        📬 Solicitudes de Contacto ({filteredContacts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                        {filteredContacts.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <div className="text-4xl sm:text-6xl mb-4 opacity-50">📭</div>
                                <p className="text-gray-500 text-sm sm:text-base">
                                    {filter === 'all' ? 'No hay contactos registrados' : `No hay contactos en estado: ${filter}`}
                                </p>
                            </div>
                        ) : (
                            filteredContacts.map((contact) => (
                                <div key={contact.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                                <h3 className="font-semibold text-base sm:text-lg truncate">{contact.name}</h3>
                                                <StatusBadge
                                                    status={contact.status || 'pending'}
                                                    onChange={updateContactStatus}
                                                    id={contact.id}
                                                />
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-1 truncate">
                                                    <span>📧</span>
                                                    <span className="truncate">{contact.email}</span>
                                                </div>
                                                {contact.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <span>📞</span>
                                                        <span>{contact.phone}</span>
                                                    </div>
                                                )}
                                                {contact.company && (
                                                    <div className="flex items-center gap-1 truncate">
                                                        <span>🏢</span>
                                                        <span className="truncate">{contact.company}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <span>📅</span>
                                                    <span className="text-xs">
                                                        {new Date(contact.createdAt || contact.timestamp).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteContact(contact.id)}
                                            className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                            title="Eliminar contacto"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    {contact.message && (
                                        <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                                            <h4 className="font-medium text-xs sm:text-sm text-gray-700 mb-1">💬 Mensaje:</h4>
                                            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{contact.message}</p>
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-gray-100">
                                        <ContactActions
                                            email={contact.email}
                                            phone={contact.phone}
                                            name={contact.name}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}