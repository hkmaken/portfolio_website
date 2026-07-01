import {
  BookOpen,
  LayoutGrid,
  PenTool,
  Sparkles,
  Shapes,
  type LucideProps,
} from "lucide-react";

/**
 * Maps the kebab-case icon names used in config/site.ts (services) to Lucide
 * components. Note: lucide v1 removed brand/social glyphs, so social links are
 * rendered as text in the footer/contact page rather than icons.
 */
const MAP: Record<string, React.ComponentType<LucideProps>> = {
  "pen-tool": PenTool,
  "book-open": BookOpen,
  layout: LayoutGrid,
  sparkles: Sparkles,
};

export default function Icon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Cmp = MAP[name] ?? Shapes;
  return <Cmp {...props} />;
}
