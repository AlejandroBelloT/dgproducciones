'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const router = useRouter();

    // Verificar token al cargar la aplicación
    useEffect(() => {
        checkAuth();
    }, []);

    // Logout automático al cerrar la página/pestaña
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Solo limpiar si hay una sesión activa
            if (user && token) {
                // Limpiar localStorage de forma síncrona
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');

                // Opcional: Llamar al endpoint de logout de forma síncrona
                // Nota: fetch con keepalive para que funcione durante el unload
                if (navigator.sendBeacon) {
                    navigator.sendBeacon('/api/auth/logout', JSON.stringify({
                        token: token
                    }));
                }
            }
        };

        const handleVisibilityChange = () => {
            // Logout cuando la página se oculta (ej: cerrar pestaña)
            if (document.visibilityState === 'hidden' && user && token) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        };

        // Agregar event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user, token]); // Dependencias para actualizar cuando cambie el estado de auth

    const checkAuth = async () => {
        try {
            const storedToken = localStorage.getItem('adminToken');
            const storedUser = localStorage.getItem('adminUser');

            if (!storedToken) {
                setLoading(false);
                return;
            }

            // Verificar si el token es válido
            const response = await fetch('/api/auth/verify/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: storedToken }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setToken(storedToken);
            } else {
                // Token inválido, limpiar storage
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: 'Error de conexión' };
        }
    };

    const logout = async () => {
        try {
            // Llamar endpoint de logout si hay token
            if (token) {
                await fetch('/api/auth/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('Error en logout:', error);
            // Continuar con el logout local aunque falle el servidor
        }

        // Limpiar estado local SIEMPRE
        setUser(null);
        setToken(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');

        // Redirigir al login
        router.push('/login');
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}

export default AuthContext;