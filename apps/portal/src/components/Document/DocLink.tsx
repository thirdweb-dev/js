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
        "underline decoration-violet-800 decoration-dotted underline-offset-[5px] transition-colors hover:decoration-violet-800 hover:decoration-solid hover:text-foreground",
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
