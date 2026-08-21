import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { KnowledgeBase } from './knowledge.types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_FILE = path.resolve(__dirname, '../../../../data/knowledge.json');

let knowledgeCache: KnowledgeBase | null = null;

export async function loadKnowledge(): Promise<KnowledgeBase> {
  if (knowledgeCache) {
    return knowledgeCache;
  }

  try {
    const data = await fs.readFile(KNOWLEDGE_FILE, 'utf-8');
    knowledgeCache = JSON.parse(data) as KnowledgeBase;
    return knowledgeCache;
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
    throw new Error('Knowledge base unavailable');
  }
}

export function clearKnowledgeCache(): void {
  knowledgeCache = null;
}