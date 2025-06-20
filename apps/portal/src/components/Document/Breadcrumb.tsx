import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type Crumb = {
  name: string;
  href: string;
};

export function Breadcrumb(props: { crumbs: Crumb[] }) {
  return (
    // biome-ignore lint/nursery/useUniqueElementIds: this acts as a target for hrefs
    <nav className="mb-6" data-noindex id="bradcrumb">
      <ul className="flex flex-wrap items-center gap-1 text-sm">
        {props.crumbs.map((crumb, i) => {
          return (
            <li className="flex items-center gap-1" key={crumb.name}>
              <Link
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                href={crumb.href}
              >
                {crumb.name}
              </Link>
              {i !== props.crumbs.length - 1 && (
                <span className="text-muted-foreground opacity-50">
                  <ChevronRightIcon className="size-4" />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
