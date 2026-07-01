import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllProjects } from "@/lib/projects";
import { site } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";

// Sample testimonials — owner can replace these strings.
const TESTIMONIALS = [
  {
    quote:
      "Hassan translated a vague brief into a brand we now use everywhere. Calm, precise, and a joy to work with.",
    author: "Mara Lindqvist",
    role: "Founder, Hearth & Bean",
  },
  {
    quote:
      "The editorial system shaved days off every issue while making the magazine look unmistakably ours.",
    author: "Daniel Osei",
    role: "Editor, Aurora Magazine",
  },
];

export default async function HomePage() {
  const projects = await getAllProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const showcase = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Featured work */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl">Selected work</h2>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              All projects <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="mb-8 font-serif text-3xl">What I do</h2>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {site.services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div>
                  <Icon name={s.icon} className="size-6 text-brand" aria-hidden />
                  <h3 className="mt-3 font-serif text-lg">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="mb-8 font-serif text-3xl">Kind words</h2>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.05}>
              <figure className="rounded-xl border border-border/60 p-6">
                <blockquote className="font-serif text-lg leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  {t.author} — {t.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Client logos placeholder */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <Reveal>
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by
          </p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="flex h-14 items-center justify-center rounded-md border border-border/60 text-sm text-muted-foreground"
              >
                Client {i + 1}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <Reveal>
          <div className="rounded-2xl border border-border/60 bg-muted/30 px-8 py-14 text-center">
            <h2 className="font-serif text-3xl md:text-4xl">
              Have a project in mind?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {site.availability}
            </p>
            <Link
              href="/contact"
              className={buttonVariants({ size: "lg", className: "mt-6" })}
            >
              Start a conversation <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
