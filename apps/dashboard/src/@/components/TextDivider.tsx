import { cn } from "@/lib/utils";

export function TextDivider(props: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center text-muted-foreground text-sm",
        props.className,
      )}
    >
      <span className="h-[1px] flex-1 bg-border" />
      <span className="mx-4">{props.text}</span>
      <span className="h-[1px] flex-1 bg-border" />
    </div>
  );
}
