import { useState, useEffect, useCallback } from 'react'

export default function useUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(Array.isArray(data) ? data : [])
            } else {
                console.error('Error loading users:', response.status)
                setUsers([])
            }
        } catch (error) {
            console.error('Error loading users:', error)
            setUsers([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    const resetForm = useCallback(() => {
        setEditingUser(null)
        setShowForm(false)
    }, [])

    const saveUser = useCallback(async (userData) => {
        if (!userData?.name || !userData?.email) {
            throw new Error('El nombre y email son requeridos')
        }

        try {
            setSubmitting(true)

            const url = editingUser
                ? `/api/users?id=${editingUser.id}`
                : '/api/users'

            const method = editingUser ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al guardar usuario')
            }

            await loadUsers()
            resetForm()
        } catch (error) {
            console.error('Error saving user:', error)
            throw error
        } finally {
            setSubmitting(false)
        }
    }, [editingUser, loadUsers, resetForm])

    const deleteUser = useCallback(async (id) => {
        const user = users.find(u => u.id === id)
        if (!confirm(`¿Eliminar usuario "${user?.name || 'desconocido'}"?`)) return

        try {
            const response = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al eliminar usuario')
            }

            await loadUsers()
            alert('Usuario eliminado correctamente')
        } catch (error) {
            console.error('Error deleting user:', error)
            alert(error.message)
        }
    }, [users, loadUsers])

    const startEditing = useCallback((user) => {
        setEditingUser(user)
        setShowForm(true)
    }, [])

    // Estadísticas de usuarios
    const getUserStats = useCallback(() => {
        return {
            total: users.length,
            admins: users.filter(u => u.role === 'admin').length,
            editors: users.filter(u => u.role === 'editor').length,
            viewers: users.filter(u => u.role === 'viewer').length,
            active: users.filter(u => !u.disabled).length
        }
    }, [users])

    return {
        users,
        loading,
        showForm,
        setShowForm,
        editingUser,
        submitting,
        saveUser,
        deleteUser,
        resetForm,
        startEditing,
        getUserStats,
        loadUsers
    }
}