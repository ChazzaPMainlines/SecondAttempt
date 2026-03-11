
import { Project, PillarCategory, RiskLevel, QuantitativeTechnicalData, QuantitativeFinancialData, QuantitativeContractualData, QuantitativeCoreData, Pillar, PillarAnalysis, DealStructureSuggestion, DeepAnalysis, FinancialMetric } from './types';

export const PILLAR_DEFINITIONS: Record<PillarCategory, { description: string }> = {
  [PillarCategory.CONTRACTUAL]: { description: "Analysis of legal agreements, permits, and contractual obligations." },
  [PillarCategory.TECHNICAL]: { description: "Assessment of technology viability, engineering design, and operational plan." },
  [PillarCategory.FINANCIAL]: { description: "Scrutiny of financial models, revenue projections, and cost assumptions." },
  [PillarCategory.MARKET]: { description: "Evaluation of market demand, offtake agreements, and competitive landscape." },
  [PillarCategory.COUNTERPARTY]: { description: "Review of the financial strength and reliability of key partners (EPC, offtaker)." },
  [PillarCategory.REGULATORY]: { description: "Verification of compliance with regulations, environmental standards, and ESG criteria." },
  [PillarCategory.SPONSOR]: { description: "Assessment of the project sponsor's track record, experience, and financial backing." },
  [PillarCategory.OPERATIONAL]: { description: "Review of O&M plans, asset management, and performance guarantees."},
  [PillarCategory.INSURANCE]: { description: "Analysis of proposed insurance policies, coverage gaps, and uninsurable risks."}
};

// --- MOCK DATA FOR NEOM GREEN HYDROGEN PROJECT ---

const NEOM_CORE: QuantitativeCoreData = {
  totalCapex: 8400000000,
  governingLaw: 'English Law',
};

const NEOM_TECH: QuantitativeTechnicalData = {
  technologyType: 'Alkaline Electrolyzer',
  technologyReadinessLevel: 7,
  assetUsefulLife: 30,
  degradation: {
    modeledCurve: [{ year: 1, rate: 0.005 }, { year: 5, rate: 0.006 }, { year: 10, rate: 0.0075 }],
    warrantedCap: [{ year: 1, rate: 0.01 }, { year: 10, rate: 0.012 }]
  },
  yield: {
    p50_yield: 1200000, // kg/day
    p90_yield: 1050000,
    p99_yield: 950000,
    guaranteedAvailability: 0.95
  },
  efficiency: {
    nameplateEfficiency: 65, // kWh/kg H2
    guaranteedEfficiency: 62,
    performanceLdCap: 0.15
  }
};

const NEOM_FINANCIAL: QuantitativeFinancialData = {
  baseCaseProjectIRR: 14.5,
  p50_DSCR: 1.5,
  dscrCovenant: 1.2,
  lcoe_or_lcoh: 2.5, // $/kg
  merchantExposure: 0,
};

const NEOM_CONTRACTUAL: QuantitativeContractualData = {
  epcContractType: 'Turnkey',
  offtakeContractType: 'Take-or-Pay',
  offtakeTenor: 30,
  insurancePolicyExclusions: ['Cybersecurity Breach', 'War and Terrorism'],
};

