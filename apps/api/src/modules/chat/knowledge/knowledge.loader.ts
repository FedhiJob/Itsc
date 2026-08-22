import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { KnowledgeBase } from './knowledge.types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Candidate locations, tried in order: compiled output lives at
// dist/src/modules/chat/knowledge (5 levels up to apps/api), tsx runs from
// src/ (4 levels up). cwd-relative covers both when started from apps/api.
const KNOWLEDGE_CANDIDATES = [
  path.resolve(process.cwd(), 'data/knowledge.json'),
  path.resolve(__dirname, '../../../../../data/knowledge.json'),
  path.resolve(__dirname, '../../../../data/knowledge.json')
];

let knowledgeCache: KnowledgeBase | null = null;

export async function loadKnowledge(): Promise<KnowledgeBase> {
  if (knowledgeCache) {
    return knowledgeCache;
  }

  try {
    let data: string | null = null;
    for (const candidate of KNOWLEDGE_CANDIDATES) {
      try {
        data = await fs.readFile(candidate, 'utf-8');
        break;
      } catch {
        // Try the next candidate location.
      }
    }

    if (!data) {
      throw new Error(
        `knowledge.json not found. Tried: ${KNOWLEDGE_CANDIDATES.join(', ')}`
      );
    }

    knowledgeCache = JSON.parse(data) as KnowledgeBase;
    return knowledgeCache;
  } catch (error) {
    console.error(
      'Failed to load knowledge base:',
      error instanceof Error ? error.message : error
    );
    throw new Error('Knowledge base unavailable');
  }
}

export function clearKnowledgeCache(): void {
  knowledgeCache = null;
}