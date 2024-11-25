import { cn } from "@/lib/utils";

export function InlineCode({
  code,
  className,
}: { code: string; className?: string }) {
  return (
    <code
      className={cn(
        "mx-0.5 inline rounded-lg border border-border px-1.5 py-[3px] font-mono text-[0.85em] text-foreground",
        className,
      )}
    >
      {code}
    </code>
  );
}