// Derive Pillar data for UI from quantitative data
const neomPillars: Pillar[] = [
    {
      category: PillarCategory.TECHNICAL,
      summary: 'The project utilizes proven alkaline electrolyzer technology from a reputable supplier. Performance guarantees are in place, but scaling to this magnitude presents novel operational challenges.',
      dataPoints: [
        { label: 'Technology', value: NEOM_TECH.technologyType },
        { label: 'TRL', value: NEOM_TECH.technologyReadinessLevel },
        { label: 'Guaranteed Efficiency', value: `${NEOM_TECH.efficiency.guaranteedEfficiency} kWh/kg` },
      ],
    },
    {
      category: PillarCategory.FINANCIAL,
      summary: 'The financial model appears robust with a conservative LCOH. However, it is highly sensitive to renewable energy uptime and O&M costs.',
      dataPoints: [
        { label: 'Total CAPEX', value: `$${(NEOM_CORE.totalCapex / 1000000000).toFixed(1)} Billion` },
        { label: 'Projected IRR', value: `${NEOM_FINANCIAL.baseCaseProjectIRR}%` },
        { label: 'P50 DSCR', value: `${NEOM_FINANCIAL.p50_DSCR}x` },
      ],
    },
     {
      category: PillarCategory.MARKET,
      summary: `A ${NEOM_CONTRACTUAL.offtakeTenor}-year offtake agreement is secured with a major industrial gas company for the full production volume of green ammonia, mitigating market price risk.`,
      dataPoints: [
        { label: 'Offtake Type', value: NEOM_CONTRACTUAL.offtakeContractType },
        { label: 'Product', value: 'Green Ammonia' },
        { label: 'Merchant Exposure', value: `${NEOM_FINANCIAL.merchantExposure}%` },
      ],
    },
];

// --- ADDED MOCK ANALYSIS DATA ---
const neomSevenPillarsAnalysis: PillarAnalysis[] = [
    { category: PillarCategory.TECHNICAL, risks: [], summary: "Electrolyzer Scale-up efficiency unproven at this commercial magnitude.", score: 65 },
    { category: PillarCategory.MARKET, risks: [], summary: "Green H2 pricing premium vs Grey H2 is not guaranteed long-term.", score: 40 },
    { category: PillarCategory.FINANCIAL, risks: [], summary: "Financial model is robust but sensitive to uptime assumptions.", score: 75 },
    { category: PillarCategory.COUNTERPARTY, risks: [], summary: "Offtaker and EPC are highly-rated, investment-grade entities.", score: 90 },
    { category: PillarCategory.REGULATORY, risks: [], summary: "Strong regulatory framework and government support.", score: 85 },
    { category: PillarCategory.OPERATIONAL, risks: [], summary: "Novel operational challenges exist due to the unprecedented scale of the facility.", score: 70 },
    { category: PillarCategory.INSURANCE, risks: [], summary: "Standard insurance policies may contain exclusions for first-of-a-kind technology risks.", score: 55 },
];

const neomDealStructureSuggestion: DealStructureSuggestion = {
    primary: 'Venture Equity',
    commentary: 'High technology and market risk makes this profile unsuitable for traditional debt. Venture Equity is required to fund the technology validation and market-making phase.',
    requiredInsurance: ['Technology Performance Wrap', 'Political Risk Insurance'],
};

// --- ADDED DEEP ANALYSIS MOCK DATA ---
const neomDeepAnalysis: DeepAnalysis = {
    summary: {
        technologyDescription: "The project employs Thyssenkrupp's 20 MW alkaline water electrolysis modules to produce green hydrogen, which is then synthesized into green ammonia for export.",
        capacity: "Up to 650 tons per day of green hydrogen.",
        sponsorTrackRecord: "Sponsored by a consortium of ACWA Power, Air Products, and NEOM, all with extensive experience in large-scale energy projects.",
    },
    location: {
        address: "Tabuk Province, Kingdom of Saudi Arabia",
        coordinates: [28.38, 36.58],
        politicalRisk: {
            rating: "Moderate (A-)",
            details: "The project benefits from strong government support under the Vision 2030 framework, but regional geopolitical tensions remain a background risk.",
        },
        physicalRisk: {
            factors: ["High Heat Stress", "Water Scarcity", "Sandstorms"],
            details: "Extreme heat can impact PV panel and electrolyzer efficiency. Water is supplied via desalination, which is energy-intensive. Equipment requires specialized protection against sand ingress.",
        }
    },
    stakeholders: {
        sponsor: "ACWA Power, Air Products, NEOM",
        epcContractor: {
            name: "Bechtel",
            creditRating: "A",
            experience: "Extensive experience in mega-project EPC, but limited exposure to green hydrogen at this scale.",
        },
        omProvider: {
            name: "Air Products",
            availabilityGuarantee: "95% plant uptime guarantee, backed by balance sheet.",
        },
        offtaker: {
            name: "NEOM Green Hydrogen Co.",
            contractTerm: "30-year take-or-pay PPA for 100% of ammonia production.",
            rating: "A+ (backed by consortium)",
        }
    },
    insurance: {
        required: ["Technology Performance Wrap", "Political Risk Insurance", "Marine Cargo"],
        inPlace: ["All-Risk Property Damage", "Delay-in-Start-Up", "Political Risk Insurance"],
        gaps: [
            {
                risk: "'Inherent Defect' Exclusion",
                gapDescription: "The current property insurance policy explicitly excludes coverage for 'Inherent Defects' in the novel electrolyzer technology.",
                impact: "Leaves a potential $50M+ exposure in the event of a systemic technology failure not covered by the OEM warranty.",
            }
        ]
    }
};

