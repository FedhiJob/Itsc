import { z } from "zod";

/**
 * Allow-listed setting keys.
 * Enum prevents arbitrary key injection into WebsiteSetting.
 */
export const SETTING_KEYS = [
  "homepage",
  "about",
  "corporate_training",
  "contact_info",
  "site_config",
  "seo_defaults",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

// --- Recursive JSON schema compatible with Zod 4 and Prisma JSON inputs ---
type Literal = string | number | boolean | null;
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export type JsonValue = Literal | { [key: string]: JsonValue } | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonValueSchema), z.record(z.string(), jsonValueSchema)])
);

export const jsonObjectSchema: z.ZodType<JsonObject> = z.record(
  z.string(),
  jsonValueSchema
);

// --- Explicit Schemas per Permitted Setting Key matching @itsc/shared ---
export const ctaLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(["primary", "secondary", "outline", "ghost"]).optional(),
});

export const mediaImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const heroSectionSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  primaryCta: ctaLinkSchema,
  secondaryCta: ctaLinkSchema.optional(),
  backgroundImage: mediaImageSchema.optional(),
  highlights: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

export const statisticSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const serviceSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const logoItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  href: z.string().optional(),
});

export const missionVisionSchema = z.object({
  mission: z.string(),
  vision: z.string(),
});

export const ctaSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  primaryCta: ctaLinkSchema,
  secondaryCta: ctaLinkSchema.optional(),
});

export const homepageContentSchema = z.object({
  hero: heroSectionSchema,
  stats: z.array(statisticSchema),
  services: z.array(serviceSchema),
  partners: z.array(logoItemSchema),
  clients: z.array(logoItemSchema),
  missionVision: missionVisionSchema,
  cta: ctaSectionSchema,
});

export const aboutValueSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const aboutContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  values: z.array(aboutValueSchema),
  cta: ctaSectionSchema,
});

export const corporateBenefitSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const corporateServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
  areas: z.array(z.string()),
});

export const corporateTrainingContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  primaryCta: ctaLinkSchema,
  benefits: z.array(corporateBenefitSchema),
  services: z.array(corporateServiceSchema),
  cta: ctaSectionSchema,
});

export const contactInfoItemSchema = z.object({
  type: z.enum(["email", "phone", "address"]),
  label: z.string(),
  value: z.string(),
  href: z.string().optional(),
});

export const contactContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  infoItems: z.array(contactInfoItemSchema),
  subjects: z.array(z.object({ value: z.string(), label: z.string() })),
});

export const siteConfigSchema = z.object({
  name: z.string(),
  fullName: z.string(),
  description: z.string(),
  url: z.string(),
  apiUrl: z.string(),
  links: z.object({
    email: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
});

export const seoDefaultsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
});

/** Key-to-schema validation registry */
export const SETTING_SCHEMAS: Record<SettingKey, z.ZodTypeAny> = {
  homepage: homepageContentSchema,
  about: aboutContentSchema,
  corporate_training: corporateTrainingContentSchema,
  contact_info: contactContentSchema,
  site_config: siteConfigSchema,
  seo_defaults: seoDefaultsSchema,
};

export const updateSettingSchema = z.object({
  value: jsonObjectSchema,
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
