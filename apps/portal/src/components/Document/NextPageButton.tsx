import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export function NextPageButton(props: { href: string; name: string }) {
  return (
    <Link
      className="inline-flex items-center rounded-lg border text-sm duration-200 hover:border-active-border"
      href={props.href}
    >
      <div className="border-r-2 p-2.5 font-semibold">Next: {props.name}</div>
      <div className="p-2.5">
        <ArrowRightIcon className="size-5" />
      </div>
    </Link>
  );
}
