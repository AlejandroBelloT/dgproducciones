'use client';

import { useState, useEffect } from 'react';

const ACTION_LABELS = {
    created: 'Contacto creado',
    contacted: 'Cliente contactado',
    status_changed: 'Estado cambiado',
    updated: 'Información actualizada',
    note_added: 'Nota agregada',
    deleted: 'Contacto eliminado'
};

const ACTION_COLORS = {
    created: 'bg-green-100 text-green-800 border-green-200',
    contacted: 'bg-blue-100 text-blue-800 border-blue-200',
    status_changed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    updated: 'bg-purple-100 text-purple-800 border-purple-200',
    note_added: 'bg-gray-100 text-gray-800 border-gray-200',
    deleted: 'bg-red-100 text-red-800 border-red-200'
};

const ACTION_ICONS = {
    created: '✨',
    contacted: '📞',
    status_changed: '🔄',
    updated: '✏️',
    note_added: '📝',
    deleted: '🗑️'
};

export default function ContactHistory({ contactId, onClose }) {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (contactId) {
            loadHistory();
        }
    }, [contactId]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/contacts/${contactId}/history/`);

            if (response.ok) {
                const data = await response.json();
                setHistory(data);
                setError(null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Error al cargar historial');
            }
        } catch (err) {
            setError('Error de conexión al cargar historial');
            console.error('Error loading contact history:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getActionDescription = (action) => {
        let description = ACTION_LABELS[action.action_type] || action.action_type;

        if (action.action_type === 'status_changed' && action.previous_status && action.new_status) {
            description += ` (${action.previous_status} → ${action.new_status})`;
        }

        return description;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Cargando historial...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                    <div className="text-center">
                        <div className="text-red-600 text-xl mb-4">❌</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar historial</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                📋 Historial de Acciones
                            </h2>
                            {history?.contact && (
                                <p className="text-sm text-gray-600 mt-1">
                                    <strong>{history.contact.name}</strong> ({history.contact.email})
                                </p>
                                
                            )}
                            
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                {history?.totalActions || 0} acciones registradas
                            </span>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {history?.contact && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-900 mb-2">📊 Información del Contacto</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-blue-800">Estado actual:</span>
                                    <span className="ml-2 text-blue-700">{history.contact.status}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-800">Creado:</span>
                                    <span className="ml-2 text-blue-700">
                                        {formatDate(history.contact.created_at)}
                                    </span>
                                </div>
                                {history.contact.created_by_name && (
                                    <div>
                                        <span className="font-medium text-blue-800">Creado por:</span>
                                        <span className="ml-2 text-blue-700">{history.contact.created_by_name}</span>
                                    </div>
                                )}
                                {history.contact.last_modified_by_name && (
                                    <div>
                                        <span className="font-medium text-blue-800">Última modificación:</span>
                                        <span className="ml-2 text-blue-700">
                                            {history.contact.last_modified_by_name} - {formatDate(history.contact.last_modified_at)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {history?.actions && history.actions.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 mb-4">🕒 Cronología de Acciones</h3>

                            {history.actions.map((action, index) => (
                                <div
                                    key={action.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Icono de acción */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${ACTION_COLORS[action.action_type] || 'bg-gray-100 text-gray-800'}`}>
                                            {ACTION_ICONS[action.action_type] || '📝'}
                                        </div>

                                        {/* Contenido de la acción */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        {getActionDescription(action)}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Por: <span className="font-medium">{action.user_name}</span>
                                                        {action.user_email && (
                                                            <span className="text-gray-500"> ({action.user_email})</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <span className="text-sm text-gray-500 ml-4">
                                                    {formatDate(action.action_date)}
                                                </span>
                                            </div>

                                            {/* Notas de la acción */}
                                            {action.notes && (
                                                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                                                    <p className="text-sm text-gray-700">{action.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-4xl mb-4">📝</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No hay acciones registradas
                            </h3>
                            <p className="text-gray-600">
                                Este contacto aún no tiene historial de acciones.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}