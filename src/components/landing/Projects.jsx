'use client';

import { useState } from 'react';
import useProjects from '@/hooks/useProjects';

// Componentes modulares
import CategoryFilter from '@/components/projects/CategoryFilter';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import EmptyState from '@/components/projects/EmptyState';
import LoadingState from '@/components/projects/LoadingState';
import ProjectsCTA from '@/components/projects/ProjectsCTA';
import ProjectModal from '@/components/projects/ProjectModal';

export default function Projects() {
    const { projects, filteredProjects, loading, selectedCategory, setSelectedCategory } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [initialImageIndex, setInitialImageIndex] = useState(0);

    console.log('Projects component render:', {
        projects: projects.length,
        filteredProjects: filteredProjects.length,
        loading,
        selectedCategory,
        isModalOpen,
        selectedProject: selectedProject?.title
    });

    const openModal = (project, imageIndex = 0) => {
        console.log('openModal called with:', project, imageIndex);
        console.log('Current state - isModalOpen:', isModalOpen);

        setSelectedProject(project);
        setInitialImageIndex(imageIndex);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';

        console.log('Modal should be open now. Project set:', project);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
        setInitialImageIndex(0);
        document.body.style.overflow = 'unset';
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header modular */}
                <ProjectsHeader />

                {/* Filtros de categoría modulares */}
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />

                {/* Grid de proyectos o estado vacío */}
                {filteredProjects.length === 0 ? (
                    <EmptyState />
                ) : (
                    <ProjectsGrid
                        projects={filteredProjects}
                        onProjectClick={openModal}
                    />
                )}

                {/* Call to Action modular */}
                <ProjectsCTA />
            </div>

            {/* Modal modular del lightbox */}
            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={closeModal}
                initialImageIndex={initialImageIndex}
            />
        </section>
    );
}