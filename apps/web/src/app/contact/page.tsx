import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/section";
import { Mail, MapPin, Phone } from "lucide-react";
import { contactContent } from "@/lib/mock/contact";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ITSC. Send us a message, visit our campus, or reach out via phone or email."
};

const iconForType = {
  email: Mail,
  phone: Phone,
  address: MapPin
} as const;

export default function ContactPage() {
  const { eyebrow, title, intro, infoItems, subjects } = contactContent;

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

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Reach out through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                {infoItems.map((item) => {
                  const Icon = iconForType[item.type];
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-gold/10">
                        <Icon aria-hidden="true" className="h-5 w-5 text-brand-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-gray-500 hover:text-brand-gold transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Send us a Message</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              <ContactForm subjects={subjects} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
