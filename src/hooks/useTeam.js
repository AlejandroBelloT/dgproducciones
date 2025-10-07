import { useState, useEffect } from 'react'
import apiClient from '@/lib/api-client'

export const useTeam = () => {
    const [team, setTeam] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch team data
    const fetchTeam = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await apiClient.getTeam()
            setTeam(response.data || [])
        } catch (error) {
            console.error('Error fetching team:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Create team member
    const createTeamMember = async (memberData) => {
        try {
            const response = await apiClient.createTeamMember(memberData)
            await fetchTeam() // Recargar lista
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Error creating team member:', error)
            return { success: false, error: error.message }
        }
    }

    // Update team member
    const updateTeamMember = async (id, memberData) => {
        try {
            const response = await apiClient.updateTeamMember(id, memberData)
            await fetchTeam() // Recargar lista
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Error updating team member:', error)
            return { success: false, error: error.message }
        }
    }

    // Delete team member
    const deleteTeamMember = async (id) => {
        try {
            await apiClient.deleteTeamMember(id)
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