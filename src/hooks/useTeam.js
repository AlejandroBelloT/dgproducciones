import { useState, useEffect } from 'react'

export const useTeam = () => {
    const [team, setTeam] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch team data
    const fetchTeam = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/team')

            if (!response.ok) {
                throw new Error('Error al cargar el equipo')
            }

            const data = await response.json()
            setTeam(data || [])
        } catch (error) {
            console.error('Error fetching team:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Create team member
    const createTeamMember = async (formData) => {
        try {
            const response = await fetch('/api/team', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al crear el colaborador')
            }

            const newMember = await response.json()
            setTeam(prev => [...prev, newMember])
            return { success: true, data: newMember }
        } catch (error) {
            console.error('Error creating team member:', error)
            return { success: false, error: error.message }
        }
    }

    // Update team member
    const updateTeamMember = async (formData) => {
        try {
            const response = await fetch('/api/team', {
                method: 'PUT',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al actualizar el colaborador')
            }

            const updatedMember = await response.json()
            setTeam(prev =>
                prev.map(member =>
                    member.id === updatedMember.id ? updatedMember : member
                )
            )
            return { success: true, data: updatedMember }
        } catch (error) {
            console.error('Error updating team member:', error)
            return { success: false, error: error.message }
        }
    }

    // Delete team member
    const deleteTeamMember = async (id) => {
        try {
            const response = await fetch(`/api/team?id=${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al eliminar el colaborador')
            }

            setTeam(prev => prev.filter(member => member.id !== id))
            return { success: true }
        } catch (error) {
            console.error('Error deleting team member:', error)
            return { success: false, error: error.message }
        }
    }

    // Get department statistics
    const getDepartmentStats = () => {
        const stats = {
            total: team.length,
            produccion: team.filter(member => member.department === 'produccion').length,
            comercial: team.filter(member => member.department === 'comercial').length,
            administracion: team.filter(member => member.department === 'administracion').length,
            creativo: team.filter(member => member.department === 'creativo').length
        }
        return stats
    }

    // Initialize on mount
    useEffect(() => {
        fetchTeam()
    }, [])

    return {
        // State
        team,
        loading,
        error,

        // Actions
        fetchTeam,
        createTeamMember,
        updateTeamMember,
        deleteTeamMember,

        // Utils
        getDepartmentStats
    }
}