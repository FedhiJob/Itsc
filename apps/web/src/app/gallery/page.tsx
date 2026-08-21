import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/section";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryGrid } from "@/components/features/gallery-grid";
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
          <PageHero eyebrow={eyebrow} title={title} description={intro} />
        </Container>
      </Section>

      {albums.map((album) => (
        <Section key={album.id}>
          <Container>
            <h2 className="text-2xl font-bold text-gray-900">{album.title}</h2>
            {album.description ? (
              <p className="mt-2 text-sm leading-6 text-gray-500">{album.description}</p>
            ) : null}
            <div className="mt-6"><GalleryGrid images={album.images} /></div>
          </Container>
        </Section>
      ))}
    </>
  );
}
