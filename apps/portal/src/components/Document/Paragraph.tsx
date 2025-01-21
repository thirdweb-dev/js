import { cn } from "@/lib/utils";

export function Paragraph(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-3 text-base text-foreground leading-7",
        props.className,
      )}
    >
      {props.children}
    </p>
  );
}
