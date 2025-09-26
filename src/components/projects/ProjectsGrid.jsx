import ProjectCard from './ProjectCard';

export default function ProjectsGrid({ projects, onProjectClick }) {
    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {projects.map((project, idx) => (
                <ProjectCard
                    key={project.id || idx}
                    project={project}
                    index={idx}
                    onImageClick={onProjectClick}
                />
            ))}
        </div>
    );
}