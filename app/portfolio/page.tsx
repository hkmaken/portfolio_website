import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import PortfolioGrid from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected branding, editorial, and digital design work.",
};

export default async function PortfolioPage() {
  const projects = await getAllProjects();
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl">Portfolio</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A selection of branding, editorial, and digital projects. Filter by
          discipline, sort, or search by title and tags.
        </p>
      </header>
      <PortfolioGrid projects={projects} />
    </div>
  );
}
