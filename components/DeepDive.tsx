
import React from 'react';
import { DeepAnalysis } from '../types';
import { MapPinIcon, UsersIcon, InsuranceShieldIcon, RiskIcon } from './icons/ActionIcons';

interface DeepDiveProps {
  analysis: DeepAnalysis;
}

const Card: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-brand-primary rounded-lg p-4 h-full">
    <div className="flex items-center mb-3">
      {icon}
      <h4 className="font-bold text-brand-highlight ml-2">{title}</h4>
    </div>
    {children}
  </div>
);

export const DeepDive: React.FC<DeepDiveProps> = ({ analysis }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold font-display text-white mb-6">Deep Dive Analysis</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Location & Risk Card */}
        <Card icon={<MapPinIcon />} title="Location & Risk Profile">
          <div className="text-sm space-y-3">
            <p className="font-bold text-brand-text">{analysis.location.address}</p>
            <div className="border-t border-gray-700 pt-2">
              <p className="font-semibold text-brand-text-secondary">Political Risk: <span className="font-bold text-warning">{analysis.location.politicalRisk.rating}</span></p>
              <p className="text-xs text-gray-400">{analysis.location.politicalRisk.details}</p>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <p className="font-semibold text-brand-text-secondary">Physical Risk Factors:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.location.physicalRisk.factors.map(factor => (
                  <span key={factor} className="text-xs bg-red-900/50 text-danger font-mono px-2 py-0.5 rounded">{factor}</span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">{analysis.location.physicalRisk.details}</p>
            </div>
          </div>
        </Card>

        {/* Stakeholder Matrix Card */}
        <Card icon={<UsersIcon />} title="Stakeholder Matrix">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-text-secondary uppercase">
                    <tr>
                        <th className="py-2">Role</th>
                        <th className="py-2">Entity</th>
                        <th className="py-2">Rating/Term</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    <tr className="hover:bg-brand-secondary/50">
                        <td className="py-2 font-semibold">Sponsor</td>
                        <td className="py-2">{analysis.stakeholders.sponsor}</td>
                        <td className="py-2 font-mono text-brand-highlight">-</td>
                    </tr>
                    <tr className="hover:bg-brand-secondary/50">
                        <td className="py-2 font-semibold">EPC</td>
                        <td className="py-2">{analysis.stakeholders.epcContractor.name}</td>
                        <td className="py-2 font-mono text-success">{analysis.stakeholders.epcContractor.creditRating}</td>
                    </tr>
                     <tr className="hover:bg-brand-secondary/50">
                        <td className="py-2 font-semibold">O&M</td>
                        <td className="py-2">{analysis.stakeholders.omProvider.name}</td>
                        <td className="py-2 font-mono text-brand-highlight">{analysis.stakeholders.omProvider.availabilityGuarantee}</td>
                    </tr>
                    <tr className="hover:bg-brand-secondary/50">
                        <td className="py-2 font-semibold">Offtaker</td>
                        <td className="py-2">{analysis.stakeholders.offtaker.name}</td>
                        <td className="py-2 font-mono text-success">{analysis.stakeholders.offtaker.rating}</td>
                    </tr>
                </tbody>
            </table>
        </Card>

        {/* Insurance Analysis Card */}
        <Card icon={<InsuranceShieldIcon />} title="Insurance Analysis">
            <div className="text-sm space-y-3">
                 <div>
                    <h5 className="font-semibold text-brand-text-secondary mb-1">Coverage In Place</h5>
                    <ul className="list-disc list-inside text-xs text-gray-300">
                        {analysis.insurance.inPlace.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </div>
                 <div className="border-t border-gray-700 pt-2">
                    <h5 className="font-semibold text-danger mb-1">Identified Coverage Gaps</h5>
                    {analysis.insurance.gaps.map((gap, index) => (
                        <div key={index} className="bg-danger/10 p-2 rounded-md">
                            <p className="font-bold text-red-400 text-xs">{gap.risk}</p>
                            <p className="text-xs text-gray-400 mt-1">{gap.gapDescription}</p>
                            <p className="text-xs text-center font-mono mt-2 p-1 bg-red-900/50 rounded-md">Impact: {gap.impact}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};
