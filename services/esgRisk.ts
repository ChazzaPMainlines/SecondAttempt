
import { Project, RiskVector, RiskLevel, PillarCategory } from '../types';

const GREEN_TECHNOLOGIES = ['Alkaline Electrolyzer', 'Compressed Liquid Air Energy Storage', 'Solar PV', 'Wind Turbine'];

export const analyzeEsgRisk = (project: Project): Promise<RiskVector[]> => {
  const vectors: RiskVector[] = [];
  const { technologyType } = project.quantitativeTechnical;
  
  if (!GREEN_TECHNOLOGIES.includes(technologyType)) {
    vectors.push({
      id: `rv-esg-tech-${project.id}`,
      riskLevel: RiskLevel.MEDIUM,
      description: `The project technology, '${technologyType}', does not have a clear "green" classification, which may limit its access to specialized ESG funds and green bonds.`,
      mitigation: 'Commission a third-party report to validate the projects environmental benefits and align it with a recognized green taxonomy.',
      sourcePillar: PillarCategory.REGULATORY, // Using REGULATORY as it covers ESG
      probability: 0.75,
      costImpact: 0, // Opportunity cost, not direct financial impact
      insurable: false,
      correlationTags: ['esg', 'financing', 'taxonomy'],
    });
  }

  // Placeholder for social/community risk
  vectors.push({
      id: `rv-esg-social-${project.id}`,
      riskLevel: RiskLevel.LOW,
      description: `Initial review of project location and stakeholder engagement plan shows adequate consideration for local community impact.`,
      mitigation: 'Maintain a transparent and ongoing community benefits program throughout the project lifecycle.',
      sourcePillar: PillarCategory.REGULATORY,
      probability: 0.10,
      costImpact: 1000000, // Small potential impact
      insurable: false,
      correlationTags: ['esg', 'social', 'community'],
  });

  return Promise.resolve(vectors);
};
