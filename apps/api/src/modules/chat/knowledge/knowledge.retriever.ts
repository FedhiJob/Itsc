import { prisma } from '../../../lib/prisma.js';
import type { KnowledgeChunk, KnowledgeRetrievalResult } from './knowledge.types.js';
import type { ChatMessage, StructuredCourse } from '../chat.types.js';
import { loadKnowledge } from './knowledge.loader.js';

interface DBProgramWithCategory {
  id: string;
  title: string;
  slug: string;
  code: string | null;
  duration: string | null;
  deliveryMode: string | null;
  level: string | null;
  shortDescription: string;
  fullDescription?: string;
  objectives: string[];
  prerequisites: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export async function retrieveKnowledge(
  query: string,
  conversationHistory?: ChatMessage[]
): Promise<KnowledgeRetrievalResult> {
  const normalizedQuery = query.toLowerCase().trim();
  const chunks: KnowledgeChunk[] = [];
  const courses: StructuredCourse[] = [];

  try {
    // 1. Check for specific Course Code extraction
    // Regex for codes like "AZ-104", "350-401", "SY0-701", "20246", "MS-900", "CEH", "CCNA", "FDB101"
    let codeMatch = query.match(/\b([a-zA-Z]{1,4}-\d{2,4}|\d{5}|[a-zA-Z]{2,6}\d{2,4})\b/i);

    // If no course code in the query, check recent conversation history for follow-up context
    if (!codeMatch && conversationHistory && conversationHistory.length > 0) {
      const recentTurns = conversationHistory.slice(-4);
      for (let i = recentTurns.length - 1; i >= 0; i--) {
        const turn = recentTurns[i];
        if (turn) {
          const match = turn.content.match(/\b([a-zA-Z]{1,4}-\d{2,4}|\d{5}|[a-zA-Z]{2,6}\d{2,4})\b/i);
          if (match) {
            codeMatch = match;
            break;
          }
        }
      }
    }

    const extractedCode = codeMatch ? codeMatch[0] : null;

    let matchedPrograms: DBProgramWithCategory[] = [];

    if (extractedCode) {
      matchedPrograms = await prisma.trainingProgram.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
          OR: [
            { code: { equals: extractedCode, mode: 'insensitive' } },
            { code: { contains: extractedCode, mode: 'insensitive' } },
            { title: { contains: extractedCode, mode: 'insensitive' } }
          ]
        },
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          }
        },
        take: 6
      });
    }

    // 2. Keyword & Vendor / Category search in database
    const vendors = ['microsoft', 'cisco', 'comptia', 'oracle', 'red hat', 'ec-council', 'aws', 'python', 'database', 'cybersecurity', 'security', 'network', 'cloud', 'linux'];
    const matchedVendor = vendors.find(v => normalizedQuery.includes(v));

    if (matchedPrograms.length === 0 && matchedVendor) {
      matchedPrograms = await prisma.trainingProgram.findMany({
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
          OR: [
            { category: { name: { contains: matchedVendor, mode: 'insensitive' } } },
            { title: { contains: matchedVendor, mode: 'insensitive' } },
            { shortDescription: { contains: matchedVendor, mode: 'insensitive' } }
          ]
        },
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          }
        },
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
        take: 6
      });
    }

    // 3. General title / keyword match if query seems course-related
    const isCourseIntent = matchesAny(normalizedQuery, [
      'training', 'course', 'program', 'certification', 'learn', 'offer', 'classes', 'exam', 'catalog', 'catalogue'
    ]);

    if (matchedPrograms.length === 0 && isCourseIntent) {
      // Extract search words (3+ chars, excluding common stop words)
      const stopWords = new Set(['what', 'does', 'offer', 'have', 'about', 'tell', 'show', 'training', 'courses', 'course', 'program', 'programs', 'with', 'from', 'this', 'that', 'your', 'itsc']);
      const searchWords = normalizedQuery
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 3 && !stopWords.has(w));

      if (searchWords.length > 0) {
        matchedPrograms = await prisma.trainingProgram.findMany({
          where: {
            status: 'PUBLISHED',
            deletedAt: null,
            OR: searchWords.map(word => ({
              OR: [
                { title: { contains: word, mode: 'insensitive' } },
                { shortDescription: { contains: word, mode: 'insensitive' } },
                { code: { contains: word, mode: 'insensitive' } },
                { category: { name: { contains: word, mode: 'insensitive' } } }
              ]
            }))
          },
          include: {
            category: {
              select: { id: true, name: true, slug: true }
            }
          },
          orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
          take: 6
        });
      } else {
        // Broad catalogue overview - fetch representative featured courses
        matchedPrograms = await prisma.trainingProgram.findMany({
          where: { status: 'PUBLISHED', deletedAt: null },
          include: {
            category: {
              select: { id: true, name: true, slug: true }
            }
          },
          orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
          take: 5
        });
      }
    }

    // Convert matched programs to structured courses and knowledge chunks
    if (matchedPrograms.length > 0) {
      for (const prog of matchedPrograms) {
        courses.push({
          title: prog.title,
          slug: prog.slug,
          code: prog.code,
          duration: prog.duration,
          category: prog.category?.name,
          shortDescription: prog.shortDescription,
          objectives: prog.objectives,
          prerequisites: prog.prerequisites
        });

        if (prog.prerequisites && prog.prerequisites.length > 0 && matchesAny(normalizedQuery, ['prereq', 'requirement', 'require', 'needed', 'qualif'])) {
          chunks.push({
            id: `prereq-${prog.id}`,
            source: 'Course Prerequisites',
            section: prog.title,
            content: `Official Prerequisites for ${prog.title} (${prog.code || 'N/A'}): ${prog.prerequisites.join('; ')}.`
          });
        }

        const details = [
          `Course: ${prog.title} (Code: ${prog.code || 'N/A'})`,
          `Category: ${prog.category?.name || 'General IT'}`,
          `Duration: ${prog.duration || 'Flexible'}`,
          prog.deliveryMode ? `Delivery: ${prog.deliveryMode}` : null,
          prog.level ? `Level: ${prog.level}` : null,
          `Summary: ${prog.shortDescription}`,
          prog.objectives && prog.objectives.length > 0 ? `Key Objectives: ${prog.objectives.slice(0, 3).join('; ')}` : null,
          prog.prerequisites && prog.prerequisites.length > 0 ? `Prerequisites: ${prog.prerequisites.slice(0, 2).join('; ')}` : null,
          `Course Link: /training-programs/${prog.slug}`
        ].filter(Boolean).join('. ');

        chunks.push({
          id: `db-course-${prog.id}`,
          source: 'ITSC Course Catalogue',
          section: prog.category?.name || 'Courses',
          content: details
        });
      }
    }

    // 4. Category summary if user asks about categories or general offerings
    if (isCourseIntent || matchesAny(normalizedQuery, ['category', 'categories', 'tracks', 'vendor', 'vendors'])) {
      const categories = await prisma.trainingCategory.findMany({
        where: { parentId: null },
        select: { name: true, slug: true, children: { select: { name: true } } },
        orderBy: { sortOrder: 'asc' },
        take: 8
      });

      if (categories.length > 0) {
        const catSummary = categories
          .map(c => `${c.name}${c.children.length > 0 ? ` (${c.children.map(ch => ch.name).slice(0, 3).join(', ')})` : ''}`)
          .join('; ');
        chunks.push({
          id: 'db-categories-overview',
          source: 'ITSC Course Catalogue',
          section: 'Categories & Specializations',
          content: `ITSC provides over 260 accredited certification and professional training courses across major domains: ${catSummary}. All courses lead to industry-recognized credentials.`
        });
      }
    }

    // 5. Website Settings & CMS Content (Contact, Corporate Training, About, Accreditation)
    const isContactQuery = matchesAny(normalizedQuery, ['contact', 'phone', 'email', 'address', 'location', 'where', 'reach', 'office', 'call']);
    const isAboutQuery = matchesAny(normalizedQuery, ['what is itsc', 'about itsc', 'tell me about itsc', 'company', 'who is', 'history', 'founded', 'mission', 'vision']);
    const isCorporateQuery = matchesAny(normalizedQuery, ['corporate', 'enterprise', 'business', 'customized', 'group', 'company training', 'workforce']);
    const isTestingCenterQuery = matchesAny(normalizedQuery, ['pearson', 'vue', 'testing center', 'test center', 'exam center', 'certification exam']);
    const isPartnersQuery = matchesAny(normalizedQuery, ['partner', 'partners', 'accredited', 'authorized', 'vendor', 'clients']);

    // CMS Priority Chunks: when user asks about contact, about, corporate, or testing
    const priorityChunks: KnowledgeChunk[] = [];

    if (isContactQuery || isAboutQuery || isCorporateQuery || isTestingCenterQuery || isPartnersQuery || chunks.length === 0) {
      const settings = await prisma.websiteSetting.findMany({
        where: {
          key: {
            in: ['site_config', 'homepage_content', 'about_content', 'corporate_content']
          }
        }
      });

      const settingsMap = new Map(settings.map(s => [s.key, s.value as Record<string, any>]));
      const siteConfig = settingsMap.get('site_config') || {};
      const corporateContent = settingsMap.get('corporate_content') || {};
      const aboutContent = settingsMap.get('about_content') || {};

      if (isContactQuery || chunks.length === 0) {
        const address = siteConfig.address || 'Bole, Behind DH Geda Tower, Addis Ababa, Ethiopia';
        const phone = siteConfig.phone || '+251 11 550 7150 / +251 91 120 4444';
        const email = siteConfig.email || 'info@itsc.com.et';
        const hours = siteConfig.workingHours || 'Monday - Friday: 8:30 AM - 5:30 PM, Saturday: 8:30 AM - 12:30 PM';
        priorityChunks.push({
          id: 'cms-contact-info',
          source: 'ITSC Contact Information',
          section: 'Contact & Location',
          content: `ITSC Office Location: ${address}. Phone: ${phone}. Email: ${email}. Working Hours: ${hours}. Website: https://itsc.com.et. Visitors are welcome to visit our training center in person or reach out via phone/email.`
        });
      }

      if (isCorporateQuery || chunks.length === 0) {
        const corpHeading = corporateContent.headline || 'Custom Corporate & Enterprise Training Solutions';
        const corpDesc = corporateContent.description || 'ITSC delivers tailored corporate IT training programs designed to upskill technical teams, improve operational performance, and support organizational digital transformation. Training can be conducted on-site at client premises, at ITSC fully equipped facilities, or via live virtual instructor-led sessions.';
        priorityChunks.push({
          id: 'cms-corporate-training',
          source: 'ITSC Corporate Services',
          section: 'Corporate Training',
          content: `${corpHeading}. ${corpDesc} Flexible group scheduling, customized curricula tailored to corporate stacks, and enterprise billing/reporting are available.`
        });
      }

      if (isAboutQuery || chunks.length === 0) {
        const aboutOverview = aboutContent.story || 'ITSC (Information Technology Solutions & Consultancy) is a premier IT training, consultancy, and testing institution in Ethiopia established in 1999. Over the past 25+ years, ITSC has trained thousands of professionals from government ministries, international NGOs, financial institutions, telecom operators, and private enterprises.';
        priorityChunks.push({
          id: 'cms-about-itsc',
          source: 'About ITSC',
          section: 'Company Background',
          content: `${aboutOverview} ITSC is renowned for quality instructor-led practical education and comprehensive vendor-aligned curriculums.`
        });
      }

      if (isTestingCenterQuery || isPartnersQuery || chunks.length === 0) {
        priorityChunks.push({
          id: 'cms-accreditations',
          source: 'Accreditations & Testing',
          section: 'Authorized Testing Center',
          content: 'ITSC is an Authorized Pearson VUE Testing Center and authorized training partner for global technology vendors including Microsoft, Cisco, CompTIA, Oracle, EC-Council, and Red Hat. Candidates can register for and take official international certification exams on-site in ITSC proctored testing facilities.'
        });
      }
    }

    // Combine priority chunks first, then course chunks, up to 5 chunks total
    const finalChunks = [...priorityChunks, ...chunks].slice(0, 5);

    return {
      chunks: finalChunks,
      courses: courses.slice(0, 6)
    };
  } catch (error) {
    console.error('Database retrieval failed, falling back to static knowledge:', error);
    return getFallbackKnowledge(normalizedQuery);
  }
}

