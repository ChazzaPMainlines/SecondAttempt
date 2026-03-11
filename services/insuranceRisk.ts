
import { Project, RiskVector, RiskLevel, PillarCategory } from '../types';

const CRITICAL_EXCLUSIONS = ['Inherent Design Defects', 'Cybersecurity Breach'];

export const analyzeInsuranceRisk = (project: Project): Promise<RiskVector[]> => {
  const vectors: RiskVector[] = [];
  const { insurancePolicyExclusions } = project.quantitativeContractual;
  const { technologyReadinessLevel } = project.quantitativeTechnical;

  const foundCriticalExclusions = insurancePolicyExclusions.filter(ex => CRITICAL_EXCLUSIONS.includes(ex));

  if (foundCriticalExclusions.length > 0) {
    vectors.push({
      id: `rv-ins-exclusions-${project.id}`,
      riskLevel: RiskLevel.HIGH,
      description: `The proposed insurance policy contains critical exclusions (${foundCriticalExclusions.join(', ')}), which transfer significant, unmitigated risk back to the project.`,
      mitigation: 'Negotiate with insurers to remove or "buy back" these exclusions, or seek a specialized policy to cover these specific risks.',
      sourcePillar: PillarCategory.INSURANCE,
      probability: 1.0, // Exclusion is certain
      costImpact: 20000000, // Potential uninsured loss
      insurable: false, // The risk is that it's un-insured
      correlationTags: ['insurance', 'coverage-gap', 'contractual'],
    });
  }
  
  if (technologyReadinessLevel < 7 && !insurancePolicyExclusions.includes('Inherent Design Defects')) {
       vectors.push({
      id: `rv-ins-trl-gap-${project.id}`,
      riskLevel: RiskLevel.MEDIUM,
      description: `For a project with TRL ${technologyReadinessLevel}, the absence of an "Inherent Design Defect" exclusion is unusual. The policy may be mispriced or subject to cancellation upon review.`,
      mitigation: 'Proactively engage with the insurer to confirm their understanding of the technology risk and obtain an explicit endorsement of coverage.',
      sourcePillar: PillarCategory.INSURANCE,
      probability: 0.50,
      costImpact: 0, // Risk is policy cancellation, not direct loss
      insurable: false,
      correlationTags: ['insurance', 'technical', 'coverage-gap'],
    });
  }

  return Promise.resolve(vectors);
};
