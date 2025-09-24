import { cn } from "../../lib/utils";

export function InlineCode(props: { code: string; className?: string }) {
  return (
    <code
      className={cn(
        "max-h-20 rounded-lg bg-muted border px-1.5 py-[3px] text-[0.875em]",
        props.className,
      )}
      style={{
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {props.code}
    </code>
  );
}
