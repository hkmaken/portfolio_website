import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const routes = ["", "/portfolio", "/about", "/contact"].map((r) => ({
    url: `${site.url}${r}`,
    lastModified: new Date(),
  }));
  return [
    ...routes,
    ...projects.map((p) => ({
      url: `${site.url}/portfolio/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
