// MOCK DATA — replace with API integration (see docs/cms-architecture.md)
// This file provides temporary typed data for the Gallery page. It conforms to
// the shared contracts in @itsc/shared so that swapping to API data requires no
// component changes.

import type { GalleryContent } from "@itsc/shared";

export const galleryContent: GalleryContent = {
  eyebrow: "Gallery",
  title: "Photo Gallery",
  intro: "Explore moments from ITSC training programs, events, and facilities.",
  albums: [
    {
      id: "album-training",
      title: "Training Sessions",
      description: "Photos from our hands-on training sessions across various programs.",
      images: [
        { id: "img-training-1", alt: "AI and machine learning workshop" },
        { id: "img-training-2", alt: "Cybersecurity lab session with students" },
        { id: "img-training-3", alt: "Cloud architecture hands-on training" }
      ]
    },
    {
      id: "album-events",
      title: "Events & Ceremonies",
      description: "Highlights from graduation ceremonies, workshops, and community events.",
      images: [
        { id: "img-events-1", alt: "Graduation ceremony with certificate presentation" },
        { id: "img-events-2", alt: "Guest speaker session on technology trends" },
        { id: "img-events-3", alt: "Networking event with industry partners" }
      ]
    },
    {
      id: "album-facilities",
      title: "Facilities",
      description: "Our training facilities and equipment designed for optimal learning.",
      images: [
        { id: "img-facilities-1", alt: "Main training hall with workstations" },
        { id: "img-facilities-2", alt: "Computer lab with latest equipment" },
        { id: "img-facilities-3", alt: "Collaboration space for group projects" }
      ]
    }
  ]
};