// --- NEW FINANCIAL MODEL DATA ---
const neomFinancials: FinancialMetric[] = [
    { year: 1, revenue: 850, ebitda: 400, dscr: 1.65 },
    { year: 2, revenue: 920, ebitda: 450, dscr: 1.72 },
    { year: 3, revenue: 950, ebitda: 480, dscr: 1.80 },
    { year: 4, revenue: 980, ebitda: 500, dscr: 1.85 },
    { year: 5, revenue: 1010, ebitda: 520, dscr: 1.90 },
];

export const MOCK_PROJECT_NEOM_H2: Project = {
  id: 'proj_neom_h2_2026',
  name: 'NEOM Green Hydrogen Project',
  description: 'A world-scale green hydrogen production facility located in NEOM, Saudi Arabia, powered entirely by renewable energy.',
  
  // --- NEW PROJECT CONTEXT ---
  developerName: "NEOM Green Hydrogen Company",
  stage: "Ready to Build",
  financingStatus: "Raising $2.5B in Equity",

  quantitativeCore: NEOM_CORE,
  quantitativeTechnical: NEOM_TECH,
  quantitativeFinancial: NEOM_FINANCIAL,
  quantitativeContractual: NEOM_CONTRACTUAL,
  pillars: neomPillars,
  riskVectors: [
    {
      id: 'rv1',
      riskLevel: RiskLevel.HIGH,
      description: 'CASCADING RISK: IF unprecedented scale leads to integration issues (Technical), THEN uptime could fall below the guaranteed 95% availability (Contractual), LEADING TO reduced revenue that breaches the 1.2x DSCR covenant (Financial).',
      mitigation: 'A phased commissioning plan and a robust predictive maintenance model using AI monitoring are proposed.',
      sourcePillar: PillarCategory.TECHNICAL,
      probability: 0.15,
      costImpact: 250000000,
      insurable: true,
      correlationTags: ['technical', 'operational', 'financial', 'covenant'],
      citation: {
        sourceDocumentId: "Technical_Feasibility_Study_vFinal.pdf",
        pageNumber: 42,
        extract: "...while the core technology is proven, the integration of 120 parallel electrolyzer units presents a first-of-a-kind challenge."
      }
    },
    {
      id: 'rv2',
      riskLevel: RiskLevel.MEDIUM,
      description: 'CASCADING RISK: IF O&M costs increase by 10% (Financial), AND the off-taker is unable to pass through costs due to a fixed-price contract (Contractual), THEN Project IRR will drop by 150bps, impacting equity returns.',
      mitigation: 'Long-term service agreements with key equipment suppliers help cap expenditure volatility.',
      sourcePillar: PillarCategory.FINANCIAL,
      probability: 0.20,
      costImpact: 80000000,
      correlationTags: ['financial', 'contractual', 'returns'],
       citation: {
        sourceDocumentId: "Financial_Model_Assumptions.xlsx",
        extract: "Cell B52: O&M costs are indexed to CPI, but major component replacement costs are fixed."
      }
    },
  ],
  bankabilityScorecard: {
    completenessScore: 85,
    keyMetrics: [
        { label: 'Total CAPEX', value: '$8.4 Billion' },
        { label: 'Projected IRR', value: '14.5%' },
        { label: 'Offtaker Rating', value: 'A+' },
    ],
    highRiskFlags: 1,
    mediumRiskFlags: 1,
    lowRiskFlags: 1,
  },
  documentGapAnalysis: [
      { documentName: 'EPC Contract', status: 'Found', sourceFile: 'Final_EPC_Agreement_v3.1.pdf' },
      { documentName: 'Offtake Agreement', status: 'Found', sourceFile: 'Ammonia_Offtake_Term_Sheet.docx'},
      { documentName: 'Grid Interconnection Agreement', status: 'Missing' },
      { documentName: 'Insurance Term Sheet', status: 'Draft', sourceFile: 'Insurance_TS_draft_v1.pdf' },
      { documentName: 'Technical_Feasibility_Study_vFinal.pdf', status: 'Found' },
      { documentName: 'Financial_Model_Assumptions.xlsx', status: 'Found' },
  ],
  // --- POPULATED ANALYSIS FOR UI ---
  sevenPillarsAnalysis: neomSevenPillarsAnalysis,
  dealStructureSuggestion: neomDealStructureSuggestion,
  deepAnalysis: neomDeepAnalysis,
  financials: neomFinancials,
};


