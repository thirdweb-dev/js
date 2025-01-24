import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Crumb = {
  name: string;
  href: string;
};

export function Breadcrumb(props: { crumbs: Crumb[] }) {
  return (
    <nav id="bradcrumb" className="mb-6" data-noindex>
      <ul className="flex flex-wrap items-center gap-1 text-sm">
        {props.crumbs.map((crumb, i) => {
          return (
            <li key={crumb.name} className="flex items-center gap-1">
              <Link
                href={crumb.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.name}
              </Link>
              {i !== props.crumbs.length - 1 && (
                <span className="text-muted-foreground opacity-50">
                  <ChevronRight size={16} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
