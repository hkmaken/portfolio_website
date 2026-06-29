import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { site } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import Reveal from "@/components/Reveal";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-16 pb-12 md:grid-cols-[1.4fr_1fr] md:pt-24">
      <Reveal>
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            {site.role}
          </p>
          <h1 className="mt-4 text-balance font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
            {site.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {site.shortBio}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/portfolio" className={buttonVariants({ size: "lg" })}>
              View work <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl bg-muted">
          <Image
            src="/portrait.jpg"
            alt={`Portrait of ${site.name}`}
            fill
            sizes="(max-width: 768px) 80vw, 360px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </Reveal>
    </section>
  );
}
