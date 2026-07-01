import assert from "node:assert";
import { parseAndSort } from "./projects";
import { rawProjectSchema } from "./projects.schema";
import type { RawProject } from "@/types";

function raw(p: Partial<RawProject>): RawProject {
  return {
    title: "T",
    category: "Branding",
    year: 2024,
    services: [],
    description: "d",
    tools: [],
    deliverables: [],
    tags: [],
    featured: false,
    order: 0,
    ...p,
  } as RawProject;
}

// sort: featured first, then order asc, then year desc, then title
const sorted = parseAndSort([
  { slug: "b", raw: raw({ title: "B", featured: false, order: 1, year: 2020 }) },
  { slug: "a", raw: raw({ title: "A", featured: true, order: 5, year: 2019 }) },
  { slug: "c", raw: raw({ title: "C", featured: false, order: 1, year: 2023 }) },
]);
assert.deepStrictEqual(
  sorted.map((p) => p.slug),
  ["a", "c", "b"],
  "featured first, then order, then year desc",
);

// invalid project.json should be rejected by the schema
assert.throws(() => rawProjectSchema.parse({ title: "" }), "empty title rejected");

console.log("projects.test OK");
