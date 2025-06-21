import { cn } from "../../lib/utils";

export function TextShimmer(props: { text: string; className?: string }) {
  return (
    <div className="flex">
      <p
        className={cn(
          "animate-text-shimmer bg-[length:200%_50%] bg-clip-text text-transparent will-change-auto",
          props.className,
        )}
        style={{
          backgroundImage:
            "linear-gradient(70deg, hsl(var(--muted-foreground)/50%) 50%, hsl(var(--foreground)) 70%, hsl(var(--muted-foreground)/50%) 100%)",
        }}
      >
        {props.text}
      </p>
    </div>
  );
}
