"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

export default function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — please copy manually");
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
      aria-label={`Copy email address ${site.email}`}
    >
      {copied ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      {site.email}
    </button>
  );
}
