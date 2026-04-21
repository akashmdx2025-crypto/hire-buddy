// source_handbook: week11-hackathon-preparation

import { AILogEntry } from './types';

const logs: AILogEntry[] = [];

export function logAICall(entry: Omit<AILogEntry, 'id' | 'timestamp'>): AILogEntry {
  const fullEntry: AILogEntry = {
    ...entry,
    id: Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
  };
  logs.push(fullEntry);
  console.log(`[AI LOG] ${fullEntry.action} | ${fullEntry.totalTokens} tokens | ${fullEntry.latencyMs}ms | guardrails: ${fullEntry.guardrailsPassed}`);
  return fullEntry;
}

export function getLogs(): AILogEntry[] {
  return [...logs].reverse();
}

export function getLogStats() {
  return {
    totalCalls: logs.length,
    totalTokens: logs.reduce((sum, l) => sum + l.totalTokens, 0),
    avgLatency: logs.length ? Math.round(logs.reduce((sum, l) => sum + l.latencyMs, 0) / logs.length) : 0,
    guardrailBlockRate: logs.length ? Math.round((logs.filter(l => !l.guardrailsPassed).length / logs.length) * 100) : 0,
    byAction: logs.reduce((acc, l) => { 
      acc[l.action] = (acc[l.action] || 0) + 1; 
      return acc; 
    }, {} as Record<string, number>),
  };
}
