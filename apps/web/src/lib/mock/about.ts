// MOCK DATA — replace with API integration (see docs/cms-architecture.md)
// This file provides temporary typed data for the About page. It conforms to the
// shared contracts in @itsc/shared so that swapping to API data requires no
// component changes.

import type { AboutContent } from "@itsc/shared";

export const aboutContent: AboutContent = {
  eyebrow: "About ITSC",
  title: "ITSC Technology Support",
  intro:
    "ITSC is a dedicated technology training and solutions provider based in Ethiopia. We equip students, professionals, and organizations with practical skills in AI, cloud computing, cybersecurity, and emerging technologies.",
  values: [
    {
      title: "Our Mission",
      description:
        "To bridge the technology skills gap by providing accessible, high-quality training programs for students, professionals, organizations, and government institutions.",
      icon: "target"
    },
    {
      title: "Our Vision",
      description:
        "To be the leading technology training and solutions center, empowering individuals and organizations to thrive in the digital age.",
      icon: "award"
    },
    {
      title: "Who We Serve",
      description:
        "Students seeking practical skills, professionals advancing their careers, organizations building team capabilities, and government institutions driving digital transformation.",
      icon: "users"
    },
    {
      title: "Our Approach",
      description:
        "Hands-on training delivered by experienced instructors, combining theoretical foundations with real-world applications and industry best practices.",
      icon: "building"
    },
    {
      title: "Continuous Learning",
      description:
        "We stay current with emerging technologies — AI, cloud computing, cybersecurity — ensuring our training programs remain relevant and impactful.",
      icon: "book-open"
    }
  ],
  cta: {
    title: "Ready to get started?",
    description: "Explore our training programs or contact us to discuss your learning needs.",
    primaryCta: { label: "View Programs", href: "/training-programs", variant: "primary" },
    secondaryCta: { label: "Contact Us", href: "/contact", variant: "outline" }
  }
};