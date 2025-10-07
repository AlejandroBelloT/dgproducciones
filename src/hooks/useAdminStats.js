import { useState, useEffect } from 'react'

export const useAdminStats = () => {
    const [stats, setStats] = useState({
        contacts: 0,
        content: 0,
        projects: 0,
        team: 0,
        users: 0,
        pendingContacts: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchStats = async () => {
        try {
            setLoading(true)
            setError(null)

            const [contactsRes, contentRes, teamRes, usersRes] = await Promise.all([
                fetch('/api/contacts'),
                fetch('/api/projects'), // Cambiado de /api/content a /api/projects
                fetch('/api/team'),
                fetch('/api/users')
            ])

            // Verificar que todas las respuestas sean exitosas
            if (!contactsRes.ok || !contentRes.ok || !teamRes.ok) {
                throw new Error('Error al obtener datos del servidor')
            }

            const contacts = await contactsRes.json()
            const content = await contentRes.json()
            const team = await teamRes.json()
            const users = usersRes.ok ? await usersRes.json() : []

            // Asegurar que los datos sean arrays
            const contactsArray = Array.isArray(contacts) ? contacts : []
            const contentArray = Array.isArray(content) ? content : []
            const teamArray = Array.isArray(team) ? team : []
            const usersArray = Array.isArray(users) ? users : []

            // Calcular estadísticas
            const pendingContacts = contactsArray.filter(c =>
                c.status === 'nuevo' || c.status === 'pending' || !c.status
            ).length

            const completedContacts = contactsArray.filter(c =>
                c.status === 'cerrado'
            ).length

            const completionRate = contactsArray.length > 0
                ? Math.round((completedContacts / contactsArray.length) * 100)
                : 0

            setStats({
                contacts: contactsArray.length,
                content: contentArray.length,
                projects: contentArray.length, // Proyectos es lo mismo que contenido por ahora
                team: teamArray.length,
                users: usersArray.length,
                pendingContacts,
                completedContacts,
                completionRate
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    return {
        stats,
        loading,
        error,
        refetchStats: fetchStats
    }
}