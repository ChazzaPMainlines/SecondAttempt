
import React from 'react';
import { Project, PillarAnalysis, DealStructureSuggestion, RiskLevel, DealStructureType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { RiskIcon } from './icons/ActionIcons';

interface RiskDashboardProps {
  project: Project;
}

const getBarColor = (score: number) => {
  if (score < 50) return '#ef4444'; // Red
  if (score >= 50 && score < 80) return '#eab308'; // Yellow
  return '#22c55e'; // Green
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-primary p-3 border border-gray-700 rounded-md shadow-lg">
        <p className="font-bold text-brand-highlight">{label}</p>
        <p className="text-sm text-brand-text-secondary">{`Score: ${payload[0].value}`}</p>
        <p className="text-xs text-brand-text mt-1 max-w-xs">{payload[0].payload.summary}</p>
      </div>
    );
  }
  return null;
};

// Helper to transform deal structure suggestion into chart data
const getCapitalStackData = (suggestion?: DealStructureSuggestion) => {
    if (!suggestion) return [{ name: 'Capital Stack' }];

    let debt = 0;
    let mezzanine = 0;
    let equity = 0;

    switch (suggestion.primary) {
        case 'Senior Debt':
            debt = 60;
            equity = 40;
            if (suggestion.secondary === 'Green Bonds') {
                debt = 50;
                mezzanine = 20;
                equity = 30;
            }
            break;
        case 'Venture Equity':
            equity = 100;
            break;
        case 'Mezzanine Debt':
            debt = 40;
            mezzanine = 30;
            equity = 30;
            break;
        default:
             equity = 100;
    }
    
    return [{ name: 'Capital Stack', debt, mezzanine, equity }];
};

const RedLineAlerts: React.FC<{ project: Project }> = ({ project }) => {
    const criticalRisks = project.riskVectors.filter(rv => rv.riskLevel === RiskLevel.CRITICAL || rv.riskLevel === RiskLevel.HIGH);
    if (criticalRisks.length === 0) return null;

    return (
        <div className="bg-red-900/20 border-2 border-danger rounded-lg p-4 mt-6">
            <h4 className="font-bold font-display text-danger text-lg mb-2">High-Priority Alerts</h4>
            <div className="space-y-3">
                {criticalRisks.map(risk => (
                    <div key={risk.id} className="text-sm flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <RiskIcon level={risk.riskLevel} />
                        </div>
                        <p className="ml-2 text-brand-text-secondary"><span className="font-bold text-danger">{risk.riskLevel.toUpperCase()}:</span> {risk.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const RiskDashboard: React.FC<RiskDashboardProps> = ({ project }) => {
  if (!project.sevenPillarsAnalysis || !project.dealStructureSuggestion) {
    return (
      <div className="bg-brand-secondary p-6 rounded-lg text-center">
        <p className="text-brand-text-secondary">Run analysis to generate the Command Center Dashboard.</p>
      </div>
    );
  }
  
  const pillarData = project.sevenPillarsAnalysis;
  const capitalStackData = getCapitalStackData(project.dealStructureSuggestion);

  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold font-display text-white mb-6">Command Center</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Zone B: The "Risk EQ" (Main View) */}
            <div className="lg:col-span-2">
                <h4 className="font-bold font-display text-brand-highlight mb-4">7-Pillar Risk Equalizer</h4>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        layout="vertical"
                        data={pillarData}
                        margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis type="number" domain={[0, 100]} stroke="#A0AEC0" />
                        <YAxis dataKey="category" type="category" stroke="#A0AEC0" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(202, 240, 248, 0.1)' }} />
                        <Bar dataKey="score" background={{ fill: '#1A2F4B' }}>
                            {pillarData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Zone A: The Capital Stack (Top Right) */}
            <div className="lg:col-span-1">
                <h4 className="font-bold font-display text-brand-highlight mb-4">Suggested Capital Structure</h4>
                <p className="text-xs text-brand-text-secondary mb-4">{project.dealStructureSuggestion.commentary}</p>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={capitalStackData} layout="vertical" margin={{ top: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip formatter={(value: number) => `${value}%`} />
                        <Legend wrapperStyle={{ color: '#E0E0E0', fontSize: '12px' }}/>
                        <Bar dataKey="debt" name="Senior Debt" stackId="a" fill="#22c55e" />
                        <Bar dataKey="mezzanine" name="Mezzanine / Bonds" stackId="a" fill="#eab308" />
                        <Bar dataKey="equity" name="Equity" stackId="a" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        {/* Zone C: The "Red Line" (Cascading Alerts) */}
        <RedLineAlerts project={project} />
    </div>
  );
};
