export const siteConfig = {
  name: "ITSC",
  fullName: "Information Technology and Solutions Center",
  description:
    "Professional technology training, corporate capacity building, and AI-assisted guidance from ITSC.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  links: {
    email: "info@itsc.com.et",
    phone: "+251 000 000 000",
    address: "Addis Ababa, Ethiopia"
  }
};

export const mainNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Training Programs", href: "/training-programs" },
  { label: "Corporate Training", href: "/corporate-training" },
  { label: "News & Events", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
] as const;
