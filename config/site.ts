import type { SiteConfig } from "@/types";

/**
 * The single source of all owner-editable settings.
 * Non-technical owners can change everything here without touching components.
 */
export const site: SiteConfig = {
  name: "Hassan Kamran",
  role: "Graphics Designer and Animator",
  shortBio:
    "I craft brand identities and editorial systems that feel considered, warm, and built to last.",
  longBio: [
    "I am a multidisciplinary graphic designer with a decade of work across branding, print, and digital products.",
    "My approach is editorial and systems-driven: clear typography, generous space, and details that hold up at every scale.",
    "I work closely with founders and editors who care about craft, and I treat every project as a system rather than a single artefact.",
  ],
  email: "hkmaken@gmail.com",
  phone: "+92 331 6080690",
  location: "Pakistan",
  url: "https://example.com",
  formspreeId: "your-form-id",
  socials: [
    { label: "GitHub", href: "https://github.com/hkmaken", icon: "github" },
  ],
  services: [
    {
      title: "Brand Identity",
      description: "Logos, systems, and guidelines that scale.",
      icon: "pen-tool",
    },
    {
      title: "Editorial & Print",
      description: "Books, magazines, and packaging.",
      icon: "book-open",
    },
    {
      title: "Digital & UI",
      description: "Product and marketing interfaces.",
      icon: "layout",
    },
    {
      title: "Art Direction",
      description: "Campaigns and visual language.",
      icon: "sparkles",
    },
  ],
  skills: [
    "Brand Strategy",
    "Typography",
    "Layout",
    "Packaging",
    "Art Direction",
    "Illustration",
    "Prototyping",
    "Design Systems",
  ],
  software: [
    { name: "Illustrator", level: 95 },
    { name: "Photoshop", level: 90 },
    { name: "InDesign", level: 92 },
    { name: "Figma", level: 88 },
  ],
  experience: [
    {
      role: "Senior Designer",
      org: "Studio Atlas",
      period: "2020 — Present",
      detail: "Led identity work for lifestyle and culture clients.",
    },
    {
      role: "Designer",
      org: "Northbound",
      period: "2016 — 2020",
      detail: "Editorial and packaging across consumer brands.",
    },
  ],
  education: [
    {
      title: "BA Graphic Design",
      org: "Central School of Art",
      period: "2012 — 2016",
    },
  ],
  values: [
    "Clarity over decoration",
    "Systems that scale",
    "Craft in the details",
    "Honest collaboration",
  ],
  philosophy:
    "Good design is mostly editing. I remove until only the essential remains, then make that essential beautiful.",
  responseTime: "Usually within 1–2 business days",
  availability: "Open to select projects for Q3 2026",
  cvPath: "/cv.pdf",
  nav: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
