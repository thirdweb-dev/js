import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export function NextPageButton(props: { href: string; name: string }) {
  return (
    <Link
      href={props.href}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
    >
      <span> {props.name}</span>
      <ChevronRightIcon className="size-5" />
    </Link>
  );
}
