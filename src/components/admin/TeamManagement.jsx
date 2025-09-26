'use client'

import { useState } from 'react'
import { useTeam } from '@/hooks/useTeam'
import Button from '@/components/ui/Button'
import TeamStats from './team/TeamStats'
import TeamForm from './team/TeamForm'
import TeamGrid from './team/TeamGrid'

export default function TeamManagement() {
    const {
        team,
        loading,
        error,
        createTeamMember,
        updateTeamMember,
        deleteTeamMember,
        getDepartmentStats
    } = useTeam()

    const [showForm, setShowForm] = useState(false)
    const [editingMember, setEditingMember] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('all')
    const [formLoading, setFormLoading] = useState(false)

    // Handle form submission
    const handleFormSubmit = async (formData, action) => {
        setFormLoading(true)
        let result

        try {
            if (action === 'create') {
                result = await createTeamMember(formData)
            } else {
                result = await updateTeamMember(formData)
            }

            if (result.success) {
                setShowForm(false)
                setEditingMember(null)
            }

            return result
        } finally {
            setFormLoading(false)
        }
    }

    // Handle edit member
    const handleEdit = (member) => {
        setEditingMember(member)
        setShowForm(true)
    }

    // Handle delete member
    const handleDelete = async (id) => {
        const result = await deleteTeamMember(id)
        if (!result.success) {
            alert(result.error || 'Error al eliminar el colaborador')
        }
    }

    // Handle form cancel
    const handleFormCancel = () => {
        setShowForm(false)
        setEditingMember(null)
    }

    // Handle new member button
    const handleNewMember = () => {
        setEditingMember(null)
        setShowForm(!showForm)
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-2">⚠️ Error</div>
                    <div className="text-gray-600">{error}</div>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Team Statistics */}
            <TeamStats
                stats={getDepartmentStats()}
                className="mb-6"
            />

            {/* Header with search and actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar colaboradores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">🔍</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-w-[180px]"
                    >
                        <option value="all">Todos los departamentos</option>
                        <option value="produccion">🎭 Producción</option>
                        <option value="comercial">💼 Comercial</option>
                        <option value="administracion">📊 Administración</option>
                        <option value="creativo">🎨 Creativo</option>
                    </select>

                    <Button
                        variant="primary"
                        onClick={handleNewMember}
                        className="whitespace-nowrap"
                    >
                        {showForm ? 'Cancelar' : '+ Nuevo Colaborador'}
                    </Button>
                </div>
            </div>

            {/* Team Form */}
            <TeamForm
                isVisible={showForm}
                editingMember={editingMember}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={formLoading}
            />

            {/* Team Grid */}
            <TeamGrid
                team={team}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                searchTerm={searchTerm}
                departmentFilter={departmentFilter}
            />
        </div>
    )
}