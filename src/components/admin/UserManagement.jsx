'use client'

import Button from '@/components/ui/Button'
import useUsers from '@/hooks/useUsers'
import UserForm from './users/UserForm'
import UserGrid from './users/UserGrid'

export default function UserManagement() {
    const {
        users,
        loading,
        showForm,
        setShowForm,
        editingUser,
        submitting,
        saveUser,
        deleteUser,
        resetForm,
        startEditing
    } = useUsers()

    const handleToggleForm = () => {
        if (showForm) {
            resetForm()
        } else {
            setShowForm(true)
        }
    }

    const handleCloseForm = () => {
        resetForm()
    }

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg">Cargando usuarios...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header con botón de acción */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                    👥 Gestión de Usuarios
                </h2>
                <Button
                    variant="primary"
                    onClick={handleToggleForm}
                    className="w-full sm:w-auto"
                    disabled={submitting}
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
                </Button>
            </div>

            {/* Formulario de usuario */}
            {showForm && (
                <UserForm
                    user={editingUser}
                    onSave={saveUser}
                    onCancel={handleCloseForm}
                    isLoading={submitting}
                />
            )}

            {/* Grid de usuarios */}
            <UserGrid
                users={users}
                loading={loading}
                onEdit={startEditing}
                onDelete={deleteUser}
            />
        </div>
    )
}