import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

const ROLE_COLORS = {
    admin: 'bg-red-100 text-red-800',
    editor: 'bg-blue-100 text-blue-800',
    viewer: 'bg-gray-100 text-gray-800'
};

const ROLE_LABELS = {
    admin: 'Administrador',
    editor: 'Editor',
    viewer: 'Visualizador'
};

export default function UserGrid({ users, loading, onEdit, onDelete }) {
    if (loading) {
        return (
            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">
                        👥 Usuarios del Sistema
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-48"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">
                    👥 Usuarios del Sistema ({users.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {users.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <div className="text-4xl sm:text-6xl mb-4 opacity-50">👥</div>
                        <p className="text-gray-500 text-sm sm:text-base">
                            No hay usuarios registrados
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">
                            Crea el primer usuario usando el botón "Nuevo Usuario"
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={() => onEdit(user)}
                                onDelete={() => onDelete(user.id)}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function UserCard({ user, onEdit, onDelete }) {
    // Generar avatar con iniciales
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    // Color del avatar basado en el rol
    const getAvatarColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-500';
            case 'editor': return 'bg-blue-500';
            case 'viewer': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-center justify-between">
                {/* Información del usuario */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className={`w-12 h-12 ${getAvatarColor(user.role)} rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}>
                        {getInitials(user.name)}
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                                {user.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] || ROLE_COLORS.viewer}`}>
                                {ROLE_LABELS[user.role] || 'Desconocido'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                            {user.email}
                        </p>
                        {user.lastLogin && (
                            <p className="text-xs text-gray-400 mt-1">
                                Último acceso: {new Date(user.lastLogin).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Metadatos y acciones */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Fecha de creación */}
                    <div className="hidden sm:block text-right">
                        <p className="text-xs text-gray-500">
                            Creado: {new Date(user.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                        {user.updatedAt && user.updatedAt !== user.createdAt && (
                            <p className="text-xs text-gray-400">
                                Actualizado: {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short'
                                })}
                            </p>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-1">
                        <button
                            onClick={onEdit}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                            title="Editar usuario"
                        >
                            <span className="text-sm">✏️</span>
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Eliminar usuario"
                        >
                            <span className="text-sm">🗑️</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Información adicional en móvil */}
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    Creado: {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </p>
            </div>
        </div>
    );
}