export interface KnowledgeBase {
  organization: OrganizationInfo;
  mission: string;
  vision: string;
  coreValues: string[];
  services: ServiceInfo[];
  partnerships: PartnershipInfo[];
  trainingCategories: TrainingCategory[];
  majorClients: string[];
}

export interface KnowledgeChunk {
  id: string;
  content: string;
  source: string;
  section: string | undefined;
  relevanceScore?: number;
}

export interface OrganizationInfo {
  name: string;
  founded: number;
  description: string;
  location: LocationInfo;
  contact: ContactInfo;
}

export interface LocationInfo {
  address: string;
  city: string;
  country: string;
}

export interface ContactInfo {
  phone: string[];
  fax: string;
  email: string;
  website: string;
}

export interface ServiceInfo {
  name: string;
  description: string;
}

export interface PartnershipInfo {
  partner: string;
  type: string;
  details: string;
}

export interface TrainingCategory {
  name: string;
  courses: CourseInfo[];
}

export interface CourseInfo {
  name: string;
  duration: string;
}