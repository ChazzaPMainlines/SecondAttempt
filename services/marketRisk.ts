
import { Project, RiskVector, RiskLevel, PillarCategory } from '../types';

export const analyzeMarketRisk = (project: Project): Promise<RiskVector[]> => {
  const vectors: RiskVector[] = [];
  const { merchantExposure } = project.quantitativeFinancial;
  const { offtakeContractType, offtakeTenor } = project.quantitativeContractual;
  const { assetUsefulLife } = project.quantitativeTechnical;

  if (merchantExposure > 0.3) { // 30%
    vectors.push({
      id: `rv-market-merchant-${project.id}`,
      riskLevel: RiskLevel.HIGH,
      description: `The project has a high merchant exposure of ${(merchantExposure * 100).toFixed(0)}%. Revenue is highly vulnerable to market price volatility, impacting debt service capacity.`,
      mitigation: 'Implement a revenue hedging strategy (e.g., PPA, swap) for a portion of the merchant tail or secure a corporate offtake.',
      sourcePillar: PillarCategory.MARKET,
      probability: 0.60,
      costImpact: project.quantitativeCore.totalCapex * 0.15,
      insurable: false,
      correlationTags: ['market', 'price-volatility', 'financial'],
    });
  }
  
  if (offtakeTenor < assetUsefulLife * 0.6) {
    vectors.push({
      id: `rv-market-tenor-${project.id}`,
      riskLevel: RiskLevel.MEDIUM,
      description: `The offtake tenor of ${offtakeTenor} years is significantly shorter than the asset's useful life of ${assetUsefulLife} years, creating a "merchant tail" risk post-contract.`,
      mitigation: 'Secure options to extend the offtake agreement or model conservative price assumptions for the merchant period.',
      sourcePillar: PillarCategory.MARKET,
      probability: 0.85, // High probability this risk exists
      costImpact: project.quantitativeCore.totalCapex * 0.1,
      insurable: false,
      correlationTags: ['market', 'contractual', 'merchant-tail'],
    });
  }

  return Promise.resolve(vectors);
};
