import { cn } from "@/lib/utils";

export function DotsBackgroundPattern(props: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 text-foreground/30 dark:text-foreground/10",
        props.className,
      )}
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 50%)",
      }}
    />
  );
}
