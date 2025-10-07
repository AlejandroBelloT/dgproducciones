'use client';

import { useState, useCallback, useEffect } from 'react';

const USER_ROLES = [
    { value: 'admin', label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Visualizador' }
];

export default function UserForm({ user, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'editor',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'editor',
                password: '', // No mostrar password existente
                confirmPassword: ''
            });
        } else {
            // Reset form para nuevo usuario
            setFormData({
                name: '',
                email: '',
                role: 'editor',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!formData.name?.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        // Validar email
        if (!formData.email?.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no tiene un formato válido';
        }

        // Validar password (solo requerido para nuevos usuarios)
        if (!user) { // Nuevo usuario
            if (!formData.password?.trim()) {
                newErrors.password = 'La contraseña es requerida';
            } else if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }

            if (!formData.confirmPassword?.trim()) {
                newErrors.confirmPassword = 'Confirma la contraseña';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        } else { // Usuario existente
            if (formData.password && formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }

            if (formData.password && formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Preparar datos para enviar
            const userData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                role: formData.role
            };

            // Solo incluir password si se proporcionó
            if (formData.password) {
                userData.password = formData.password;
            }

            await onSave(userData);
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            setErrors({ submit: 'Error al guardar el usuario' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                {user ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Nombre */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Ingresa el nombre completo"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="email@ejemplo.com"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Rol */}
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                        Rol de Usuario *
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                        {USER_ROLES.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                        {formData.role === 'admin' && '• Acceso completo al sistema'}
                        {formData.role === 'editor' && '• Puede crear y editar contenido'}
                        {formData.role === 'viewer' && '• Solo puede ver contenido'}
                    </p>
                </div>

                {/* Contraseña */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña {!user && '*'}
                        {user && <span className="text-gray-500 text-xs">(dejar vacío para mantener actual)</span>}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder={user ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                </div>

                {/* Confirmar Contraseña */}
                {(formData.password || !user) && (
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Contraseña *
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Confirma la contraseña"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>
                )}

                {/* Error de envío */}
                {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                )}

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                        {isLoading ? 'Guardando...' : (user ? 'Actualizar Usuario' : 'Crear Usuario')}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="w-full sm:flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}