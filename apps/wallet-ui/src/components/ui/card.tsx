import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative border p-2 border-border rounded-md overflow-hidden transition-shadow shadow hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
