import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/section";
import { getGalleryContent } from "@/lib/api/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos and images from ITSC training sessions, events, facilities, and community activities."
};

export default async function GalleryPage() {
  const { eyebrow, title, intro, albums } = await getGalleryContent();

  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-500">{intro}</p>
        </Container>
      </Section>

      {albums.map((album) => (
        <Section key={album.id}>
          <Container>
            <h2 className="text-2xl font-bold text-gray-900">{album.title}</h2>
            {album.description ? (
              <p className="mt-2 text-sm leading-6 text-gray-500">{album.description}</p>
            ) : null}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {album.images.map((image) => (
                <div
                  key={image.id}
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