'use client';

import { useState, useEffect } from 'react';

export default function TestUsersDB() {
    const [dbStatus, setDbStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        checkDatabase();
        loadUsers();
    }, []);

    const checkDatabase = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users/test');
            const data = await response.json();

            if (response.ok) {
                setDbStatus(data);
                setError(null);
            } else {
                setError(data.error || 'Error al verificar la base de datos');
            }
        } catch (err) {
            setError('Error de conexión: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await fetch('/api/users');
            if (response.ok) {
                const usersData = await response.json();
                setUsers(usersData);
            }
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    const testCreateUser = async () => {
        try {
            // Generar un email único para evitar conflictos
            const timestamp = Date.now();
            const testUser = {
                name: 'Usuario Test',
                email: `test-${timestamp}@example.com`,
                password: 'test123',
                role: 'editor'
            };

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testUser),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`✅ Usuario de test creado exitosamente!\nEmail: ${testUser.email}\nID: ${result.id}`);
                checkDatabase(); // Recargar estado
                loadUsers(); // Recargar lista de usuarios
            } else {
                console.error('Error response:', result);
                alert('❌ Error al crear usuario: ' + result.error + (result.details ? '\nDetalles: ' + result.details : ''));
            }
        } catch (err) {
            console.error('Network error:', err);
            alert('❌ Error de conexión: ' + err.message);
        }
    };

    const deleteTestUser = async (userId, userEmail) => {
        if (!userEmail.includes('test-') && !userEmail.includes('@example.com')) {
            alert('❌ Solo se pueden eliminar usuarios de test');
            return;
        }

        if (!confirm(`¿Eliminar usuario ${userEmail}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/users?id=${userId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok) {
                alert('✅ Usuario eliminado exitosamente');
                loadUsers();
                checkDatabase();
            } else {
                alert('❌ Error al eliminar usuario: ' + result.error);
            }
        } catch (err) {
            alert('❌ Error de conexión: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg">Verificando conexión a la base de datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Test de Base de Datos - Usuarios
                </h1>

                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">
                            ❌ Error de Conexión
                        </h2>
                        <p className="text-red-700">{error}</p>

                        {error.includes('tabla users no existe') && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                                <h3 className="font-semibold text-yellow-800">Solución:</h3>
                                <p className="text-yellow-700">
                                    Ejecuta el siguiente comando SQL en tu base de datos:
                                </p>
                                <pre className="mt-2 p-2 bg-gray-800 text-white rounded text-sm overflow-x-auto">
                                    {`CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email, password, role) VALUES
(UUID(), 'Administrador', 'admin@dgproducciones.com', SHA2('admin123', 256), 'admin');`}
                                </pre>
                            </div>
                        )}

                        <button
                            onClick={checkDatabase}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Reintentar Conexión
                        </button>
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-green-800 mb-4">
                            ✅ Conexión Exitosa
                        </h2>

                        {dbStatus && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-green-800">Estado:</h3>
                                    <p className="text-green-700">{dbStatus.message}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-green-800">Usuarios Registrados:</h3>
                                    <p className="text-green-700 text-2xl font-bold">{dbStatus.totalUsers}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-green-800">Estructura de la Tabla:</h3>
                                    <div className="mt-2 overflow-x-auto">
                                        <table className="min-w-full bg-white border border-gray-200 rounded">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Campo</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nulo</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clave</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dbStatus.columns?.map((col, index) => (
                                                    <tr key={index} className="border-t">
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{col.field}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{col.type}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{col.null}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{col.key}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {users.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            👥 Usuarios en el Sistema ({users.length})
                        </h2>
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div key={user.id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    {(user.email.includes('test-') || user.email.includes('@example.com')) && (
                                        <button
                                            onClick={() => deleteTestUser(user.id, user.email)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            Eliminar Test
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {dbStatus && !error && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4">
                            🧪 Prueba de Creación de Usuario
                        </h2>
                        <p className="text-blue-700 mb-4">
                            Haz clic en el botón para probar la creación de un usuario de test.
                        </p>
                        <button
                            onClick={testCreateUser}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Crear Usuario de Test
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <a
                        href="/admin"
                        className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
                    >
                        ← Volver al Panel Admin
                    </a>
                </div>
            </div>
        </div>
    );
}