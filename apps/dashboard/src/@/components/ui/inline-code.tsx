import { cn } from "@/lib/utils";

export function InlineCode({
  code,
  className,
}: { code: string; className?: string }) {
  return (
    <code
      className={cn(
        "mx-0.5 inline rounded-lg border border-border bg-muted px-[0.4em] py-[0.25em] font-mono text-[0.85em] text-foreground",
        className,
      )}
    >
      {code}
    </code>
  );
}
