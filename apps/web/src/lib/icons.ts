// Icon resolver: maps data-driven icon string keys to Lucide components.
// This allows content models to reference icons as strings (stored in the CMS)
// while the frontend resolves them at render time.

import {
  Award,
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  HeadphonesIcon,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  "book-open": BookOpen,
  building: Building2,
  "clipboard-check": ClipboardCheck,
  "graduation-cap": GraduationCap,
  headphones: HeadphonesIcon,
  shield: ShieldCheck,
  sparkles: Sparkles,
  target: Target,
  users: Users
};

export function resolveIcon(key?: string): LucideIcon | null {
  if (!key) {
    return null;
  }
  return iconMap[key] ?? null;
}