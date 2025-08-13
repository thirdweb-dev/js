import { cn } from "@/lib/utils";

interface InlineCodeProps {
  code: string;
  className?: string;
}

export function InlineCode({ code, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
    >
      {code}
    </code>
  );
}
