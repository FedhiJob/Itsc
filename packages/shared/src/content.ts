// ============================================================================
// ITSC Shared Content Contracts
// ----------------------------------------------------------------------------
// These interfaces are the single source of truth for all content entities
// rendered on the public website. They are designed to be API-ready: the shape
// of each interface matches the future REST response shape so that swapping
// mock data for API data requires no component changes.
//
// See docs/cms-architecture.md for the full dynamic CMS architecture.
// ============================================================================

// ---------------------------------------------------------------------------
// Enums / Status
// ---------------------------------------------------------------------------

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type InquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";

// ---------------------------------------------------------------------------
// Common
// ---------------------------------------------------------------------------

export interface CtaLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export interface MediaImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------

export interface HeroSection {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  backgroundImage?: MediaImage;
  /** Optional highlight cards shown alongside the hero (e.g. training tracks). */
  highlights?: { label: string; value: string }[];
}

export interface Statistic {
  value: string;
  label: string;
}

export interface Service {
  title: string;
  description: string;
  /** Icon key resolved by the frontend (e.g. "training", "consulting"). */
  icon?: string;
}

export interface LogoItem {
  src: string;
  alt: string;
  href?: string;
}

export interface MissionVision {
  mission: string;
  vision: string;
}

export interface CtaSection {
  title: string;
  description: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
}

export interface HomepageContent {
  hero: HeroSection;
  stats: Statistic[];
  services: Service[];
  partners: LogoItem[];
  clients: LogoItem[];
  missionVision: MissionVision;
  cta: CtaSection;
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export interface AboutValue {
  title: string;
  description: string;
  /** Icon key resolved by the frontend (e.g. "mission", "vision", "users"). */
  icon?: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  intro: string;
  values: AboutValue[];
  cta: CtaSection;
}

// ---------------------------------------------------------------------------
// Training Programs
// ---------------------------------------------------------------------------

export interface TrainingCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface TrainingProgramSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  duration?: string;
  deliveryMode?: string;
  level?: string;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface TrainingProgramDetail extends TrainingProgramSummary {
  fullDescription: string;
  objectives: string[];
  prerequisites: string[];
  featuredImage?: MediaImage;
}

export interface TrainingProgramsContent {
  eyebrow: string;
  title: string;
  intro: string;
  categories: TrainingCategory[];
  programs: TrainingProgramSummary[];
}

// ---------------------------------------------------------------------------
// Corporate Training
// ---------------------------------------------------------------------------

export interface CorporateBenefit {
  title: string;
  description: string;
  /** Icon key resolved by the frontend (e.g. "users", "clipboard"). */
  icon?: string;
}

export interface CorporateService {
  title: string;
  description: string;
  areas: string[];
}

export interface CorporateTrainingContent {
  eyebrow: string;
  title: string;
  intro: string;
  primaryCta: CtaLink;
  benefits: CorporateBenefit[];
  services: CorporateService[];
  cta: CtaSection;
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export interface NewsArticleSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  date: string;
  category: string;
  featuredImage?: MediaImage;
}

export interface NewsArticleDetail extends NewsArticleSummary {
  /** Full article body rendered as paragraphs. */
  content: string[];
  /** Optional author byline. */
  author?: string;
}

export interface NewsContent {
  eyebrow: string;
  title: string;
  intro: string;
  articles: NewsArticleSummary[];
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export interface GalleryImage {
  id: string;
  alt: string;
  src?: string;
  caption?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverImage?: MediaImage;
  images: GalleryImage[];
}

export interface GalleryContent {
  eyebrow: string;
  title: string;
  intro: string;
  albums: GalleryAlbum[];
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export interface ContactInfoItem {
  type: "email" | "phone" | "address";
  label: string;
  value: string;
  href?: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  intro: string;
  infoItems: ContactInfoItem[];
  /** Subject options for the contact form. */
  subjects: { value: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Site-wide
// ---------------------------------------------------------------------------

export interface SiteConfig {
  name: string;
  fullName: string;
  description: string;
  url: string;
  apiUrl: string;
  links: {
    email: string;
    phone: string;
    address: string;
  };
}