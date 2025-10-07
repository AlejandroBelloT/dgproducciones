'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                router.push('/admin');
            } else {
                setError(data.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError('Error de conexión. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto mb-4">
                            <img
                                src="/images/logo/logo.png"
                                alt="DG Producciones"
                                className="h-16 w-auto mx-auto"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Administración
                        </CardTitle>
                        <p className="text-gray-600 text-sm mt-2">
                            Ingresa tus credenciales para acceder al panel de control
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                    placeholder="tu@email.com"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                            <p>¿Problemas para acceder?</p>
                            <p className="mt-1">Contacta al administrador del sistema</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Credenciales de prueba para desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                    <Card className="mt-4 bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                            <h3 className="font-medium text-blue-800 mb-2">Credenciales de desarrollo:</h3>
                            <p className="text-sm text-blue-700">
                                <strong>Email:</strong> admin@dgproducciones.com<br />
                                <strong>Contraseña:</strong> admin123
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}