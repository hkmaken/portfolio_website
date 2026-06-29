"use client";

import { Search } from "lucide-react";
import type { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Sort = "newest" | "oldest" | "az";

export default function Filters({
  cats,
  category,
  setCategory,
  sort,
  setSort,
  query,
  setQuery,
}: {
  cats: Category[];
  category: Category | "all";
  setCategory: (c: Category | "all") => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  query: string;
  setQuery: (q: string) => void;
}) {
  const options: (Category | "all")[] = ["all", ...cats];
  return (
    <div className="mb-10 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {options.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              category === c
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or tags"
            aria-label="Search projects by title or tags"
            className="pl-9"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            aria-label="Sort projects"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Alphabetical</option>
          </select>
        </label>
      </div>
    </div>
  );
}
