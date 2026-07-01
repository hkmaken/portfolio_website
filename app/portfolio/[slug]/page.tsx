import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllProjects, getProject, getProjectNav } from "@/lib/projects";
import { projectMetadata, projectJsonLd } from "@/lib/seo";
import Gallery from "@/components/Gallery";
import ProjectCard from "@/components/ProjectCard";
import Tag from "@/components/Tag";

export async function generateStaticParams() {
  return (await getAllProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return projectMetadata(project);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div>
      <h2 className="font-serif text-2xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{children}</p>
    </div>
  );
}

function MetaList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </h3>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const { prev, next, related } = await getProjectNav(slug);

  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectJsonLd(project) }}
      />

      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to portfolio
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{project.category}</Tag>
          <span className="text-sm text-muted-foreground">{project.year}</span>
          {project.client && (
            <span className="text-sm text-muted-foreground">
              · {project.client}
            </span>
          )}
        </div>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{project.title}</h1>
        {project.subtitle && (
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {project.subtitle}
          </p>
        )}
      </header>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          <Section title="Overview">{project.description}</Section>
          {project.problem && (
            <Section title="The problem">{project.problem}</Section>
          )}
          {project.process && (
            <Section title="Design process">{project.process}</Section>
          )}
          {project.solution && (
            <Section title="The solution">{project.solution}</Section>
          )}
        </div>

        <aside className="space-y-8">
          <MetaList label="Services" items={project.services} />
          <MetaList label="Tools" items={project.tools} />
          <MetaList label="Deliverables" items={project.deliverables} />
          {project.tags.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
                Tags
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {project.gallery.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-serif text-2xl">Gallery</h2>
          <Gallery images={project.gallery} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl">Related projects</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <nav
        className="mt-16 flex items-center justify-between border-t border-border/60 pt-6"
        aria-label="Project navigation"
      >
        <Link
          href={`/portfolio/${prev.slug}/`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">{prev.title}</span>
          <span className="sm:hidden">Previous</span>
        </Link>
        <Link
          href={`/portfolio/${next.slug}/`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <span className="hidden sm:inline">{next.title}</span>
          <span className="sm:hidden">Next</span>
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </nav>
    </article>
  );
}
