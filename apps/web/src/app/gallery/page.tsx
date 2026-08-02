import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos and images from ITSC training sessions, events, facilities, and community activities."
};

const albums = [
  {
    title: "Training Sessions",
    description: "Photos from our hands-on training sessions across various programs.",
    images: [
      { alt: "AI and machine learning workshop" },
      { alt: "Cybersecurity lab session with students" },
      { alt: "Cloud architecture hands-on training" }
    ]
  },
  {
    title: "Events & Ceremonies",
    description: "Highlights from graduation ceremonies, workshops, and community events.",
    images: [
      { alt: "Graduation ceremony with certificate presentation" },
      { alt: "Guest speaker session on technology trends" },
      { alt: "Networking event with industry partners" }
    ]
  },
  {
    title: "Facilities",
    description: "Our training facilities and equipment designed for optimal learning.",
    images: [
      { alt: "Main training hall with workstations" },
      { alt: "Computer lab with latest equipment" },
      { alt: "Collaboration space for group projects" }
    ]
  }
];

export default function GalleryPage() {
  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">Gallery</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Photo Gallery
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-500">
            Explore moments from ITSC training programs, events, and facilities.
          </p>
        </Container>
      </Section>

      {albums.map((album) => (
        <Section key={album.title}>
          <Container>
            <h2 className="text-2xl font-bold text-gray-900">{album.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">{album.description}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {album.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                >
                  <div className="aspect-[3/2] flex items-center justify-center bg-gradient-to-br from-brand-gold/5 to-brand-gold/10">
                    <span className="px-4 text-center text-sm text-gray-500">
                      {image.alt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ))}
    </>
  );
}
