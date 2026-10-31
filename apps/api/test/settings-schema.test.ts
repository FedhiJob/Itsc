import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SETTING_KEYS,
  SETTING_SCHEMAS,
  updateSettingSchema,
  homepageContentSchema,
  aboutContentSchema,
  contactContentSchema,
  siteConfigSchema
} from "../src/modules/settings/settings.schema.js";

describe("Settings Module Schemas & Validation", () => {
  it("defines the expected allow-listed setting keys", () => {
    assert.deepEqual([...SETTING_KEYS], [
      "homepage",
      "about",
      "corporate_training",
      "contact_info",
      "site_config",
      "seo_defaults"
    ]);
  });

  it("validates a general updateSettingSchema with arbitrary JSON object", () => {
    const valid = { value: { key: "value", nested: { num: 42, bool: true, nil: null } } };
    const result = updateSettingSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it("rejects non-object values in updateSettingSchema", () => {
    const invalid = { value: "not-an-object" };
    const result = updateSettingSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it("validates a valid homepage setting payload against homepageContentSchema", () => {
    const validHomepage = {
      hero: {
        eyebrow: "Technology Education",
        title: "Future Ready",
        subtitle: "Training for professionals",
        primaryCta: { label: "Explore", href: "/training-programs" }
      },
      stats: [{ value: "10k+", label: "Graduates" }],
      services: [{ title: "Training", description: "Corporate IT" }],
      partners: [{ src: "/logos/partner.png", alt: "Partner" }],
      clients: [{ src: "/logos/client.png", alt: "Client" }],
      missionVision: { mission: "Our mission", vision: "Our vision" },
      cta: {
        title: "Start Learning",
        description: "Join today",
        primaryCta: { label: "Contact", href: "/contact" }
      }
    };

    const result = homepageContentSchema.safeParse(validHomepage);
    assert.equal(result.success, true);
  });

  it("rejects malformed homepage payload missing required hero section", () => {
    const invalidHomepage = {
      stats: [],
      services: []
    };

    const result = homepageContentSchema.safeParse(invalidHomepage);
    assert.equal(result.success, false);
  });

  it("validates site_config schema", () => {
    const validConfig = {
      name: "ITSC",
      fullName: "Information Technology Systems Corporation",
      description: "Professional training",
      url: "https://itsc.com.et",
      apiUrl: "https://itsc.com.et/api/v1",
      links: {
        email: "info@itsc.com.et",
        phone: "+251 11 000 0000",
        address: "Addis Ababa, Ethiopia"
      }
    };

    const result = siteConfigSchema.safeParse(validConfig);
    assert.equal(result.success, true);
  });

  it("has a registered validator schema for every setting key", () => {
    for (const key of SETTING_KEYS) {
      assert.ok(SETTING_SCHEMAS[key], `Missing schema for key: ${key}`);
    }
  });
});

