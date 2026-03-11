
import { Project, RiskVector, RiskLevel, PillarCategory } from '../types';

const HIGH_RISK_JURISDICTIONS = ['Country X Law', 'Country Y Law']; // Mock data

export const analyzeLegalRegulatoryRisk = (project: Project): Promise<RiskVector[]> => {
  const vectors: RiskVector[] = [];
  const { governingLaw } = project.quantitativeCore;

  if (HIGH_RISK_JURISDICTIONS.some(j => governingLaw.includes(j))) {
    vectors.push({
      id: `rv-legal-law-${project.id}`,
      riskLevel: RiskLevel.HIGH,
      description: `The project is governed by '${governingLaw}', which is considered a high-risk jurisdiction with potential for political instability and contract enforcement issues.`,
      mitigation: 'Secure political risk insurance and establish arbitration in a neutral venue (e.g., Singapore, London).',
      sourcePillar: PillarCategory.REGULATORY,
      probability: 0.20,
      costImpact: project.quantitativeCore.totalCapex * 0.2,
      insurable: true,
      correlationTags: ['legal', 'jurisdiction', 'political'],
    });
  }
  
  // Placeholder for a missing permit check
  if (project.documentGapAnalysis.some(d => d.documentName === 'Environmental Permit' && d.status === 'Missing')) {
      vectors.push({
      id: `rv-legal-permit-${project.id}`,
      riskLevel: RiskLevel.CRITICAL,
      description: `The Environmental Permit is missing from the data room. Without this permit, construction cannot begin, posing a critical path risk to the entire project timeline.`,
      mitigation: 'Immediately confirm the status of the Environmental Permit application with the project sponsor.',
      sourcePillar: PillarCategory.REGULATORY,
      probability: 1.0, // The document is missing, so the risk is certain
      costImpact: 0, // Impact is delay, not direct cost yet
      insurable: false,
      correlationTags: ['legal', 'permitting', 'timeline'],
    });
  }

  return Promise.resolve(vectors);
};
