
export enum PillarCategory {
  CONTRACTUAL = 'Contractual & Legal',
  TECHNICAL = 'Technical & Operational',
  FINANCIAL = 'Financial Model',
  MARKET = 'Market & Offtake',
  COUNTERPARTY = 'Counterparty Risk',
  REGULATORY = 'Regulatory & ESG',
  SPONSOR = 'Sponsor & Management',
  OPERATIONAL = 'Operational',
  INSURANCE = 'Insurance',
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export type UserTier = 'DEVELOPER_FREE' | 'DEVELOPER_ADVISORY' | 'INVESTOR_PRO';

export interface PillarDataPoint {
  label: string;
  value: string | number;
  description?: string;
}

export interface Pillar {
  category: PillarCategory;
  summary: string;
  dataPoints: PillarDataPoint[];
}

// --- NEW CITATION INTERFACE FOR EVIDENCE LAYER ---
export interface Citation {
  sourceDocumentId: string;
  pageNumber?: number;
  extract: string;
}

// Replaced RedFlag with a more quantitative RiskVector
export interface RiskVector {
  id: string;
  riskLevel: RiskLevel;
  description: string;
  mitigation: string;
  sourcePillar: PillarCategory;
  probability: number; // 0.0 to 1.0
  costImpact: number; // Financial value
  insurable?: boolean;
  correlationTags: string[]; // e.g., ["regulatory", "latency"]
  citation?: Citation; // EVIDENCE LAYER
}

export interface DocumentGap {
    documentName: string;
    status: 'Found' | 'Missing' | 'Draft';
    sourceFile?: string;
}

export interface BankabilityScorecard {
    completenessScore: number; // Percentage
    keyMetrics: PillarDataPoint[];
    highRiskFlags: number;
    mediumRiskFlags: number;
    lowRiskFlags: number;
}

// --- NEW INTERFACES FOR 7-PILLAR ANALYSIS ---

export type DealStructureType = 'Venture Equity' | 'Senior Debt' | 'Green Bonds' | 'Mezzanine Debt' | 'Insurance Wrapper';

export interface DealStructureSuggestion {
    primary: DealStructureType;
    secondary?: DealStructureType;
    commentary: string;
    requiredInsurance: string[];
}

export interface PillarAnalysis {
    category: PillarCategory;
    risks: RiskVector[];
    summary: string;
    score: number; // Score 0-100 (100 is best)
}

export interface DeepAnalysis {
  summary: {
    technologyDescription: string;
    capacity: string;
    sponsorTrackRecord: string;
  };
  location: {
    address: string;
    coordinates: [number, number];
    politicalRisk: { rating: string; details: string }; 
    physicalRisk: { factors: string[]; details: string };
  };
  stakeholders: {
    sponsor: string;
    epcContractor: { name: string; creditRating: string; experience: string };
    omProvider: { name: string; availabilityGuarantee: string };
    offtaker: { name: string; contractTerm: string; rating: string };
  };
  insurance: {
    required: string[];
    inPlace: string[];
    gaps: { risk: string; gapDescription: string; impact: string }[];
  };
}

// --- NEW INTERFACE FOR FINANCIAL MODEL ---
export interface FinancialMetric {
  year: number;
  revenue: number; // in millions
  ebitda: number; // in millions
  dscr: number; // Debt Service Coverage Ratio
}

// --- QUANTITATIVE DATA SCHEMA (V1) ---

export interface DegradationData {
    modeledCurve: Array<{ year: number; rate: number }>;
    warrantedCap: Array<{ year: number; rate: number }>;
}

export interface YieldData {
    p50_yield: number;
    p90_yield: number;
    p99_yield: number;
    guaranteedAvailability: number;
}

export interface EfficiencyData {
    nameplateEfficiency: number;
    guaranteedEfficiency: number;

    performanceLdCap: number;
}

export interface QuantitativeTechnicalData {
    technologyType: string;
    degradation: DegradationData;
    yield: YieldData;
    efficiency: EfficiencyData;
    assetUsefulLife: number;
    technologyReadinessLevel: number;
}

export interface QuantitativeFinancialData {
    baseCaseProjectIRR: number;
    p50_DSCR: number;
    dscrCovenant: number;
    lcoe_or_lcoh: number;
    merchantExposure: number;
}

export interface QuantitativeContractualData {
    epcContractType: string;
    offtakeContractType: string;
    offtakeTenor: number;
    insurancePolicyExclusions: string[];
}

export interface QuantitativeCoreData {
    totalCapex: number;
    governingLaw: string;
}

// Updated Project Interface with Quantitative Schema
export interface Project {
  id: string;
  name: string;
  description: string;
  
  // NEW PROJECT CONTEXT
  developerName?: string;
  stage?: string; // e.g. "Ready to Build", "Feasibility"
  financingStatus?: string; // e.g. "Raising $50M Equity"

  quantitativeCore: QuantitativeCoreData;
  quantitativeTechnical: QuantitativeTechnicalData;
  quantitativeFinancial: QuantitativeFinancialData;
  quantitativeContractual: QuantitativeContractualData;
  
  pillars: Pillar[];
  riskVectors: RiskVector[]; // Formerly redFlags
  bankabilityScorecard: BankabilityScorecard;
  documentGapAnalysis: DocumentGap[];

  // New outputs from the quantitative engine
  sevenPillarsAnalysis?: PillarAnalysis[];
  dealStructureSuggestion?: DealStructureSuggestion;
  deepAnalysis?: DeepAnalysis;
  financials?: FinancialMetric[]; // NEW FINANCIAL MODEL DATA
}

export interface UploadedFile {
  id: string;
  name: string;
  status: 'processing' | 'complete' | 'error';
}

export interface ChatMessage {
    id:string;
    sender: 'user' | 'ai';
    text: string;
    sources?: string[];
}