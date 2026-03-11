
import React from 'react';
import { Project } from '../types';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects, selectedProjectId, onSelectProject }) => {
  return (
    <div className="relative">
      <select
        value={selectedProjectId || ''}
        onChange={(e) => onSelectProject(e.target.value)}
        className="appearance-none w-full md:w-80 bg-brand-secondary border border-gray-600 text-white py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-brand-primary focus:border-brand-accent transition-all"
      >
        <option value="" disabled>Select a Project...</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};
