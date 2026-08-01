export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type InquiryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";

export type TrainingProgramSummary = {
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
};
