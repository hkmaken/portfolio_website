import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";
import ContactForm from "@/components/ContactForm";
import CopyEmail from "@/components/CopyEmail";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl">Let&rsquo;s talk</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell me about your project and I&rsquo;ll get back to you.
        </p>
      </header>

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.2fr]">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </h2>
            <div className="mt-2">
              <CopyEmail className="text-base text-foreground" />
            </div>
          </div>

          {site.phone && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
                Phone
              </h2>
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="mt-2 inline-flex items-center gap-2 hover:text-foreground"
              >
                <Phone className="size-4" aria-hidden /> {site.phone}
              </a>
            </div>
          )}

          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Location
            </h2>
            <p className="mt-2 inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden /> {site.location}
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Availability
            </h2>
            <p className="mt-2">{site.availability}</p>
            <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" aria-hidden /> {site.responseTime}
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Elsewhere
            </h2>
            <ul className="mt-2 space-y-1">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ponytail: keyless OpenStreetMap embed driven by site.mapBbox —
              swap for a geocoded/API-key provider only if pin accuracy matters. */}
          <iframe
            title={`Map of ${site.location}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${site.mapBbox}&layer=mapnik`}
            loading="lazy"
            className="h-40 w-full rounded-lg border border-border"
          />
        </div>

        {/* Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
