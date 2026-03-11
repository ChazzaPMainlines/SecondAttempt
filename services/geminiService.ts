
import { GoogleGenAI } from "@google/genai";
import { Project, ChatMessage, PillarCategory } from '../types';

// This is a placeholder for the actual API key which would be set in an environment variable.
const API_KEY = process.env.API_KEY;

// NOTE: In a real application, the GoogleGenAI instance would be initialized once.
// We are simulating its usage here. For this mock, we won't actually make API calls.
// const ai = new GoogleGenAI({ apiKey: API_KEY });

const MOCK_LATENCY = (min = 1000, max = 2500) => new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));


// Simulate answering a query based on project context
export const queryProject = async (query: string, project: Project): Promise<ChatMessage> => {
  console.log(`Simulating Gemini query: "${query}"`);
  await MOCK_LATENCY(1500, 3000);

  // In a real implementation, this would send the query and a summarized
  // version of the project's quantitative data to Gemini.
  const context = `
    Project: ${project.name}. 
    Description: ${project.description}.
    Data: ${JSON.stringify({ core: project.quantitativeCore, tech: project.quantitativeTechnical, fin: project.quantitativeFinancial })}
    Risk Vectors: ${JSON.stringify(project.riskVectors)}
  `;

  // Mock responses based on keywords in the query
  let responseText = "I am processing the data to answer your query. ";
  if (query.toLowerCase().includes("degradation")) {
      const modeled = project.quantitativeTechnical.degradation.modeledCurve.find(p => p.year === 5)?.rate || 0;
      const warranted = project.quantitativeTechnical.degradation.warrantedCap.find(p => p.year === 5)?.rate || 0;
      responseText = `In year 5, the modeled degradation is ${modeled * 100}%, which is within the warranted cap of ${warranted * 100}%. This indicates the performance warranty provides adequate coverage for the expected degradation during this period.`;
  } else if (query.toLowerCase().includes("p99")) {
       responseText = `The P99 yield estimate is ${project.quantitativeTechnical.yield.p99_yield.toLocaleString()} units. Our analysis indicates that under this low-resource scenario, the project's DSCR would be close to the covenant, representing a key risk during commissioning.`;
  } else if (query.toLowerCase().includes("offtake")) {
      const offtakePillar = project.pillars.find(p => p.category === PillarCategory.MARKET);
      responseText = offtakePillar?.summary || "Offtake information is being analyzed.";
  } else {
      responseText = "I have analyzed the provided documents and can confirm the project's financial viability appears to be within acceptable parameters for this asset class. Please ask a more specific question for detailed insights."
  }
  
  return {
    id: `ai-msg-${Date.now()}`,
    sender: 'ai',
    text: responseText,
    sources: ['Project Overview.pdf', 'Financial Model.xlsx'],
  };
};