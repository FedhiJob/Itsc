import { Mail, MapPin, Phone } from "lucide-react";
import type { ContactInfoItem } from "@itsc/shared";

const iconForType = {
  email: Mail,
  phone: Phone,
  address: MapPin
} as const;

interface ContactInfoProps {
  items: ContactInfoItem[];
  heading?: string;
  subheading?: string;
}

export function ContactInfo({ items, heading, subheading }: ContactInfoProps) {
  return (
    <div className="space-y-8">
      {heading ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{heading}</h2>
          {subheading ? <p className="mt-2 text-sm leading-6 text-gray-500">{subheading}</p> : null}
        </div>
      ) : null}

      <div className="space-y-6">
        {items.map((item) => {
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
                    className="text-sm text-gray-500 transition-colors hover:text-brand-gold"
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
  );
}