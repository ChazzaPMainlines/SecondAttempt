
import { Project, RiskVector, PillarCategory, PillarAnalysis, DealStructureSuggestion, RiskLevel } from '../types';
import { analyzeTechRisk } from './techRisk';
import { analyzeMarketRisk } from './marketRisk';
import { analyzeLegalRegulatoryRisk } from './legalRegulatoryRisk';
import { analyzeCounterpartyRisk } from './counterpartyRisk';
import { analyzeOperationalRisk } from './operationalRisk';
import { analyzeEsgRisk } from './esgRisk';
import { analyzeInsuranceRisk } from './insuranceRisk';

const MOCK_LATENCY = (min = 500, max = 1500) => new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

const analyzeCascadingEffects = (allRisks: RiskVector[]): RiskVector[] => {
    const cascadingRisks: RiskVector[] = [];
    const tags = new Set(allRisks.flatMap(r => r.correlationTags));

    if (tags.has('technical_scale-up') && tags.has('insurance_coverage-gap')) {
        cascadingRisks.push({
            id: 'cascade-tech-insurance',
            riskLevel: RiskLevel.CRITICAL,
            description: 'CASCADING RISK: Unproven technology at scale combined with a clear insurance exclusion for "inherent design defects" creates a potentially catastrophic, unmitigated financial risk upon equipment failure.',
            mitigation: 'Mandate procurement of a specialized Performance Warranty Insurance policy or increase the Performance LDs from the EPC contractor.',
            sourcePillar: PillarCategory.TECHNICAL,
            probability: 0.35,
            costImpact: 50000000,
            correlationTags: ['cascading', 'uninsurable-tech'],
            insurable: false, // The core risk is that it's hard to insure
        });
    }

    return cascadingRisks;
};

const suggestDealStructure = (pillarAnalyses: PillarAnalysis[]): DealStructureSuggestion => {
    const techPillar = pillarAnalyses.find(p => p.category === PillarCategory.TECHNICAL);
    const marketPillar = pillarAnalyses.find(p => p.category === PillarCategory.MARKET);
    const opsPillar = pillarAnalyses.find(p => p.category === PillarCategory.OPERATIONAL);
    const insurancePillar = pillarAnalyses.find(p => p.category === PillarCategory.INSURANCE);

    const suggestion: DealStructureSuggestion = {
        primary: 'Senior Debt',
        commentary: 'Default structure assumes a bankable project. Risk profile will adjust this.',
        requiredInsurance: ['Standard Delay-in-Start-Up', 'All-Risk Property Damage']
    };

    if (techPillar && techPillar.score < 60) {
        suggestion.primary = 'Venture Equity';
        suggestion.commentary = 'High technology risk (TRL < 7) makes this profile unsuitable for traditional debt. Venture Equity is required to fund the technology validation phase.';
    } else if (marketPillar && marketPillar.score < 50) {
        suggestion.primary = 'Venture Equity';
        suggestion.secondary = 'Mezzanine Debt';
        suggestion.commentary = 'Significant merchant exposure and market volatility risk require a higher-yield capital structure. Senior debt is unlikely until revenues are contracted.';
    } else if (opsPillar && opsPillar.score > 80 && techPillar && techPillar.score > 80) {
        suggestion.primary = 'Senior Debt';
        suggestion.secondary = 'Green Bonds';
        suggestion.commentary = 'Strong operational and technical profile with proven technology makes this an ideal candidate for low-cost Senior Debt and specialized Green Bonds.';
    }
    
    const insuranceGaps = insurancePillar?.risks.filter(r => r.correlationTags.includes('coverage-gap')).map(r => r.mitigation);
    if(insuranceGaps && insuranceGaps.length > 0) {
        suggestion.requiredInsurance.push(...insuranceGaps);
    }
    
    return suggestion;
};


// This function simulates the initial data extraction from documents using Gemini.
const extractDataFromDocs = async (files: FileList, project: Project): Promise<Project> => {
    console.log(`Simulating Gemini data extraction for ${files.length} documents...`);
    await MOCK_LATENCY();
    const updatedProject = { ...project };
    console.log("Data extraction complete.");
    return updatedProject;
}

export const getProjectAnalysis = async (project: Project, files: FileList): Promise<Project> => {
    const projectWithExtractedData = await extractDataFromDocs(files, project);
    
    // Step 2: Run all 7 pillar analyses in parallel.
    const pillarPromises = [
        analyzeTechRisk(projectWithExtractedData),
        analyzeMarketRisk(projectWithExtractedData),
        analyzeLegalRegulatoryRisk(projectWithExtractedData),
        analyzeCounterpartyRisk(projectWithExtractedData),
        analyzeOperationalRisk(projectWithExtractedData),
        analyzeEsgRisk(projectWithExtractedData),
        analyzeInsuranceRisk(projectWithExtractedData)
    ];
    
    const pillarResults = await Promise.all(pillarPromises);
    const [techRisks, marketRisks, legalRisks, counterpartyRisks, operationalRisks, esgRisks, insuranceRisks] = pillarResults;

    // Step 3: Create detailed pillar analysis objects.
    const sevenPillarsAnalysis: PillarAnalysis[] = [
        { category: PillarCategory.TECHNICAL, risks: techRisks, summary: "Analysis of technology readiness and performance guarantees.", score: 100 - (techRisks.length * 20) },
        { category: PillarCategory.MARKET, risks: marketRisks, summary: "Assessment of offtake agreements and merchant exposure.", score: 100 - (marketRisks.length * 25) },
        { category: PillarCategory.REGULATORY, risks: legalRisks, summary: "Review of jurisdiction, permits, and legal compliance.", score: 100 - (legalRisks.length * 30) },
        { category: PillarCategory.COUNTERPARTY, risks: counterpartyRisks, summary: "Evaluation of key partners' financial strength.", score: 100 - (counterpartyRisks.length * 15) },
        { category: PillarCategory.OPERATIONAL, risks: operationalRisks, summary: "Scrutiny of O&M plans and availability guarantees.", score: 100 - (operationalRisks.length * 20) },
        { category: PillarCategory.REGULATORY, risks: esgRisks, summary: "Analysis of environmental, social, and governance factors.", score: 100 - (esgRisks.length * 10) }, // ESG risks are weighted differently
        { category: PillarCategory.INSURANCE, risks: insuranceRisks, summary: "Identification of coverage gaps and uninsurable risks.", score: 100 - (insuranceRisks.length * 25) },
    ];
    
    // Step 4: Aggregate all risks and check for cascading effects.
    let allRiskVectors = pillarResults.flat();
    const cascadingEffects = analyzeCascadingEffects(allRiskVectors);
    allRiskVectors.push(...cascadingEffects);

    // Step 5: Generate capital structure suggestion.
    const dealStructure = suggestDealStructure(sevenPillarsAnalysis);
    
    // Step 6: Assemble the final, fully analyzed project object.
    const analyzedProject: Project = {
        ...projectWithExtractedData,
        riskVectors: allRiskVectors,
        sevenPillarsAnalysis,
        dealStructureSuggestion: dealStructure,
        bankabilityScorecard: { // Update scorecard based on new analysis
            ...projectWithExtractedData.bankabilityScorecard,
            highRiskFlags: allRiskVectors.filter(v => v.riskLevel === RiskLevel.HIGH || v.riskLevel === RiskLevel.CRITICAL).length,
            mediumRiskFlags: allRiskVectors.filter(v => v.riskLevel === RiskLevel.MEDIUM).length,
            lowRiskFlags: allRiskVectors.filter(v => v.riskLevel === RiskLevel.LOW).length,
        }
    };

    return analyzedProject;
}
