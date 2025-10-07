import { useState, useEffect, useCallback, useMemo } from 'react'
import apiClient from '@/lib/api-client'

export default function useProjects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProject, setEditingProject] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all')

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true)
            const response = await apiClient.getProjects()
            setProjects(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error('Error loading projects:', error)
            setProjects([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadProjects()
    }, [loadProjects])

    // Filtrar proyectos por categoría
    const filteredProjects = useMemo(() => {
        if (selectedCategory === 'all') {
            return projects;
        }
        return projects.filter(project => project.category === selectedCategory);
    }, [projects, selectedCategory]);

    const resetForm = useCallback(() => {
        setEditingProject(null)
        setShowForm(false)
    }, [])

    const saveProject = useCallback(async (projectData) => {
        if (!projectData?.title) {
            throw new Error('El título es requerido')
        }

        try {
            setSubmitting(true)

            // Preparar datos para la API REST
            const projectPayload = {
                title: projectData.title,
                description: projectData.description || '',
                category: projectData.category || 'eventos',
                images: projectData.images || [],
                status: 'active'
            }

            if (editingProject) {
                await apiClient.updateProject(editingProject.id, projectPayload)
            } else {
                await apiClient.createProject(projectPayload)
            }

            await loadProjects()
            resetForm()
        } catch (error) {
            console.error('Error saving project:', error)
            throw error
        } finally {
            setSubmitting(false)
        }
    }, [editingProject, loadProjects, resetForm])

    const deleteProject = useCallback(async (id) => {
        const project = projects.find(p => p.id === id)
        if (!confirm('¿Eliminar "' + (project?.title || 'proyecto') + '"?')) return

        try {
            await apiClient.deleteProject(id)
            await loadProjects()
            alert('Proyecto eliminado')
        } catch (error) {
            console.error('Error deleting project:', error)
            alert(error.message)
        }
    }, [projects, loadProjects])

    const startEditing = useCallback((project) => {
        setEditingProject(project)
        setShowForm(true)
    }, [])

    return {
        projects,
        filteredProjects,
        loading,
        selectedCategory,
        setSelectedCategory,
        showForm,
        setShowForm,
        editingProject,
        submitting,
        saveProject,
        deleteProject,
        resetForm,
        startEditing
    }
}
