
import React from 'react';
import { Project } from '../types';

interface ExecutiveSummaryProps {
  project: Project;
  isInvestor: boolean;
}

const SummaryItem: React.FC<{label: string; value: string | undefined}> = ({ label, value }) => (
    <div>
        <p className="text-xs text-brand-text-secondary font-bold uppercase tracking-wider">{label}</p>
        <p className="text-brand-highlight font-semibold">{value || 'N/A'}</p>
    </div>
);

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ project, isInvestor }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold font-display text-white mb-2">{isInvestor ? `Project Teaser: ${project.name}` : project.name}</h2>
            <p className="text-brand-text-secondary max-w-3xl">{project.description}</p>
          </div>
           {project.financingStatus && (
               <div className="mt-4 md:mt-0 md:ml-6 text-center bg-brand-primary p-4 rounded-md flex-shrink-0">
                    <p className="text-sm text-brand-text-secondary font-bold">FINANCING STATUS</p>
                    <p className="text-lg font-bold font-display text-brand-accent">{project.financingStatus}</p>
               </div>
           )}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryItem label="Developer / Sponsor" value={project.developerName} />
        <SummaryItem label="Project Stage" value={project.stage} />
        <SummaryItem label="Technology" value={project.quantitativeTechnical.technologyType} />
        <SummaryItem label="Governing Law" value={project.quantitativeCore.governingLaw} />
      </div>
    </div>
  );
};