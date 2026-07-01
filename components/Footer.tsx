import Link from "next/link";
import { site } from "@/config/site";
import CopyEmail from "@/components/CopyEmail";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {site.role}
          </p>
          <div className="mt-4">
            <CopyEmail />
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Elsewhere
          </p>
          <ul className="space-y-2">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
