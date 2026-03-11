
import { Project, RiskVector, RiskLevel, PillarCategory } from '../types';

// Mock data for credit ratings
const COUNTERPARTY_RATINGS: Record<string, string> = {
    'Turnkey': 'A+', // Strong EPC
    'Split-Scope': 'BBB', // Weaker EPC structure
    'Take-or-Pay': 'A+', // Strong Offtaker
    'Capacity Market + Merchant': 'BBB-', // Weaker Offtaker
};

export const analyzeCounterpartyRisk = (project: Project): Promise<RiskVector[]> => {
    const vectors: RiskVector[] = [];
    const { epcContractType, offtakeContractType } = project.quantitativeContractual;

    const epcRating = COUNTERPARTY_RATINGS[epcContractType] || 'Not Rated';
    if (epcRating.startsWith('BBB') || epcRating === 'Not Rated') {
        vectors.push({
            id: `rv-cp-epc-${project.id}`,
            riskLevel: RiskLevel.MEDIUM,
            description: `The EPC contract structure is '${epcContractType}' which corresponds to a weaker credit profile (${epcRating}). This increases the risk of construction delays or cost overruns.`,
            mitigation: 'Require a Parent Company Guarantee from the EPC contractor and increase the contingency budget.',
            sourcePillar: PillarCategory.COUNTERPARTY,
            probability: 0.30,
            costImpact: project.quantitativeCore.totalCapex * 0.07,
            insurable: false,
            correlationTags: ['counterparty', 'construction'],
        });
    }
    
    const offtakerRating = COUNTERPARTY_RATINGS[offtakeContractType] || 'Not Rated';
    if (offtakerRating.startsWith('BBB') || offtakerRating === 'Not Rated') {
        vectors.push({
            id: `rv-cp-offtake-${project.id}`,
            riskLevel: RiskLevel.HIGH,
            description: `The offtake structure relies on a '${offtakeContractType}', which has an implied credit rating of ${offtakerRating}. There is a significant risk of payment default from the offtaker.`,
            mitigation: 'Secure a Letter of Credit or other credit enhancement from the offtaker.',
            sourcePillar: PillarCategory.COUNTERPARTY,
            probability: 0.25,
            costImpact: project.quantitativeCore.totalCapex * 0.1,
            insurable: true,
            correlationTags: ['counterparty', 'revenue', 'credit'],
        });
    }

    return Promise.resolve(vectors);
};
