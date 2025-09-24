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
        "text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 decoration-dotted transition-colors ",
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
