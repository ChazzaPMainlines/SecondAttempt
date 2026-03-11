
import React from 'react';
import { Project, UserTier } from '../types';
import { ScorecardIcon, DocumentCheckIcon, DocumentMissingIcon, DocumentDraftIcon } from './icons/ActionIcons';

interface BankabilityScorecardProps {
    project: Project;
    userTier: UserTier;
    onUpgrade: () => void;
}

export const BankabilityScorecard: React.FC<BankabilityScorecardProps> = ({ project, userTier, onUpgrade }) => {
    const { bankabilityScorecard, documentGapAnalysis } = project;
    const completenessColor = bankabilityScorecard.completenessScore > 80 ? 'text-success' : bankabilityScorecard.completenessScore > 60 ? 'text-warning' : 'text-danger';
    const isInvestorReady = bankabilityScorecard.completenessScore >= 80;
    const isDeveloperFree = userTier === 'DEVELOPER_FREE';
    const isDeveloperAdvisory = userTier === 'DEVELOPER_ADVISORY';

    const getDocumentIcon = (status: 'Found' | 'Missing' | 'Draft') => {
        switch (status) {
            case 'Found': return <DocumentCheckIcon />;
            case 'Missing': return <DocumentMissingIcon />;
            case 'Draft': return <DocumentDraftIcon />;
        }
    }
    
    const getButton = () => {
        if (isDeveloperFree && isInvestorReady) {
            return (
                 <button onClick={onUpgrade} className="bg-brand-accent hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md animate-pulse">
                    Upgrade to Request Investor Intro
                </button>
            )
        }
        if (isDeveloperAdvisory) {
            return (
                 <button className="bg-success text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed" disabled>
                    Advisory Tier Activated
                </button>
            )
        }
        return null;
    }


    return (
        <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <ScorecardIcon />
                    <h3 className="text-xl font-bold font-display text-white ml-3">Bankability Scorecard</h3>
                </div>
                 {getButton()}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Data Completeness */}
                <div className="bg-brand-primary p-4 rounded-md flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-brand-text-secondary text-sm">Data Completeness</h4>
                        <p className={`font-display text-4xl font-bold ${completenessColor}`}>{bankabilityScorecard.completenessScore}%</p>
                    </div>
                     {isInvestorReady ? (
                        <p className="text-xs text-success mt-2 font-semibold">This project meets the threshold for investor review.</p>
                    ) : (
                        <p className="text-xs text-gray-400 mt-2">Upload additional documents to improve your score.</p>
                    )}
                </div>

                {/* Key Metrics */}
                <div className="bg-brand-primary p-4 rounded-md">
                    <h4 className="font-bold text-brand-text-secondary text-sm mb-2">Key Metrics</h4>
                    <div className="space-y-2">
                        {bankabilityScorecard.keyMetrics.map(metric => (
                            <div key={metric.label} className="flex justify-between text-sm">
                                <span className="text-gray-400">{metric.label}:</span>
                                <span className="font-bold text-white">{metric.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Summary */}
                <div className="bg-brand-primary p-4 rounded-md">
                     <h4 className="font-bold text-brand-text-secondary text-sm mb-2">Risk Summary</h4>
                     <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-danger flex items-center font-bold">HIGH</span>
                            <span className="font-bold text-white">{bankabilityScorecard.highRiskFlags}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-warning flex items-center font-bold">MEDIUM</span>
                            <span className="font-bold text-white">{bankabilityScorecard.mediumRiskFlags}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-success flex items-center font-bold">LOW</span>
                            <span className="font-bold text-white">{bankabilityScorecard.lowRiskFlags}</span>
                        </div>
                     </div>
                </div>
                
                {/* Document Gap Analysis */}
                <div className="bg-brand-primary p-4 rounded-md">
                    <h4 className="font-bold text-brand-text-secondary text-sm mb-2">Document Gap Analysis</h4>
                    <ul className="space-y-2">
                       {documentGapAnalysis.map(doc => (
                           <li key={doc.documentName} className="flex items-center text-sm">
                               {getDocumentIcon(doc.status)}
                               <span className="ml-2 text-gray-300">{doc.documentName}</span>
                           </li>
                       ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
