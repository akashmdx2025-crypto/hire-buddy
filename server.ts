// source_handbook: week11-hackathon-preparation

import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { GoogleGenAI, Type } from '@google/genai';
import { chunkDocument } from './src/lib/chunker.js';
import { vectorStore } from './src/lib/vectorstore.js';
import { logAICall, getLogs, getLogStats } from './src/lib/logger.js';
import { runAllGuardrails, checkOutputGrounding } from './src/lib/guardrails.js';
import { SYSTEM_PROMPTS } from './src/lib/prompts.js';
import { JDAnalysis, Question, EvaluationResult } from './src/lib/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize AI
const apiKey = (process.env.GEMINI_API_KEY || '').trim();
if (!apiKey) {
  console.warn('CRITICAL: GEMINI_API_KEY is missing.');
} else {
  console.log(`Using API Key starting with: ${apiKey.substring(0, 7)}... (Length: ${apiKey.length})`);
}

const ai = new GoogleGenAI({ apiKey });
const DEFAULT_MODEL = "gemini-3-flash-preview";
const EMBEDDING_MODEL = "gemini-embedding-2-preview";

// Global state for simplicity in hackathon demo
let currentJDText = "";
let currentJDAnalysis: JDAnalysis | null = null;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  const PORT = 3000;

  // Helper for embeddings
  const getEmbedding = async (text: string) => {
    const result = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: [{ parts: [{ text }] }],
    });
    return result.embeddings[0].values;
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    const key = process.env.GEMINI_API_KEY;
    res.json({ 
      status: 'ok', 
      keyPresent: !!key,
      keyLength: key ? key.length : 0,
      keyPrefix: key ? key.substring(0, 4) : null
    });
  });

  app.post('/api/upload', async (req, res) => {
    const startTime = Date.now();
    try {
      const { text, type } = req.body;
      let rawText = text;

      // Handle PDF (if sent as base64 or similar)
      // In this demo, we'll assume the frontend sends text for simplicity or we handle PDF buffers if needed.
      // If frontend sends base64 PDF:
      if (type === 'application/pdf') {
        const buffer = Buffer.from(text, 'base64');
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        rawText = result.text;
      }

      currentJDText = rawText;
      const chunks = chunkDocument(rawText);
      vectorStore.clear();

      // Batch generate embeddings
      const entries = await Promise.all(chunks.map(async (chunk) => {
        const embedding = await getEmbedding(chunk.text);
        return {
          id: Math.random().toString(36).substring(2, 11),
          text: chunk.text,
          embedding,
          metadata: {
            chunkIndex: chunk.index,
            startChar: chunk.startChar,
            endChar: chunk.endChar,
            source: 'uploaded_jd'
          }
        };
      }));

      vectorStore.add(entries);

      // Perform JD Analysis
      const analysisResponse = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: `Analyze this JD: ${rawText.substring(0, 5000)}`,
        config: {
          systemInstruction: SYSTEM_PROMPTS.JD_ANALYSIS,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roleTitle: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experienceLevel: { type: Type.STRING },
              responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING }
            },
            required: ["roleTitle", "skills", "experienceLevel", "responsibilities", "summary"]
          }
        }
      });

      const analysisRaw = analysisResponse.text || "{}";
      currentJDAnalysis = JSON.parse(analysisRaw);

      logAICall({
        action: 'jd-analysis',
        model: DEFAULT_MODEL,
        promptTokens: 0, // In real world we'd get these from response
        completionTokens: 0,
        totalTokens: 0,
        latencyMs: Date.now() - startTime,
        guardrailsPassed: true
      });

      res.json({
        success: true,
        chunkCount: chunks.length,
        analysis: currentJDAnalysis
      });
    } catch (error: any) {
      console.error('--- AI ERROR ---');
      console.error(error);
      if (error.response) console.error('Response Data:', JSON.stringify(error.response, null, 2));
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/generate-questions', async (req, res) => {
    const startTime = Date.now();
    try {
      const { category, difficulty, count } = req.body;
      
      // Get relevant context (first few chunks usually good for overall feeling, or random/top)
      const contextDocs = vectorStore.search(await getEmbedding(category || "general"), 5);
      const contextText = contextDocs.map(d => d.entry.text).join("\n---\n");

      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: `Generate ${count || 5} ${category || ''} questions at ${difficulty || 'mid'} difficulty based on this JD:\n${contextText}`,
        config: {
          systemInstruction: SYSTEM_PROMPTS.GENERATE_QUESTIONS,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.NUMBER },
                    question: { type: Type.STRING },
                    category: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                    targetedRequirement: { type: Type.STRING },
                    sampleFramework: { type: Type.STRING }
                  },
                  required: ["id", "question", "category", "difficulty", "targetedRequirement", "sampleFramework"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });

      logAICall({
        action: 'generate-questions',
        model: DEFAULT_MODEL,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs: Date.now() - startTime,
        guardrailsPassed: true
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/evaluate-answer', async (req, res) => {
    const startTime = Date.now();
    try {
      const { question, answer } = req.body;
      
      // Semantic search for context related to the answer
      const embedding = await getEmbedding(answer);
      const contextDocs = vectorStore.search(embedding, 3);
      const contextText = contextDocs.map(d => d.entry.text).join("\n---\n");

      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: `Question: ${question}\nAnswer: ${answer}\nContext: ${contextText}`,
        config: {
          systemInstruction: SYSTEM_PROMPTS.EVALUATE_ANSWER,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER },
              breakdown: {
                type: Type.OBJECT,
                properties: {
                  relevance: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING } } },
                  depth: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING } } },
                  structure: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING } } },
                  communication: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, comment: { type: Type.STRING } } }
                }
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedAnswer: { type: Type.STRING }
            }
          }
        }
      });

      const result = JSON.parse(response.text || "{}");

      logAICall({
        action: 'evaluate-answer',
        model: DEFAULT_MODEL,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs: Date.now() - startTime,
        guardrailsPassed: true,
        qualityScore: result.overallScore
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/chat', async (req, res) => {
    const startTime = Date.now();
    try {
      const { message } = req.body;

      const queryEmbedding = await getEmbedding(message);
      const searchResults = vectorStore.search(queryEmbedding, 3);
      const context = searchResults.map(r => r.entry.text).join("\n---\n");
      const bestScore = searchResults.length > 0 ? searchResults[0].score : 0;

      // Run Guardrails
      const guardrailCheck = runAllGuardrails(message, bestScore, searchResults.map(r => r.entry.text));
      if (!guardrailCheck.passed) {
        const failedReason = guardrailCheck.results.find(r => !r.passed)?.reason;
        
        logAICall({
          action: 'chat',
          model: DEFAULT_MODEL,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          latencyMs: Date.now() - startTime,
          guardrailsPassed: false,
          guardrailDetails: failedReason,
          similarityScore: bestScore
        });

        return res.json({ 
          text: failedReason,
          sources: [] 
        });
      }

      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: `User: ${message}\nContext: ${context}`,
        config: {
          systemInstruction: SYSTEM_PROMPTS.COACH_CHAT
        }
      });

      const responseText = response.text || "";
      
      // Grounding guardrail (output check)
      const groundingCheck = checkOutputGrounding(responseText, searchResults.map(r => r.entry.text));

      logAICall({
        action: 'chat',
        model: DEFAULT_MODEL,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs: Date.now() - startTime,
        guardrailsPassed: groundingCheck.passed,
        guardrailDetails: groundingCheck.passed ? undefined : groundingCheck.reason,
        similarityScore: bestScore
      });

      res.json({
        text: responseText,
        sources: searchResults.map(r => r.entry.text.substring(0, 100) + '...'),
        groundingWarning: !groundingCheck.passed ? groundingCheck.reason : null
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/logs', (req, res) => {
    res.json({
      logs: getLogs(),
      stats: getLogStats()
    });
  });

  app.post('/api/generate-tips', async (req, res) => {
    const startTime = Date.now();
    try {
      const chunks = vectorStore.search(await getEmbedding("interview tips"), 5);
      const context = chunks.map(c => c.entry.text).join("\n---\n");

      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: context,
        config: {
          systemInstruction: SYSTEM_PROMPTS.GENERATE_TIPS,
          responseMimeType: "application/json"
        }
      });

      logAICall({
        action: 'generate-tips',
        model: DEFAULT_MODEL,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs: Date.now() - startTime,
        guardrailsPassed: true
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
