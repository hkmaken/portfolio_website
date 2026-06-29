"use client";

import { useMemo, useState } from "react";
import type { Project, Category } from "@/types";
import ProjectCard from "./ProjectCard";
import Filters, { type Sort } from "./Filters";

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [query, setQuery] = useState("");

  const cats = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))) as Category[],
    [projects],
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => category === "all" || p.category === category)
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .sort((a, b) =>
        sort === "az"
          ? a.title.localeCompare(b.title)
          : sort === "oldest"
            ? a.year - b.year
            : b.year - a.year,
      );
  }, [projects, category, sort, query]);

  return (
    <>
      <Filters
        cats={cats}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
        query={query}
        setQuery={setQuery}
      />
      {list.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No projects match your filters.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </>
  );
}
