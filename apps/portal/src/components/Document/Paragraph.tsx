import { cn } from "@/lib/utils";

export function Paragraph(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mb-3 leading-7", props.className)}>{props.children}</p>
  );
}
