// MOCK DATA — replace with API integration (see docs/cms-architecture.md)
// This file provides temporary typed data for the Corporate Training page. It
// conforms to the shared contracts in @itsc/shared so that swapping to API data
// requires no component changes.

import type { CorporateTrainingContent } from "@itsc/shared";

export const corporateTrainingContent: CorporateTrainingContent = {
  eyebrow: "Corporate",
  title: "Corporate Training Programs",
  intro:
    "Empower your team with customized technology training. ITSC partners with organizations and government institutions to build workforce capabilities in emerging technologies.",
  primaryCta: {
    label: "Request a Consultation",
    href: "/contact?subject=corporate-training",
    variant: "primary"
  },
  benefits: [
    {
      title: "Tailored Programs",
      description:
        "We design training programs aligned with your organization's specific goals, industry requirements, and team skill levels.",
      icon: "users"
    },
    {
      title: "Structured Curriculum",
      description:
        "Our proven methodology combines theoretical foundations with hands-on labs, real-world projects, and assessment-driven learning.",
      icon: "clipboard-check"
    },
    {
      title: "On-Site & Remote",
      description:
        "Choose between on-site training at your premises, remote virtual sessions, or a blended approach that fits your team's schedule.",
      icon: "building"
    },
    {
      title: "Ongoing Support",
      description:
        "Post-training support, materials access, and follow-up consultations ensure lasting impact and skill retention.",
      icon: "headphones"
    }
  ],
  services: [
    {
      title: "AI & Machine Learning",
      description:
        "Custom programs covering AI strategy, model development, MLOps, and responsible AI implementation.",
      areas: ["Strategy workshops", "Hands-on model building", "AI governance", "Team upskilling"]
    },
    {
      title: "Cloud Transformation",
      description:
        "Cloud adoption strategies, architecture design, migration planning, and DevOps enablement.",
      areas: [
        "Cloud readiness assessment",
        "Migration planning",
        "Architecture workshops",
        "DevOps pipeline setup"
      ]
    },
    {
      title: "Cybersecurity Readiness",
      description:
        "Security awareness programs, incident response training, and compliance preparation.",
      areas: [
        "Security assessments",
        "Incident response drills",
        "Compliance training",
        "SOC team development"
      ]
    },
    {
      title: "Digital Leadership",
      description:
        "Executive programs on digital transformation, technology strategy, and innovation management.",
      areas: ["Executive workshops", "Digital strategy", "Change management", "Innovation labs"]
    }
  ],
  cta: {
    title: "Ready to transform your team?",
    description:
      "Contact us to discuss your organization's training needs and get a customized proposal.",
    primaryCta: {
      label: "Get in Touch",
      href: "/contact?subject=corporate-training",
      variant: "primary"
    },
    secondaryCta: { label: "View All Programs", href: "/training-programs", variant: "outline" }
  }
};