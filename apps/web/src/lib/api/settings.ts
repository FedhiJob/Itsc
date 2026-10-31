import type {
  HomepageContent,
  AboutContent,
  CorporateTrainingContent
} from "@itsc/shared";
import { apiFetchSafe } from "./client";
import { homepageContent as fallbackHomepage } from "@/lib/mock/homepage";
import { aboutContent as fallbackAbout } from "@/lib/mock/about";
import { corporateTrainingContent as fallbackCorporate } from "@/lib/mock/corporate-training";

interface SettingItem {
  key: string;
  value: any;
}

export async function getPublicSettings(): Promise<Record<string, any>> {
  const settingsList = await apiFetchSafe<SettingItem[]>("/settings/public");
  if (!settingsList || !Array.isArray(settingsList)) return {};
  const map: Record<string, any> = {};
  for (const item of settingsList) {
    map[item.key] = item.value;
  }
  return map;
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const publicSettings = await getPublicSettings();
  if (publicSettings.homepage) {
    return {
      ...fallbackHomepage,
      ...publicSettings.homepage
    };
  }
  return fallbackHomepage;
}

export async function getAboutContent(): Promise<AboutContent> {
  const publicSettings = await getPublicSettings();
  if (publicSettings.about) {
    return {
      ...fallbackAbout,
      ...publicSettings.about
    };
  }
  return fallbackAbout;
}

export async function getCorporateTrainingContent(): Promise<CorporateTrainingContent> {
  const publicSettings = await getPublicSettings();
  if (publicSettings.corporate_training) {
    return {
      ...fallbackCorporate,
      ...publicSettings.corporate_training
    };
  }
  return fallbackCorporate;
}

