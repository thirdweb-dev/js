import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border p-2 shadow transition-shadow hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
