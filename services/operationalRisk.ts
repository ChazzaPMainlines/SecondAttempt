
import { Project, RiskVector, RiskLevel, PillarCategory } from '../types';

export const analyzeOperationalRisk = (project: Project): Promise<RiskVector[]> => {
  const vectors: RiskVector[] = [];
  const { guaranteedAvailability } = project.quantitativeTechnical.yield;
  const { p50_DSCR, dscrCovenant } = project.quantitativeFinancial;

  if (guaranteedAvailability < 0.96) { // 96%
    vectors.push({
      id: `rv-ops-availability-${project.id}`,
      riskLevel: RiskLevel.MEDIUM,
      description: `The guaranteed availability of ${(guaranteedAvailability * 100).toFixed(1)}% is below the industry benchmark for this technology type, increasing the risk of revenue loss due to downtime.`,
      mitigation: 'Ensure O&M agreement includes strong performance incentives and penalties. Model a downside scenario with lower availability.',
      sourcePillar: PillarCategory.OPERATIONAL,
      probability: 0.40,
      costImpact: project.quantitativeCore.totalCapex * 0.05,
      insurable: true,
      correlationTags: ['operational', 'uptime', 'revenue'],
    });
  }

  if (p50_DSCR < dscrCovenant + 0.15) {
    vectors.push({
      id: `rv-ops-dscr-${project.id}`,
      riskLevel: RiskLevel.HIGH,
      description: `The P50 DSCR of ${p50_DSCR}x provides a very thin cushion above the covenant of ${dscrCovenant}x. Minor operational underperformance could lead to default.`,
      mitigation: 'Increase the size of the Debt Service Reserve Account (DSRA) to 9 or 12 months.',
      sourcePillar: PillarCategory.OPERATIONAL,
      probability: 0.50,
      costImpact: project.quantitativeCore.totalCapex * 0.1,
      insurable: true,
      correlationTags: ['operational', 'financial', 'covenant'],
    });
  }

  return Promise.resolve(vectors);
};
