import type { Metadata } from "next";
import { site } from "@/config/site";
import type { Project } from "@/types";

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.role}`,
      template: `%s — ${site.name}`,
    },
    description: site.shortBio,
    openGraph: {
      type: "website",
      url: site.url,
      title: `${site.name} — ${site.role}`,
      description: site.shortBio,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.role}`,
      description: site.shortBio,
      images: ["/og.png"],
    },
    alternates: { canonical: "/" },
  };
}

export function projectMetadata(p: Project): Metadata {
  return {
    title: p.title,
    description: p.description,
    openGraph: {
      title: p.title,
      description: p.description,
      images: [p.cover.src],
    },
    twitter: { card: "summary_large_image", images: [p.cover.src] },
    alternates: { canonical: `/portfolio/${p.slug}/` },
  };
}

export function personJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: site.url,
    address: site.location,
    sameAs: site.socials.map((s) => s.href),
  });
}

export function projectJsonLd(p: Project) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.description,
    creator: { "@type": "Person", name: site.name },
    dateCreated: String(p.year),
    keywords: p.tags.join(", "),
  });
}
