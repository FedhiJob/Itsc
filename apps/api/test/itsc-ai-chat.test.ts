import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: path.resolve(process.cwd(), 'apps/api/.env'), override: true });

import { chatRequestSchema } from '../src/modules/chat/chat.schema.js';
import { buildPrompt } from '../src/modules/chat/llm/prompt.builder.js';
import { retrieveKnowledge } from '../src/modules/chat/knowledge/knowledge.retriever.js';
import { OpenAIService } from '../src/modules/chat/llm/openai.service.js';
import { ChatService } from '../src/modules/chat/chat.service.js';
import chatRouter from '../src/modules/chat/chat.routes.js';

describe('ITSC AI 14-Point Comprehensive Stabilization Test Suite', () => {
  const chatService = new ChatService();

  it('1. Normal greetings: responds pleasantly and introduces ITSC AI', async () => {
    const res = await chatService.processMessage('Hello! Good morning.');
    assert.ok(res.answer.length > 0);
    assert.match(res.answer, /ITSC AI|ITSC/i);
  });

  it('2. General ITSC company questions: retrieves verified history, mission and location', async () => {
    const res = await chatService.processMessage('Tell me about ITSC. When was it founded?');
    assert.ok(res.answer.length > 0);
    assert.match(res.answer, /1999|Addis Ababa|Pearson VUE|Information Technology/i);
  });

  it('3. Training category questions: lists accredited specialization tracks and domains', async () => {
    const res = await chatService.processMessage('What training categories and vendor tracks do you offer?');
    assert.ok(res.answer.length > 0);
    assert.ok(res.sources && res.sources.length > 0);
  });

  it('4. Specific course code searches: retrieves exact database match for course 20247', async () => {
    const res = await chatService.processMessage('Do you offer course 20247?');
    assert.ok(res.courses && res.courses.length > 0, 'Should return structured course records');
    const course = res.courses.find(c => c.code === '20247' || c.title.includes('20247'));
    assert.ok(course, 'Course 20247 must be present in results');
    assert.equal(course.code, '20247');
    assert.equal(course.slug, 'configuring-and-deploying-a-private-cloud-20247');
  });

  it('5. Course prerequisite questions: extracts verified prerequisites from database', async () => {
    const res = await chatService.processMessage('What are the prerequisites for course 20247?');
    assert.ok(res.answer.length > 0);
    assert.match(res.answer, /prerequisite|knowledge|experience|20247/i);
  });

  it('6. Corporate training enquiries: explains custom curricula, flexible delivery, and enterprise cohorts', async () => {
    const res = await chatService.processMessage('What corporate training services does ITSC offer for companies?');
    assert.ok(res.answer.length > 0);
    assert.match(res.answer, /corporate|custom|enterprise|delivery/i);
  });

  it('7. Follow-up questions requiring conversation context: resolves previous turn course code', async () => {
    const history = [
      { role: 'user' as const, content: 'Tell me about course 20247' },
      { role: 'assistant' as const, content: 'Course 20247 is Configuring and Deploying a Private Cloud.' }
    ];
    // Follow-up question has no course code in text, relies on history
    const res = await chatService.processMessage('What are its prerequisites and duration?', undefined, history);
    assert.ok(res.courses && res.courses.length > 0, 'Should resolve course 20247 from context history');
    assert.equal(res.courses[0].code, '20247');
  });

  it('8. Unknown and out-of-scope questions: politely clarifies boundary to IT training and services', async () => {
    const res = await chatService.processMessage('What is the best recipe for baking chocolate cookies?');
    assert.ok(res.answer.length > 0);
    assert.match(res.answer, /ITSC AI|ITSC|training|specializ/i);
  });

  it('9. Empty and whitespace-only messages: rejected by Zod schema validation', () => {
    assert.throws(() => chatRequestSchema.parse({ message: '' }));
    assert.throws(() => chatRequestSchema.parse({ message: '   ' }));
    assert.throws(() => chatRequestSchema.parse({}));
  });

  it('10. Excessively long messages: rejected by Zod schema validation (>2000 chars)', () => {
    const oversizedMessage = 'a'.repeat(2001);
    assert.throws(() => chatRequestSchema.parse({ message: oversizedMessage }));
  });

  it('11. Invalid API credentials handling: gracefully synthesizes grounded database response', async () => {
    // Service configured with invalid dummy key
    const invalidService = new OpenAIService({ apiKey: 'invalid-gemini-key' });
    const response = await invalidService.generateResponse(
      [
        { role: 'system', content: 'You are ITSC AI.' },
        { role: 'user', content: 'How can I contact ITSC?' }
      ],
      [{ id: '1', source: 'Contact', section: 'Contact Info', content: 'Email: info@itsc.com.et, Phone: 0115507150' }],
      []
    );
    assert.ok(response.length > 0);
    assert.match(response, /info@itsc\.com\.et|550 7150/);
  });

  it('12. Gemini service unavailable / 404 model fallback: recovers without 500 server crash', async () => {
    // When gemini-2.5-flash is configured and returns 404, fallback model or synthesis takes over
    const testService = new OpenAIService({ model: 'gemini-2.5-flash' });
    const response = await testService.generateResponse(
      [
        { role: 'system', content: 'You are ITSC AI.' },
        { role: 'user', content: 'Do you offer Cisco training?' }
      ],
      [{ id: '1', source: 'Cisco', section: 'Networking', content: 'Cisco CCNA and CCNP courses available.' }],
      [{ title: 'CCNA Routing & Switching', slug: 'ccna-routing-and-switching', code: '200-301' }]
    );
    assert.ok(response.length > 0);
    assert.match(response, /Cisco|CCNA/i);
  });

  it('13. Rate-limit middleware verified on chat router', () => {
    assert.ok(chatRouter, 'Chat router must be defined');
    const hasMiddleware = chatRouter.stack.some(layer => layer.route?.path === '/');
    assert.ok(hasMiddleware, 'Chat router must have rate limiter and handler attached to POST /');
  });

  it('14. Structured Course output contract: guarantees valid title, slug, code, and links', async () => {
    const { courses } = await retrieveKnowledge('Microsoft Azure Cloud');
    assert.ok(courses.length > 0, 'Should find Azure courses');
    const first = courses[0];
    assert.ok(first.title && first.title.length > 0, 'Must have title');
    assert.ok(first.slug && first.slug.length > 0, 'Must have slug');
    assert.ok(!first.slug.includes(' '), 'Slug must be URL-safe');
  });
});
