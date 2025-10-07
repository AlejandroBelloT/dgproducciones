import { useState, useEffect, useCallback, useMemo } from 'react';

const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Estados para gestión de formularios
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'eventos',
        images: [],
        mainImage: 0
    });

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/projects');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Validar que data sea un array
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                console.warn('La respuesta de la API no es un array:', data);
                throw new Error('Invalid data format from API');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            setError(error.message);

            // Fallback a imágenes estáticas si falla la BD
            const fallbackImages = Array.from({ length: 6 }, (_, i) => {
                // Generar un número aleatorio de imágenes entre 5 y 30
                const numImages = Math.floor(Math.random() * 26) + 5; // 5-30 imágenes
                const eventImages = Array.from({ length: numImages }, (_, imgIdx) => {
                    const imageNum = ((i * 5 + imgIdx) % 30) + 1; // Ciclar entre imágenes 1-30
                    return `/images/imagesDePrueba/${imageNum}.png`;
                });

                return {
                    id: i + 1,
                    title: `Actividad ${i + 1}`,
                    category: i % 4 === 0 ? 'eventos' : i % 4 === 1 ? 'stands' : i % 4 === 2 ? 'activaciones' : 'material',
                    images: eventImages[0], // Primera imagen como principal
                    main_image: eventImages[0],
                    mainImage: eventImages[0],
                    allImages: eventImages,
                    description: `Descripción detallada de la actividad ${i + 1}. Esta fue una participación importante de DG Producciones en un evento de gran envergadura donde colaboramos en la producción y logística. El evento contó con ${numImages} momentos capturados que muestran la calidad de nuestro trabajo y la satisfacción de los asistentes.`,
                    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
                };
            });
            setProjects(fallbackImages);
        } finally {
            setLoading(false);
        }
    }, []);

    // Resetear formulario (definido temprano para evitar referencias circulares)
    const resetForm = useCallback(() => {
        setFormData({
            title: '',
            description: '',
            category: 'eventos',
            images: [],
            mainImage: 0
        })
        setEditingProject(null)
        setShowForm(false)
    }, [])

    // Crear o actualizar proyecto
    const saveProject = useCallback(async (projectData) => {
        if (!projectData.title || projectData.images.length === 0) {
            throw new Error('El título y al menos una imagen son obligatorios')
        }

        try {
            setSubmitting(true)

            const formDataToSend = new FormData()
            formDataToSend.append('title', projectData.title)
            formDataToSend.append('description', projectData.description)
            formDataToSend.append('category', projectData.category)

            projectData.images.forEach((image) => {
                formDataToSend.append('images', image)
            })

            const response = await fetch('/api/projects', {
                method: editingProject ? 'PUT' : 'POST',
                body: formDataToSend
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Error al guardar el proyecto')
            }

            // Recargar proyectos después de guardar
            await fetchProjects()

            // Resetear formulario
            resetForm()

            return true
        } catch (error) {
            console.error('Error saving project:', error)
            throw error
        } finally {
            setSubmitting(false)
        }
    }, [editingProject, fetchProjects, resetForm])

    // Eliminar proyecto
    const deleteProject = useCallback(async (projectId) => {
        const project = projects.find(p => p.id === projectId)
        const projectTitle = project ? project.title : 'este proyecto'

        const confirmed = window.confirm(
            `¿Estás seguro de eliminar "${projectTitle}"?\n\nEsta acción no se puede deshacer y eliminará todas las imágenes asociadas.`
        )

        if (!confirmed) return false

        try {
            console.log('🗑️ Eliminando proyecto con ID:', projectId)

            const response = await fetch(`/api/projects?id=${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Error al eliminar el proyecto')
            }

            const result = await response.json()
            console.log('✅ Proyecto eliminado:', result)

            // Actualizar estado local
            setProjects(prevProjects =>
                prevProjects.filter(project => project.id !== projectId)
            )

            // Mostrar mensaje de éxito
            alert(`Proyecto "${result.title || projectTitle}" eliminado exitosamente.`)

            return true
        } catch (error) {
            console.error('❌ Error eliminando proyecto:', error)
            alert(`Error al eliminar el proyecto: ${error.message}`)
            return false
        }
    }, [projects])

    // Iniciar edición
    const startEditing = useCallback((project) => {
        setEditingProject(project)
        setFormData({
            title: project.title,
            description: project.description || '',
            category: project.category,
            images: [],
            mainImage: project.mainImage || 0
        })
        setShowForm(true)
    }, [])

    // Obtener estadísticas por categoría
    const getCategoryStats = useCallback((category) => {
        if (!Array.isArray(projects)) return 0
        return projects.filter(project => project.category === category).length
    }, [projects])

    // Estadísticas generales
    const stats = useMemo(() => ({
        total: projects.length,
        eventos: getCategoryStats('eventos'),
        stands: getCategoryStats('stands'),
        activaciones: getCategoryStats('activaciones'),
        material: getCategoryStats('material')
    }), [projects, getCategoryStats])

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Filtrar proyectos por categoría
    const filteredProjects = useMemo(() => {
        if (selectedCategory === 'all') {
            return projects;
        }
        return projects.filter(project => project.category === selectedCategory);
    }, [projects, selectedCategory]);

    return {
        // Estado de datos
        projects,
        filteredProjects,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        stats,

        // Estado del formulario
        showForm,
        setShowForm,
        editingProject,
        submitting,
        formData,
        setFormData,

        // Acciones
        refetch: fetchProjects,
        fetchProjects,
        saveProject,
        deleteProject,
        resetForm,
        startEditing,
        getCategoryStats
    };
};

export default useProjects;