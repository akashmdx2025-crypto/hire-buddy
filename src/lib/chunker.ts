// source_handbook: week11-hackathon-preparation

import { Chunk } from './types';

export function chunkDocument(
  text: string,
  maxTokens: number = 500,
  overlapTokens: number = 50
): Chunk[] {
  const words = text.split(/\s+/);
  const chunks: Chunk[] = [];
  const wordsPerChunk = Math.floor(maxTokens * 0.75); // rough token-to-word ratio
  const overlapWords = Math.floor(overlapTokens * 0.75);

  let startWord = 0;
  let charOffset = 0;

  while (startWord < words.length) {
    const endWord = Math.min(startWord + wordsPerChunk, words.length);
    const chunkWords = words.slice(startWord, endWord);
    const chunkText = chunkWords.join(' ');

    // Find actual index in original text for better mapping
    const startChar = text.indexOf(chunkWords[0], charOffset);
    const endChar = startChar + chunkText.length;

    chunks.push({
      text: chunkText,
      index: chunks.length,
      startChar,
      endChar,
    });

    charOffset = Math.max(0, startChar + 1);
    startWord = endWord - overlapWords;
    if (startWord >= words.length) break;
    if (endWord === words.length) break;
    if (startWord < 0) startWord = 0;
    
    // Safety break for infinite loops if logic fails
    if (chunks.length > 1000) break;
  }

  return chunks;
}
