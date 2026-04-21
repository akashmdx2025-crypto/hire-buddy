// source_handbook: week11-hackathon-preparation

export interface Chunk {
  text: string;
  index: number;
  startChar: number;
  endChar: number;
}

export interface VectorEntry {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    chunkIndex: number;
    startChar: number;
    endChar: number;
    source: string;
  };
}

export interface JDAnalysis {
  roleTitle: string;
  skills: string[];
  experienceLevel: string;
  responsibilities: string[];
  summary: string;
}

export interface Question {
  id: number;
  question: string;
  category: 'behavioral' | 'technical' | 'situational';
  difficulty: 'entry' | 'mid' | 'senior';
  targetedRequirement: string;
  sampleFramework: string;
}

export interface EvaluationResult {
  overallScore: number;
  breakdown: {
    relevance: { score: number; comment: string };
    depth: { score: number; comment: string };
    structure: { score: number; comment: string };
    communication: { score: number; comment: string };
  };
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

export interface AILogEntry {
  id: string;
  timestamp: string;
  action: 'generate-questions' | 'evaluate-answer' | 'chat' | 'generate-tips' | 'jd-analysis' | 'mock-summary';
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  guardrailsPassed: boolean;
  guardrailDetails?: string;
  similarityScore?: number;
  qualityScore?: number;
  metadata?: Record<string, any>;
}

export interface GuardrailResult {
  passed: boolean;
  reason?: string;
  type: 'relevance' | 'safety' | 'scope' | 'grounding';
}
