import { cn } from "@/lib/utils";
import Link from "next/link";

export function DocLink(props: {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
}) {
  return (
    <Link
      href={props.href}
      className={cn(
        "underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] transition-colors hover:decoration-foreground hover:decoration-solid",
        props.className,
      )}
      target={
        props.target ||
        (props.href.startsWith("http") || props.href.includes(".pdf")
          ? "_blank"
          : undefined)
      }
    >
      {props.children}
    </Link>
  );
}
