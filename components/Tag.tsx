import { cn } from "@/lib/utils";

export default function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
