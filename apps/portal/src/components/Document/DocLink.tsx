import Link from "next/link";
import { cn } from "@/lib/utils";

export function DocLink(props: {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
}) {
  return (
    <Link
      className={cn(
        "underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] transition-colors hover:decoration-foreground hover:decoration-solid",
        props.className,
      )}
      href={props.href}
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