async function getFallbackKnowledge(query: string): Promise<KnowledgeRetrievalResult> {
  try {
    const knowledge = await loadKnowledge();
    const chunks: KnowledgeChunk[] = [];
    const courses: StructuredCourse[] = [];

    // Static fallback matching
    if (matchesAny(query, ['contact', 'phone', 'email', 'address', 'where', 'location'])) {
      chunks.push({
        id: 'fallback-contact',
        source: 'ITSC Organization',
        section: 'Contact',
        content: `Email: ${knowledge.organization.contact.email}. Phone: ${knowledge.organization.contact.phone.join(', ')}. Address: ${knowledge.organization.location.address}, ${knowledge.organization.location.city}, ${knowledge.organization.location.country}. Website: ${knowledge.organization.contact.website}`
      });
    }

    if (matchesAny(query, ['training', 'course', 'courses', 'programs', 'microsoft', 'cisco', 'comptia', 'oracle'])) {
      const catList = knowledge.trainingCategories.map(c => c.name).join(', ');
      chunks.push({
        id: 'fallback-training',
        source: 'ITSC Training',
        section: 'Catalogue Overview',
        content: `ITSC offers industry-standard IT training across: ${catList}. Courses include hands-on labs, certified trainers, and preparation for official international certifications.`
      });

      // Sample courses from static knowledge
      for (const cat of knowledge.trainingCategories.slice(0, 2)) {
        for (const c of cat.courses.slice(0, 2)) {
          courses.push({
            title: c.name,
            slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            duration: c.duration,
            category: cat.name
          });
        }
      }
    }

    if (chunks.length === 0) {
      chunks.push({
        id: 'fallback-general',
        source: 'ITSC General',
        section: 'Overview',
        content: `${knowledge.organization.name} - ${knowledge.organization.description} Founded in ${knowledge.organization.founded}. Contact: ${knowledge.organization.contact.email}, ${knowledge.organization.contact.phone.join(', ')}.`
      });
    }

    return { chunks, courses };
  } catch {
    return {
      chunks: [
        {
          id: 'static-emergency-fallback',
          source: 'ITSC Information',
          section: 'General',
          content: 'ITSC (Information Technology Solutions & Consultancy) provides certified IT training, corporate enterprise solutions, and Pearson VUE certification testing in Addis Ababa, Ethiopia. Contact: info@itsc.com.et or +251 11 550 7150.'
        }
      ],
      courses: []
    };
  }
}

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some(k => text.includes(k));
}
