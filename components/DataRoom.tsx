
import React from 'react';
import { Project, AnalysisStatus } from '../types';
import { FileUpload } from './FileUpload';
import { DocumentCheckIcon, DocumentMissingIcon, DocumentDraftIcon } from './icons/ActionIcons';

interface DataRoomProps {
    project: Project;
    onGenerateReport: (files: FileList) => void;
    status: AnalysisStatus;
}

export const DataRoom: React.FC<DataRoomProps> = ({ project, onGenerateReport, status }) => {
    
    const getDocumentIcon = (status: 'Found' | 'Missing' | 'Draft') => {
        switch (status) {
            case 'Found': return <DocumentCheckIcon />;
            case 'Missing': return <DocumentMissingIcon />;
            case 'Draft': return <DocumentDraftIcon />;
        }
    }

    return (
        <div className="mt-8">
            <div className="bg-brand-secondary p-6 rounded-lg mb-8 shadow-lg">
                <h2 className="text-2xl font-bold font-display text-white mb-2">{project.name}</h2>
                <p className="text-brand-text-secondary">{project.description}</p>
                 <p className="text-sm text-brand-text-secondary mt-2">
                    Upload all project documentation (PDFs, Excel Models, Contracts) to begin the automated audit and generate the Investment Committee report.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* File Upload */}
                <div>
                     <FileUpload onFileUpload={onGenerateReport} status={status} />
                </div>

                {/* Document Checklist */}
                 <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold font-display text-white mb-4">Initial Document Checklist</h3>
                     <p className="text-sm text-brand-text-secondary mb-6">
                        This checklist is based on the initial project setup. The AI will verify and update this list as you upload files.
                    </p>
                    <ul className="space-y-3">
                       {project.documentGapAnalysis.map(doc => (
                           <li key={doc.documentName} className="flex items-center text-base p-2 bg-brand-primary rounded-md">
                               {getDocumentIcon(doc.status)}
                               <span className="ml-3 text-gray-300">{doc.documentName}</span>
                           </li>
                       ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}