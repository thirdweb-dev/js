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
        "font-medium text-accent-500 transition-colors hover:text-f-100",
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
