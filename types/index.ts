export const CATEGORIES = [
  "Branding",
  "Illustration",
  "Print",
  "UI",
  "UX",
  "Web",
  "Motion",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface GalleryImage {
  src: string; // public-relative path, e.g. /content/<slug>/01-foo.jpg
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
}

/** Shape authored by the owner in project.json. */
export interface RawProject {
  title: string;
  subtitle?: string;
  category: Category;
  client?: string;
  year: number;
  services: string[];
  description: string;
  problem?: string;
  process?: string;
  solution?: string;
  tools: string[];
  deliverables: string[];
  tags: string[];
  featured: boolean;
  order: number;
}

/** Fully resolved project used by the app. */
export interface Project extends RawProject {
  slug: string;
  cover: GalleryImage;
  gallery: GalleryImage[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  shortBio: string;
  longBio: string[];
  email: string;
  phone?: string;
  location: string;
  url: string; // canonical site URL, no trailing slash
  formspreeId: string;
  socials: SocialLink[];
  services: Service[];
  skills: string[];
  software: { name: string; level: number }[];
  experience: { role: string; org: string; period: string; detail: string }[];
  education: { title: string; org: string; period: string }[];
  values: string[];
  philosophy: string;
  responseTime: string;
  availability: string;
  cvPath: string; // e.g. /cv.pdf
  nav: { label: string; href: string }[];
  analyticsId?: string;
}
