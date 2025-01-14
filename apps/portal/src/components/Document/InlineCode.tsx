import { cn } from "../../lib/utils";

export function InlineCode(props: { code: string; className?: string }) {
  return (
    <code
      className={cn(
        "max-h-20 rounded-md border bg-b-700 px-1.5 py-0.5 text-[0.875em]",
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
