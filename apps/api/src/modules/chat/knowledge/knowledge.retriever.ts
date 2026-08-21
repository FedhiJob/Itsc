import type { KnowledgeBase, KnowledgeChunk, TrainingCategory, CourseInfo } from './knowledge.types.js';
import { loadKnowledge } from './knowledge.loader.js';

export async function retrieveKnowledge(query: string): Promise<KnowledgeChunk[]> {
  const knowledge = await loadKnowledge();
  const normalizedQuery = query.toLowerCase().trim();
  const chunks: KnowledgeChunk[] = [];

  // Check for organization information
  if (matchesQuery(normalizedQuery, ['what is itsc', 'about itsc', 'tell me about itsc', 'company information'])) {
    chunks.push(createChunk('org-info', `${knowledge.organization.name} - ${knowledge.organization.description} Founded in ${knowledge.organization.founded}. Location: ${knowledge.organization.location.address}. Contact: ${knowledge.organization.contact.email}, ${knowledge.organization.contact.phone.join(', ')}.`, 'Organization', 'Company Overview'));
  }

  // Check for contact information
  if (matchesQuery(normalizedQuery, ['contact', 'phone', 'email', 'address', 'location', 'where is', 'how to contact'])) {
    chunks.push(createChunk('contact-info', `Email: ${knowledge.organization.contact.email}. Phone: ${knowledge.organization.contact.phone.join(', ')}. Address: ${knowledge.organization.location.address}, ${knowledge.organization.location.city}, ${knowledge.organization.location.country}. Website: ${knowledge.organization.contact.website}`, 'Organization', 'Contact'));
  }

  // Check for mission and vision
  if (matchesQuery(normalizedQuery, ['mission', 'vision', 'values', 'core values'])) {
    chunks.push(createChunk('mission-vision', `Mission: ${knowledge.mission}. Vision: ${knowledge.vision}. Core Values: ${knowledge.coreValues.join(', ')}.`, 'Organization', 'Mission & Vision'));
  }

  // Check for services
  if (matchesQuery(normalizedQuery, ['services', 'what do you offer', 'what does itsc do'])) {
    const servicesText = knowledge.services.map(s => `${s.name}: ${s.description}`).join('. ');
    chunks.push(createChunk('services', servicesText, 'Services', 'Service Offerings'));
  }

  // Check for training programs
  if (matchesQuery(normalizedQuery, ['training', 'courses', 'programs', 'certification', 'what courses', 'what training', 'offer'])) {
    const category = findRelevantCategory(normalizedQuery, knowledge.trainingCategories);
    if (category) {
      const coursesText = category.courses.map(c => `${c.name} (${c.duration})`).join('. ');
      chunks.push(createChunk(`training-${category.name}`, `ITSC offers the following ${category.name} courses: ${coursesText}.`, 'Training', category.name));
    } else {
      const categoriesList = knowledge.trainingCategories.map(c => c.name).join(', ');
      chunks.push(createChunk('training-overview', `ITSC offers training in the following categories: ${categoriesList}. Each category includes multiple courses with durations typically ranging from 2-5 days.`, 'Training', 'Overview'));
    }
  }

  // Check for specific course
  const specificCourse = findSpecificCourse(normalizedQuery, knowledge.trainingCategories);
  if (specificCourse) {
    chunks.push(createChunk(`course-${specificCourse.course.name}`, `${specificCourse.course.name} - Duration: ${specificCourse.course.duration}. Category: ${specificCourse.category.name}.`, 'Training', specificCourse.category.name));
  }

  // Check for partnerships
  if (matchesQuery(normalizedQuery, ['partners', 'partnerships', 'certifications', 'accredited', 'authorized'])) {
    const partnershipsText = knowledge.partnerships.map(p => `${p.partner} (${p.type}): ${p.details}`).join('. ');
    chunks.push(createChunk('partnerships', partnershipsText, 'Partnerships', 'Partners & Certifications'));
  }

  // Check for corporate training
  if (matchesQuery(normalizedQuery, ['corporate training', 'company training', 'organization training', 'customized training'])) {
    const corporateService = knowledge.services.find(s => s.name.toLowerCase().includes('corporate'));
    if (corporateService) {
      chunks.push(createChunk('corporate-training', `ITSC provides corporate training services: ${corporateService.description}`, 'Services', 'Corporate Training'));
    }
  }

  // If no specific match, return general information
  if (chunks.length === 0) {
    chunks.push(createChunk('general', `ITSC PLC is a leading IT training and certification provider in Ethiopia, founded in 1999. We offer a wide range of courses including CompTIA, Microsoft, Cisco, Oracle, EC-Council, and many more. For specific inquiries, please contact us at ${knowledge.organization.contact.email}.`, 'Organization', 'General Information'));
  }

  return chunks.slice(0, 5);
}

function createChunk(id: string, content: string, source: string, section?: string): KnowledgeChunk {
  return { id, content, source, section };
}

function matchesQuery(query: string, keywords: string[]): boolean {
  return keywords.some(keyword => query.includes(keyword));
}

function findRelevantCategory(query: string, categories: TrainingCategory[]): TrainingCategory | null {
  for (const category of categories) {
    const categoryName = category.name.toLowerCase();
    if (query.includes(categoryName)) return category;
    if ((categoryName.includes('comptia') && query.includes('comptia')) ||
        (categoryName.includes('microsoft') && query.includes('microsoft')) ||
        (categoryName.includes('cisco') && query.includes('cisco')) ||
        (categoryName.includes('oracle') && query.includes('oracle')) ||
        (categoryName.includes('ec-council') && (query.includes('ec-council') || query.includes('ethical hacker') || query.includes('ceh'))) ||
        (categoryName.includes('programming') && (query.includes('python') || query.includes('java') || query.includes('c++') || query.includes('web development')))) {
      return category;
    }
  }
  return null;
}

function findSpecificCourse(query: string, categories: TrainingCategory[]): { category: TrainingCategory; course: CourseInfo } | null {
  for (const category of categories) {
    for (const course of category.courses) {
      const courseName = course.name.toLowerCase();
      if (query.includes(courseName)) return { category, course };
      if (courseName.includes('+') && query.includes((courseName.split('+')[0] || '').toLowerCase())) {
        return { category, course };
      }
    }
  }
  return null;
}