import { z } from "zod";
import { CATEGORIES } from "@/types";

export const rawProjectSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  category: z.enum(CATEGORIES),
  client: z.string().optional(),
  year: z.number().int(),
  services: z.array(z.string()).default([]),
  description: z.string().min(1),
  problem: z.string().optional(),
  process: z.string().optional(),
  solution: z.string().optional(),
  tools: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});
