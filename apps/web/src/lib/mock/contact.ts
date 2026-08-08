// MOCK DATA — replace with API integration (see docs/cms-architecture.md)
// This file provides temporary typed data for the Contact page. It conforms to
// the shared contracts in @itsc/shared so that swapping to API data requires no
// component changes.

import type { ContactContent } from "@itsc/shared";

export const contactContent: ContactContent = {
  eyebrow: "Contact",
  title: "Get in Touch",
  intro:
    "Have a question about our programs, corporate training, or anything else? We'd love to hear from you.",
  infoItems: [
    {
      type: "email",
      label: "Email",
      value: "info@itsc.com.et",
      href: "mailto:info@itsc.com.et"
    },
    {
      type: "phone",
      label: "Phone",
      value: "+251 000 000 000"
    },
    {
      type: "address",
      label: "Address",
      value: "Addis Ababa, Ethiopia"
    }
  ],
  subjects: [
    { value: "", label: "Select a subject" },
    { value: "general", label: "General Inquiry" },
    { value: "enrollment", label: "Program Enrollment" },
    { value: "corporate-training", label: "Corporate Training" },
    { value: "partnership", label: "Partnership Opportunity" },
    { value: "other", label: "Other" }
  ]
};