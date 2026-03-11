
import React from 'react';
import { Project, UserTier } from '../types';
import { RiskDashboard } from './RiskDashboard';
import { RedFlagReport } from './RedFlagReport';
import { QueryEngine } from './QueryEngine';
import { BankabilityScorecard } from './BankabilityScorecard';
import { DeepDive } from './DeepDive';
import { LockIcon } from './icons/ActionIcons';
import { ExecutiveSummary } from './ExecutiveSummary';
import { FinancialModelTable } from './FinancialModelTable';

interface ProjectViewProps {
  project: Project;
  userTier: UserTier;
  onUpgrade: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ project, userTier, onUpgrade }) => {
  const isInvestor = userTier === 'INVESTOR_PRO';
  const isDeveloperFree = userTier === 'DEVELOPER_FREE';

  return (
    <div className="mt-8">
      
      <ExecutiveSummary project={project} isInvestor={isInvestor} />

       <div className="my-8">
        <BankabilityScorecard project={project} userTier={userTier} onUpgrade={onUpgrade} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Dashboard & Risk Vectors */}
        <div className="xl:col-span-2 space-y-8">
          
          {project.sevenPillarsAnalysis && (
            <div className="relative">
              <RiskDashboard project={project} />
              {isDeveloperFree && (
                <div className="absolute inset-0 bg-brand-primary/70 backdrop-blur-md flex flex-col items-center justify-center rounded-lg z-10 p-4 text-center">
                  <h4 className="text-lg font-bold text-white mb-2">Full Dashboard Locked</h4>
                  <p className="text-brand-text-secondary mb-4 max-w-sm">
                    The Command Center provides a deep quantitative analysis of all 7 Pillars.
                  </p>
                  <button onClick={onUpgrade} className="bg-brand-accent hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                    Upgrade to Advisory Tier to Unlock
                  </button>
                </div>
              )}
            </div>
          )}

          {project.financials && (
            <div className="relative">
              <FinancialModelTable financials={project.financials} />
               {isDeveloperFree && (
                 <div className="absolute inset-0 bg-brand-primary/80 backdrop-blur-lg flex flex-col items-center justify-center rounded-lg z-10 p-4 text-center">
                  <LockIcon />
                  <h4 className="text-lg font-bold text-white mt-2 mb-2">Financial Model Locked</h4>
                  <p className="text-brand-text-secondary mb-4 max-w-sm">
                    Access 5-year projections for Revenue, EBITDA, and DSCR.
                  </p>
                  <button onClick={onUpgrade} className="bg-brand-accent hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                    Unlock Pro Features
                  </button>
                </div>
               )}
            </div>
          )}

          <div>
            <RedFlagReport riskVectors={project.riskVectors} userTier={userTier} onUpgrade={onUpgrade} />
          </div>

          {project.deepAnalysis && (
            <div className="relative">
              <DeepDive analysis={project.deepAnalysis} />
               {isDeveloperFree && (
                <div className="absolute inset-0 bg-brand-primary/80 backdrop-blur-lg flex flex-col items-center justify-center rounded-lg z-10 p-4 text-center">
                  <LockIcon />
                  <h4 className="text-lg font-bold text-white mt-2 mb-2">Deep Dive Analysis Locked</h4>
                  <p className="text-brand-text-secondary mb-4 max-w-sm">
                    Access granular data on location, stakeholders, and insurance.
                  </p>
                  <button onClick={onUpgrade} className="bg-brand-accent hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                    Unlock Pro Features
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Side: Query Engine */}
        <div className="xl:col-span-1">
           <QueryEngine project={project} userTier={userTier} />
        </div>
      </div>
    </div>
  );
};