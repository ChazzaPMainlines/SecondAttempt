
import { Project, RiskVector, RiskLevel, PillarCategory } from '../types';

export const analyzeTechRisk = (project: Project): Promise<RiskVector[]> => {
  const vectors: RiskVector[] = [];
  const { technologyReadinessLevel, technologyType, efficiency } = project.quantitativeTechnical;

  if (technologyReadinessLevel <= 6) {
    vectors.push({
      id: `rv-tech-trl-${project.id}`,
      riskLevel: RiskLevel.HIGH,
      description: `The project's Technology Readiness Level (TRL) is ${technologyReadinessLevel}, which is below the commercial deployment threshold (TRL 7-8). This poses significant scale-up and performance risks.`,
      mitigation: 'Secure a comprehensive performance warranty from the OEM and establish a contingency fund for potential underperformance.',
      sourcePillar: PillarCategory.TECHNICAL,
      probability: 0.45,
      costImpact: project.quantitativeCore.totalCapex * 0.1, // 10% of CAPEX
      insurable: true,
      correlationTags: ['technical', 'scale-up', 'performance'],
    });
  }

  if (efficiency.guaranteedEfficiency < efficiency.nameplateEfficiency * 0.9) {
     vectors.push({
      id: `rv-tech-efficiency-${project.id}`,
      riskLevel: RiskLevel.MEDIUM,
      description: `The guaranteed efficiency (${efficiency.guaranteedEfficiency}) is significantly lower than the nameplate efficiency (${efficiency.nameplateEfficiency}), suggesting a lack of confidence from the OEM.`,
      mitigation: 'Negotiate higher performance Liquidated Damages (LDs) to cover the revenue gap from underperformance.',
      sourcePillar: PillarCategory.TECHNICAL,
      probability: 0.30,
      costImpact: project.quantitativeCore.totalCapex * 0.05,
      insurable: true,
      correlationTags: ['technical', 'performance', 'contractual'],
    });
  }

  return Promise.resolve(vectors);
};
