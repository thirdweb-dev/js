import { cn } from "@/lib/utils";

export function InlineCode({
  code,
  className,
}: { code: string; className?: string }) {
  return (
    <code
      className={cn(
        "inline-block rounded bg-muted px-2 font-mono text-sm",
        className,
      )}
    >
      {code}
    </code>
  );
}
