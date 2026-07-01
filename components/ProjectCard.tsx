import Link from "next/link";
import Image from "next/image";
import Tag from "./Tag";
import type { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/portfolio/${project.slug}/`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          placeholder="blur"
          blurDataURL={project.cover.blurDataURL}
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Tag>{project.category}</Tag>
        <span className="text-sm text-muted-foreground">{project.year}</span>
      </div>
      <h3 className="mt-1 font-serif text-xl group-hover:underline">
        {project.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {project.description}
      </p>
    </Link>
  );
}
