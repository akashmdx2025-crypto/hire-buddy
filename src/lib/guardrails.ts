// source_handbook: week11-hackathon-preparation

import { GuardrailResult } from './types';

// 1. Relevance check — is the query related to the uploaded JD?
export function checkRelevance(similarityScore: number): GuardrailResult {
  if (similarityScore < 0.3) {
    return {
      passed: false,
      reason: "Your question doesn't seem related to the uploaded job description. Try asking something about the role's requirements or skills.",
      type: 'relevance'
    };
  }
  return { passed: true, type: 'relevance' };
}

// 2. Input sanitization — block prompt injection attempts
export function checkInputSafety(input: string): GuardrailResult {
  const blockedPatterns = [
    /ignore previous instructions/i,
    /forget your rules/i,
    /you are now/i,
    /act as if/i,
    /pretend you/i,
    /override/i,
    /jailbreak/i,
    /disregard/i,
    /new persona/i,
    /system prompt/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(input)) {
      return {
        passed: false,
        reason: "This input was flagged by our safety system. Please rephrase your question about the interview.",
        type: 'safety'
      };
    }
  }
  return { passed: true, type: 'safety' };
}

// 3. Scope check — is this about interview prep?
export function checkScope(input: string): GuardrailResult {
  const offTopicPatterns = [
    /write me a (poem|song|story|essay)/i,
    /what is the (weather|time|date)/i,
    /tell me a joke/i,
    /play a game/i,
    /translate .+ to/i,
    /write code for/i,
    /help me with my (homework|assignment)/i,
  ];

  for (const pattern of offTopicPatterns) {
    if (pattern.test(input)) {
      return {
        passed: false,
        reason: "I'm your interview prep coach — let's stay focused on preparing you for this role! What would you like to practice?",
        type: 'scope'
      };
    }
  }
  return { passed: true, type: 'scope' };
}

// 4. Output grounding — check AI response stays grounded in JD
export function checkOutputGrounding(response: string, chunks: string[]): GuardrailResult {
  const responseWords = new Set(response.toLowerCase().split(/\s+/));
  const chunkWords = new Set(chunks.join(' ').toLowerCase().split(/\s+/));
  
  // Filter for meaningful words (length > 4) and check overlap
  const meaningfulWords = [...responseWords].filter(w => w.length > 4);
  const overlap = meaningfulWords.filter(w => chunkWords.has(w));

  // If less than 10% of meaningful words overlap, or less than a small threshold
  if (meaningfulWords.length > 10 && overlap.length < meaningfulWords.length * 0.1) {
    return {
      passed: false,
      reason: "The AI response may not be well-grounded in the job description context.",
      type: 'grounding'
    };
  }
  return { passed: true, type: 'grounding' };
}

// Run all guardrails
export function runAllGuardrails(
  input: string,
  similarityScore: number,
  chunks: string[]
): { passed: boolean; results: GuardrailResult[] } {
  const safety = checkInputSafety(input);
  const scope = checkScope(input);
  const relevance = checkRelevance(similarityScore);
  
  const results = [safety, scope, relevance];
  const passed = results.every(r => r.passed);
  
  return { passed, results };
}
