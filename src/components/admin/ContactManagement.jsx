'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge, ContactActions } from './AdminComponents';
import Button from '@/components/ui/Button';
import ContactHistory from './contacts/ContactHistory';
import { useAuth } from '@/contexts/AuthContext';

export default function ContactManagement() {
    const { token } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const getAuthHeaders = () => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/contacts/', {
                headers: getAuthHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                setContacts(Array.isArray(data) ? data : []);
            } else {
                console.error('Error fetching contacts:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
        setLoading(false);
    };

    const deleteContact = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
            try {
                const response = await fetch('/api/contacts/', {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ id }),
                });
                if (response.ok) {
                    fetchContacts();
                } else {
                    alert('Error al eliminar el contacto');
                }
            } catch (error) {
                console.error('Error deleting contact:', error);
                alert('Error al eliminar el contacto');
            }
        }
    };

    const updateContactStatus = async (id, newStatus) => {
        try {
            const response = await fetch('/api/contacts/', {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (response.ok) {
                fetchContacts();
            } else {
                alert('Error al actualizar el estado del contacto');
            }
        } catch (error) {
            console.error('Error updating contact status:', error);
            alert('Error al actualizar el estado del contacto');
        }
    };

    const openHistory = (contactId) => {
        setSelectedContactId(contactId);
        setShowHistory(true);
    };

    const closeHistory = () => {
        setShowHistory(false);
        setSelectedContactId(null);
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesFilter = filter === 'all' || contact.status === filter;
        const matchesSearch = searchTerm === '' ||
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusCount = (status) => {
        return contacts.filter(contact => contact.status === status).length;
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Contactos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-500">Cargando contactos...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <CardTitle className="text-lg sm:text-xl">Gestión de Contactos</CardTitle>
                        <Button
                            onClick={fetchContacts}
                            className="text-xs sm:text-sm px-3 py-1.5 h-auto self-start sm:self-auto"
                        >
                            Actualizar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex flex-wrap gap-2">
                            {['all', 'nuevo', 'contactado', 'seguimiento', 'cerrado'].map((status) => (
                                <Button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    variant={filter === status ? 'primary' : 'outline'}
                                    className="text-xs px-2 py-1 h-auto"
                                >
                                    {status === 'all' ? 'Todos' :
                                        status === 'nuevo' ? 'Nuevos' :
                                            status === 'contactado' ? 'Contactados' :
                                                status === 'seguimiento' ? 'En Seguimiento' : 'Cerrados'}
                                    <span className="ml-1 text-xs opacity-75">
                                        ({status === 'all' ? contacts.length : getStatusCount(status)})
                                    </span>
                                </Button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

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
                                                    status={contact.status || 'nuevo'}
                                                    onChange={updateContactStatus}
                                                    id={contact.id}
                                                />
                                                <div className="flex items-center gap-1 text-gray-700">
                                                    <span>Fecha de creación:</span>
                                                    <span className="text-md">
                                                        {formatDate(contact.created_at || contact.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-1 truncate">
                                                    <span>📧</span>
                                                    <span className="truncate">{contact.email}</span>
                                                </div>
                                                {contact.phone && (
                                                    <div className="flex items-center gap-1 truncate">
                                                        <span>📱</span>
                                                        <span className="truncate">{contact.phone}</span>
                                                    </div>
                                                )}
                                                {contact.company && (
                                                    <div className="flex items-center gap-1 truncate">
                                                        <span>🏢</span>
                                                        <span className="truncate">{contact.company}</span>
                                                    </div>
                                                )}
                                                {contact.budget_estimated && (
                                                    <div className="flex items-center gap-1 truncate">
                                                        <span>💰</span>
                                                        <span className="truncate">{contact.budget_estimated}</span>
                                                    </div>
                                                )}
                                                {contact.event_date && (
                                                    <div className="flex items-center gap-1 truncate">
                                                        <span>📅</span>
                                                        <span className="truncate">{formatDate(contact.event_date)}</span>
                                                    </div>
                                                )}
                                                
                                                {contact.created_by_name && (
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <span>👤</span>
                                                        <span className="text-xs">Creado por: {contact.created_by_name}</span>
                                                    </div>
                                                )}
                                                {contact.last_modified_by_name && (
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <span>✏️</span>
                                                        <span className="text-xs">
                                                            Modificado por: {contact.last_modified_by_name}
                                                            {contact.last_modified_at && ` - ${formatDate(contact.last_modified_at)}`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => openHistory(contact.id)}
                                                className="flex-shrink-0 p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Ver historial de acciones"
                                            >
                                                Historial
                                            </button>
                                            <button
                                                onClick={() => deleteContact(contact.id)}
                                                className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                                title="Eliminar contacto"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {contact.message && (
                                        <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                                            <h4 className="font-medium text-xs sm:text-sm text-gray-700 mb-1">💬 Mensaje:</h4>
                                            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{contact.message}</p>
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-gray-100">
                                        <ContactActions
                                            contactId={contact.id}
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

            {showHistory && selectedContactId && (
                <ContactHistory
                    contactId={selectedContactId}
                    onClose={closeHistory}
                />
            )}
        </div>
    );
}
