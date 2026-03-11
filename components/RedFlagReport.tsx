
import React from 'react';
import { RiskVector, RiskLevel, UserTier } from '../types';
import { RiskIcon, ShieldCheckIcon, CitationIcon } from './icons/ActionIcons';

interface RedFlagReportProps {
  riskVectors: RiskVector[];
  userTier: UserTier;
  onUpgrade: () => void;
}

const getRiskColorClass = (level: RiskLevel) => {
  switch (level) {
    case RiskLevel.CRITICAL:
      return { border: 'border-red-400', text: 'text-red-400', bg: 'bg-red-900/20'};
    case RiskLevel.HIGH:
      return { border: 'border-danger', text: 'text-danger', bg: 'bg-danger/10' };
    case RiskLevel.MEDIUM:
      return { border: 'border-warning', text: 'text-warning', bg: 'bg-warning/10' };
    case RiskLevel.LOW:
      return { border: 'border-success', text: 'text-success', bg: 'bg-success/10' };
    default:
      return { border: 'border-gray-500', text: 'text-gray-400', bg: 'bg-gray-700/10' };
  }
};

const formatImpact = (impact: number) => {
    if (impact >= 1000000) {
        return `$${(impact / 1000000).toFixed(1)}M`;
    }
    if (impact >= 1000) {
        return `$${(impact / 1000).toFixed(0)}K`;
    }
    return `$${impact}`;
}

const RedFlagPaywall: React.FC<{riskVectors: RiskVector[], onUpgrade: () => void}> = ({ riskVectors, onUpgrade }) => {
    const highCount = riskVectors.filter(f => f.riskLevel === RiskLevel.HIGH || f.riskLevel === RiskLevel.CRITICAL).length;
    const mediumCount = riskVectors.filter(f => f.riskLevel === RiskLevel.MEDIUM).length;
    const lowCount = riskVectors.filter(f => f.riskLevel === RiskLevel.LOW).length;
    
    return (
        <div className="relative p-8 rounded-md border-2 border-dashed border-gray-600 bg-brand-primary/50 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/80 to-transparent backdrop-blur-sm z-10"></div>
            <div className="relative z-20 flex flex-col items-center">
                <h4 className="text-lg font-bold text-white mb-2">Full Report Locked</h4>
                <p className="text-brand-text-secondary mb-4 max-w-md">
                    Our AI has completed its analysis and identified <span className="font-bold text-danger">{highCount} High</span>, <span className="font-bold text-warning">{mediumCount} Medium</span>, and <span className="font-bold text-success">{lowCount} Low</span> potential risks.
                </p>
                <p className="text-sm text-brand-text-secondary mb-6">Upgrade to the Advisory Tier to unlock the full quantitative breakdown, cascading risk logic, and proposed mitigation strategies.</p>
                <button onClick={onUpgrade} className="bg-brand-accent hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                    Unlock Full Red Flag Report
                </button>
            </div>
        </div>
    );
}

const CitationTooltip: React.FC<{ vector: RiskVector, isLocked: boolean }> = ({ vector, isLocked }) => {
    if (!vector.citation) return null;

    if (isLocked) {
        return (
            <div className="relative group flex items-center">
                <CitationIcon locked={true} />
            </div>
        )
    }

    return (
        <div className="relative group flex items-center">
            <CitationIcon locked={false} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2
                        bg-brand-primary border border-gray-600 rounded-md shadow-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <p className="text-xs font-bold text-brand-accent break-all">{vector.citation.sourceDocumentId}{vector.citation.pageNumber ? `, p.${vector.citation.pageNumber}` : ''}</p>
                <p className="text-xs text-brand-text-secondary mt-1 italic">"{vector.citation.extract}"</p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
                            border-x-4 border-x-transparent
                            border-t-4 border-t-gray-600"></div>
            </div>
        </div>
    )
}


export const RedFlagReport: React.FC<RedFlagReportProps> = ({ riskVectors, userTier, onUpgrade }) => {
  const isDeveloperFree = userTier === 'DEVELOPER_FREE';
  if (isDeveloperFree && riskVectors.length > 2) { // Show teaser if there are enough risks
      return (
          <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold font-display text-white mb-4">Citational Risk Register</h3>
            <RedFlagPaywall riskVectors={riskVectors} onUpgrade={onUpgrade} />
          </div>
      );
  }
    
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold font-display text-white mb-4">Citational Risk Register</h3>
      <div className="space-y-4">
        {riskVectors.map(vector => {
            const colors = getRiskColorClass(vector.riskLevel);
            return (
          <div key={vector.id} className={`p-4 rounded-md border-l-4 ${colors.border} ${colors.bg}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                 <RiskIcon level={vector.riskLevel} />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                        <span className={`font-bold mr-3 ${colors.text}`}>{vector.riskLevel.toUpperCase()} RISK</span>
                        <span className="text-brand-text-secondary font-mono text-xs">Pillar: {vector.sourcePillar}</span>
                    </div>
                    <div className="flex items-center text-xs font-mono text-brand-highlight">
                        {vector.probability != null && <span>PROB: {(vector.probability * 100).toFixed(0)}%</span>}
                        {vector.probability != null && vector.costImpact != null && <span className="mx-2 text-gray-600">|</span>}
                        {vector.costImpact != null && <span>IMPACT: {formatImpact(vector.costImpact)}</span>}
                    </div>
                </div>
                <p className="text-sm text-brand-text mt-2">{vector.description}</p>
                <div className="flex justify-between items-end mt-3">
                    <p className="text-xs text-brand-text-secondary flex-1 mr-4"><span className="font-semibold">Proposed Mitigation:</span> {vector.mitigation}</p>
                    <div className="flex items-center space-x-4">
                        <CitationTooltip vector={vector} isLocked={isDeveloperFree} />
                        {vector.insurable && (
                            <button className="flex items-center text-xs bg-brand-primary text-brand-accent font-semibold py-1 px-3 rounded-md hover:bg-brand-accent hover:text-white transition-colors">
                               <ShieldCheckIcon />
                               <span className="ml-2">Explore Insurance</span>
                            </button>
                        )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};