'use client'

import Button from '@/components/ui/Button'

// Importar componentes modulares de proyectos
import useProjects from '@/hooks/useProjects'
import ProjectStats from './projects/ProjectStats'
import ProjectForm from './projects/ProjectForm'
import ProjectGrid from './projects/ProjectGrid'

export default function ProjectManagement() {
    const {
        // Estado de datos
        projects,
        loading,
        stats,

        // Estado del formulario
        showForm,
        setShowForm,
        editingProject,
        submitting,
        formData,
        setFormData,

        // Acciones
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
            {/* Estadísticas de proyectos */}
            <ProjectStats
                stats={stats}
                loading={loading}
                onCategoryClick={(category) => {
                    // Funcionalidad futura para filtrar por categoría
                    console.log('Filtrar por categoría:', category)
                }}
            />

            {/* Header con botón de acción */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                    🎨 Gestión de Contenido
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
            <ProjectForm
                showForm={showForm}
                onClose={handleCloseForm}
                formData={formData}
                setFormData={setFormData}
                onSubmit={saveProject}
                editingProject={editingProject}
                submitting={submitting}
            />

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