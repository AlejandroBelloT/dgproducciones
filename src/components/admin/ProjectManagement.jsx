'use client'

import Button from '@/components/ui/Button'
import useProjects from '@/hooks/useProjects'
import ProjectForm from './projects/ProjectForm'
import ProjectGrid from './projects/ProjectGrid'

export default function ProjectManagement() {
    const {
        projects,
        loading,
        showForm,
        setShowForm,
        editingProject,
        submitting,
        saveProject,
        deleteProject,
        resetForm,
        startEditing
    } = useProjects()

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

    if (loading && projects.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg">Cargando contenido...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header con botón de acción */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                    🎨 Gestión de Proyectos
                </h2>
                <Button
                    variant="primary"
                    onClick={handleToggleForm}
                    className="w-full sm:w-auto"
                    disabled={submitting}
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Proyecto'}
                </Button>
            </div>

            {/* Formulario de proyecto */}
            {showForm && (
                <ProjectForm
                    project={editingProject}
                    onSave={saveProject}
                    onCancel={handleCloseForm}
                    isLoading={submitting}
                />
            )}

            {/* Grid de proyectos */}
            <ProjectGrid
                projects={projects}
                loading={loading}
                onEdit={startEditing}
                onDelete={deleteProject}
            />
        </div>
    )
}