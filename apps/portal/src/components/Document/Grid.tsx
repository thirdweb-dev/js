import { cn } from "@/lib/utils";

export function Grid(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "my-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