// --- MOCK DATA FOR CLAES PROJECT ---
// NOTE: This project is left without analysis data to demonstrate the "Data Room" view initially.
export const MOCK_PROJECT_CLAES: Project = {
  id: 'proj_claes_uk_2026',
  name: 'Trafford Compressed Liquid Air Energy Storage',
  description: 'A novel 50 MW long-duration energy storage project in the UK using cryogenic technology to store and release energy.',
  quantitativeCore: { totalCapex: 150000000, governingLaw: 'UK Law' },
  quantitativeTechnical: { 
    technologyType: 'Compressed Liquid Air Energy Storage',
    technologyReadinessLevel: 6,
    assetUsefulLife: 25,
    degradation: { modeledCurve: [], warrantedCap: [] },
    yield: { p50_yield: 100000, p90_yield: 85000, p99_yield: 75000, guaranteedAvailability: 0.97 },
    efficiency: { nameplateEfficiency: 0.65, guaranteedEfficiency: 0.60, performanceLdCap: 0.20 }
  },
  quantitativeFinancial: {
    baseCaseProjectIRR: 16.2, p50_DSCR: 1.4, dscrCovenant: 1.15, lcoe_or_lcoh: 150, merchantExposure: 0.40
  },
  quantitativeContractual: {
    epcContractType: 'Split-Scope', offtakeContractType: 'Capacity Market + Merchant', offtakeTenor: 15, insurancePolicyExclusions: ['Inherent Design Defects', 'Loss of Market']
  },
  pillars: [],
  riskVectors: [],
  bankabilityScorecard: {
    completenessScore: 30,
    keyMetrics: [
        { label: 'Total CAPEX', value: '£150 Million' },
        { label: 'Projected IRR', value: 'TBD' },
        { label: 'DSCR (P50)', value: 'TBD' },
    ],
    highRiskFlags: 0,
    mediumRiskFlags: 0,
    lowRiskFlags: 0,
  },
  documentGapAnalysis: [
      { documentName: 'EPC Contract', status: 'Missing' },
      { documentName: 'Performance Warranty', status: 'Missing'},
      { documentName: 'Grid Interconnection Agreement', status: 'Missing' },
      { documentName: 'Environmental Permit', status: 'Missing' },
  ],
};