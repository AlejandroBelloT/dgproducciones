'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ChangePasswordModal({ isOpen, onClose }) {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error cuando el usuario empiece a escribir
        if (error) setError('');
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                // Mostrar mensaje de éxito por un momento y luego cerrar inmediatamente
                setTimeout(() => {
                    setSuccess(false);
                    setError('');
                    onClose();
                    // Opcional: mostrar notificación de éxito en el panel
                }, 1000); // Reducido a 1 segundo para cierre más rápido
            } else {
                setError(data.error || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            setError('Error de conexión. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setError('');
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-semibold">
                                Cambiar Contraseña
                            </CardTitle>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {success ? (
                            <div className="text-center py-6">
                                <div className="text-green-500 text-4xl mb-4">✅</div>
                                <p className="text-green-600 font-medium">
                                    ¡Contraseña actualizada exitosamente!
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Regresando al panel de control...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Contraseña actual */}
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña Actual
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            placeholder="Ingresa tu contraseña actual"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.current ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Nueva contraseña */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            required
                                            minLength={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.new ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmar nueva contraseña */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            placeholder="Repite la nueva contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.confirm ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Validación visual de contraseñas */}
                                {formData.newPassword && formData.confirmPassword && (
                                    <div className="text-sm">
                                        {formData.newPassword === formData.confirmPassword ? (
                                            <p className="text-green-600 flex items-center gap-1">
                                                ✅ Las contraseñas coinciden
                                            </p>
                                        ) : (
                                            <p className="text-red-600 flex items-center gap-1">
                                                ❌ Las contraseñas no coinciden
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Botones */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="flex-1"
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={loading || formData.newPassword !== formData.confirmPassword}
                                    >
                                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}