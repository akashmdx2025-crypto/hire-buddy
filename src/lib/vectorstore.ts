// source_handbook: week11-hackathon-preparation

import { VectorEntry } from './types';

class InMemoryVectorStore {
  private entries: VectorEntry[] = [];

  add(entries: VectorEntry[]) {
    this.entries.push(...entries);
  }

  search(queryEmbedding: number[], topK: number = 3): { entry: VectorEntry; score: number }[] {
    if (this.entries.length === 0) return [];

    return this.entries
      .map(entry => ({
        entry,
        score: this.cosineSimilarity(queryEmbedding, entry.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dot / magnitude;
  }

  clear() {
    this.entries = [];
  }

  get size() {
    return this.entries.length;
  }
}

export const vectorStore = new InMemoryVectorStore();
