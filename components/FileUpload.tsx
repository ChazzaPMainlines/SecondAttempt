
import React, { useState, useCallback } from 'react';
import { AnalysisStatus } from '../types';
import { UploadIcon, ProcessingIcon } from './icons/ActionIcons';

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
  status: AnalysisStatus;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, status }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [onFileUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
    }
  };

  const getStatusContent = () => {
    switch(status) {
      case AnalysisStatus.PROCESSING:
        return (
            <>
              <ProcessingIcon />
              <p className="text-lg font-semibold text-brand-accent">Analyzing Documents...</p>
              <p className="text-sm text-brand-text-secondary">Gemini is structuring data & identifying risks. This may take a moment.</p>
            </>
        );
      case AnalysisStatus.COMPLETE:
        return (
            <>
              <UploadIcon />
              <p className="text-lg font-semibold text-success">Analysis Complete</p>
              <p className="text-sm text-brand-text-secondary">Project data has been updated. You can upload more files.</p>
            </>
        );
      default:
        return (
             <>
              <UploadIcon />
              <p className="text-lg font-semibold text-brand-highlight">Drop Your Virtual Data Room Files Here</p>
              <p className="text-sm text-brand-text-secondary">or <span className="text-brand-accent font-medium">click to browse</span> (PDF, XLSX, DOCX)</p>
            </>
        );
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-300
        ${isDragging ? 'border-brand-accent bg-brand-secondary' : 'border-gray-600 hover:border-brand-accent'}
        ${status === AnalysisStatus.PROCESSING ? 'border-brand-accent animate-pulse' : ''}
      `}
    >
      <input
        type="file"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        disabled={status === AnalysisStatus.PROCESSING}
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        {getStatusContent()}
      </div>
    </div>
  );
};
