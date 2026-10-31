import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import {
  SETTING_KEYS,
  SETTING_SCHEMAS,
  type SettingKey,
  type UpdateSettingInput
} from "./settings.schema.js";

/** Keys exposed to the public without authentication. */
const PUBLIC_KEYS: SettingKey[] = [
  "seo_defaults",
  "contact_info",
  "site_config",
  "homepage",
  "about",
  "corporate_training"
];

export const settingsService = {
  async getAllSettings() {
    return prisma.websiteSetting.findMany({
      orderBy: { key: "asc" },
    });
  },

  async getPublicSettings() {
    return prisma.websiteSetting.findMany({
      where: { key: { in: PUBLIC_KEYS } },
      orderBy: { key: "asc" },
    });
  },

  async getSettingByKey(key: string) {
    if (!SETTING_KEYS.includes(key as SettingKey)) {
      throw new AppError(400, `Invalid setting key: "${key}".`, "SETTINGS_001");
    }

    const setting = await prisma.websiteSetting.findUnique({ where: { key } });

    if (!setting) {
      throw new AppError(404, `Setting "${key}" not found.`, "SETTINGS_002");
    }

    return setting;
  },

  async upsertSetting(key: string, input: UpdateSettingInput) {
    if (!SETTING_KEYS.includes(key as SettingKey)) {
      throw new AppError(400, `Invalid setting key: "${key}".`, "SETTINGS_001");
    }

    const schema = SETTING_SCHEMAS[key as SettingKey];
    if (schema) {
      const result = schema.safeParse(input.value);
      if (!result.success) {
        throw new AppError(
          400,
          `Invalid payload for setting "${key}": ${result.error.message}`,
          "SETTINGS_003"
        );
      }
    }

    return prisma.websiteSetting.upsert({
      where: { key },
      create: { key, value: input.value },
      update: { value: input.value },
    });
  },
};
