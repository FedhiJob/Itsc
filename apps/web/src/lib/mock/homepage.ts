// MOCK DATA — replace with API integration (see docs/cms-architecture.md)
// This file provides temporary typed data for the homepage. It conforms to the
// shared contracts in @itsc/shared so that swapping to API data requires no
// component changes.

import type { HomepageContent } from "@itsc/shared";

export const homepageContent: HomepageContent = {
  hero: {
    eyebrow: "Corporate website foundation",
    title: "Professional technology training, presented with clarity and trust.",
    subtitle:
      "ITSC helps students, professionals, organizations, and government institutions discover practical training services and connect with the right support.",
    primaryCta: { label: "Explore Programs", href: "/training-programs", variant: "primary" },
    secondaryCta: { label: "Corporate Training", href: "/corporate-training", variant: "outline" },
    highlights: [
      { label: "Training Tracks", value: "AI, Cloud, Cybersecurity" },
      { label: "Audience", value: "Students, teams, institutions" },
      { label: "Admin Ready", value: "Content-driven architecture" },
      { label: "AI Assistant", value: "Built for guided support" }
    ]
  },
  stats: [
    { value: "100+", label: "Different Courses" },
    { value: "150+", label: "Happy Clients" },
    { value: "30+", label: "Elite Trainers" },
    { value: "14+", label: "International Partners" }
  ],
  services: [
    {
      title: "Public Website",
      description: "Home, About, Programs, News, Gallery, Contact, and Corporate Training.",
      icon: "graduation-cap"
    },
    {
      title: "Admin Portal",
      description: "A content-driven dashboard for ITSC staff to manage the website.",
      icon: "building"
    },
    {
      title: "Secure API",
      description: "Express, Prisma, PostgreSQL, validation, rate limits, and JWT auth.",
      icon: "shield"
    },
    {
      title: "AI Assistant",
      description: "A modular chatbot service prepared for future RAG and multilingual support.",
      icon: "sparkles"
    }
  ],
  partners: [
    { src: "/logos/lpi.png", alt: "LPI", href: "https://lpi.org" },
    { src: "/logos/cisco.png", alt: "Cisco", href: "https://cisco.com" },
    { src: "/logos/microsoft.png", alt: "Microsoft", href: "https://microsoft.com" },
    { src: "/logos/comptia.png", alt: "CompTIA", href: "https://comptia.org" },
    { src: "/logos/ec-council.png", alt: "EC Council", href: "https://eccouncil.org" },
    { src: "/logos/pearson-vue.png", alt: "Pearson VUE", href: "https://pearsonvue.com" }
  ],
  clients: [
    { src: "/logos/nib.png", alt: "NIB" },
    { src: "/logos/undp.png", alt: "UNDP" },
    { src: "/logos/cbe.png", alt: "CBE" },
    { src: "/logos/coca-cola.png", alt: "Coca Cola" },
    { src: "/logos/awash-bank.png", alt: "Awash Bank" }
  ],
  missionVision: {
    mission:
      "To bridge the technology skills gap by providing accessible, high-quality training programs for students, professionals, organizations, and government institutions.",
    vision:
      "To be the leading technology training and solutions center, empowering individuals and organizations to thrive in the digital age."
  },
  cta: {
    title: "Ready to get started?",
    description: "Explore our training programs or contact us to discuss your learning needs.",
    primaryCta: { label: "Contact Us", href: "/contact", variant: "primary" },
    secondaryCta: { label: "View Programs", href: "/training-programs", variant: "outline" }
  }
};