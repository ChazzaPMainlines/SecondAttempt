
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { ProjectSelector } from './components/ProjectSelector';
import { ProjectView } from './components/ProjectView';
import { DataRoom } from './components/DataRoom';
import { PersonaSwitcher } from './components/PersonaSwitcher';
import { Project, UploadedFile, AnalysisStatus, UserTier } from './types';
import { MOCK_PROJECT_NEOM_H2, MOCK_PROJECT_CLAES } from './constants';
import { getProjectAnalysis } from './services/api';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([MOCK_PROJECT_NEOM_H2, MOCK_PROJECT_CLAES]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(MOCK_PROJECT_NEOM_H2.id);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [currentUserTier, setCurrentUserTier] = useState<UserTier>('DEVELOPER_FREE');
  
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  const handleAnalysis = useCallback(async (files: FileList) => {
    if (!selectedProject) return;

    setAnalysisStatus(AnalysisStatus.PROCESSING);
    const newUploadedFiles = Array.from(files).map(file => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      status: 'processing' as 'processing',
    }));
    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    // Call the aggregated analysis service
    const analysisResult = await getProjectAnalysis(selectedProject, files);
    
    // Remove duplicate risk vectors before setting state
    const uniqueRiskVectors = analysisResult.riskVectors.filter((vector, index, self) =>
        index === self.findIndex((v) => (
            v.id === vector.id
        ))
    );
    analysisResult.riskVectors = uniqueRiskVectors;

    setProjects(prevProjects => 
      prevProjects.map(p => p.id === selectedProjectId ? analysisResult : p)
    );

    setUploadedFiles(prev => prev.map(uf => {
      const isProcessed = newUploadedFiles.some(nf => nf.name === uf.name);
      return isProcessed ? { ...uf, status: 'complete' } : uf;
    }));
    setAnalysisStatus(AnalysisStatus.COMPLETE);

    setTimeout(() => {
        setAnalysisStatus(AnalysisStatus.IDLE);
    }, 2000);
  }, [selectedProject, selectedProjectId]);

  const handleUpgrade = () => {
    if (currentUserTier === 'DEVELOPER_FREE') {
      alert("Upgrading to Advisory Tier!\n\nYou now have access to the full Red Flag Report and can be introduced to our investor network. (This is a demo of the state change).");
      setCurrentUserTier('DEVELOPER_ADVISORY');
    }
  };

  const renderContent = () => {
    if (!selectedProject) {
      return (
        <div className="text-center py-20">
          <p className="text-brand-text-secondary">Please select a project to begin.</p>
        </div>
      );
    }
    
    // If project has analysis data, show the report. Otherwise, show the data room.
    if (selectedProject.sevenPillarsAnalysis) {
      return (
        <ProjectView 
          project={selectedProject} 
          userTier={currentUserTier}
          onUpgrade={handleUpgrade}
        />
      );
    } else {
      return (
         <DataRoom
            project={selectedProject}
            onGenerateReport={handleAnalysis}
            status={analysisStatus}
         />
      );
    }
  };


  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 pb-4 border-b border-brand-secondary gap-4">
        <h1 className="text-2xl font-display font-bold text-white">Infrux Data Engine</h1>
        <div className="flex items-center gap-4">
          <PersonaSwitcher currentTier={currentUserTier} setTier={setCurrentUserTier} />
          <ProjectSelector 
            projects={projects} 
            selectedProjectId={selectedProjectId} 
            onSelectProject={setSelectedProjectId}
          />
        </div>
      </div>
      
      {renderContent()}

    </Layout>
  );
};

export default App;