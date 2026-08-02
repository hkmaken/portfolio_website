import type { Metadata } from "next";
import Image from "next/image";
import { Download } from "lucide-react";
import { site } from "@/config/site";
import { asset } from "@/lib/base-path";
import { buttonVariants } from "@/components/ui/button";
import Tag from "@/components/Tag";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — ${site.role}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Intro + portrait */}
      <section className="grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-xl bg-muted">
            <Image
              src={asset("/portrait.jpg")}
              alt={`Portrait of ${site.name}`}
              fill
              sizes="(max-width: 768px) 70vw, 320px"
              className="object-cover"
              unoptimized
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <h1 className="font-serif text-4xl md:text-5xl">About</h1>
            <div className="mt-6 space-y-4 text-lg text-muted-foreground">
              {site.longBio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <a
              href={asset(site.cvPath)}
              download
              className={buttonVariants({ className: "mt-6" })}
            >
              <Download className="size-4" aria-hidden /> Download CV
            </a>
          </div>
        </Reveal>
      </section>

      {/* Philosophy */}
      <Reveal>
        <blockquote className="mt-20 border-l-2 border-brand pl-6 font-serif text-2xl leading-relaxed md:text-3xl">
          {site.philosophy}
        </blockquote>
      </Reveal>

      <div className="mt-20 grid gap-16 md:grid-cols-2">
        {/* Experience */}
        <Reveal>
          <section>
            <h2 className="font-serif text-2xl">Experience</h2>
            <ul className="mt-6 space-y-6">
              {site.experience.map((e) => (
                <li key={`${e.role}-${e.org}`}>
                  <p className="text-sm text-muted-foreground">{e.period}</p>
                  <p className="font-medium">
                    {e.role} · {e.org}
                  </p>
                  <p className="text-sm text-muted-foreground">{e.detail}</p>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-serif text-2xl">Education</h2>
            <ul className="mt-6 space-y-4">
              {site.education.map((e) => (
                <li key={e.title}>
                  <p className="text-sm text-muted-foreground">{e.period}</p>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-muted-foreground">{e.org}</p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Skills + software */}
        <Reveal delay={0.1}>
          <section>
            <h2 className="font-serif text-2xl">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {site.skills.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>

            <h2 className="mt-12 font-serif text-2xl">Software</h2>
            <ul className="mt-6 space-y-4">
              {site.software.map((s) => (
                <li key={s.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.level}%</span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-muted"
                    role="meter"
                    aria-valuenow={s.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${s.name} proficiency`}
                  >
                    <div
                      className="h-full bg-brand"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>

      {/* Values */}
      <Reveal>
        <section className="mt-20">
          <h2 className="font-serif text-2xl">Values</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {site.values.map((v) => (
              <li
                key={v}
                className="rounded-lg border border-border/60 px-4 py-3"
              >
                {v}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
