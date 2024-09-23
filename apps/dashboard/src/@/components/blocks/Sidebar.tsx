import { ExternalLinkIcon } from "lucide-react";
import type React from "react";
import { cn } from "../../lib/utils";
import { NavLink } from "../ui/NavLink";

export type SidebarLink = {
  href: string;
  label: React.ReactNode;
  exactMatch?: boolean;
  tracking?: {
    category: string;
    action: string;
    label: string;
  };
};

type SidebarContentProps = {
  header?: React.ReactNode;
  links: SidebarLink[];
  className?: string;
};

export function Sidebar(props: SidebarContentProps) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden w-[230px] flex-shrink-0 self-start lg:block",
        props.className,
      )}
    >
      <div className="pt-7">
        {props.header}
        <div className="flex flex-col gap-1">
          {props.links?.map((link) => {
            const isExternal = link.href.startsWith("http");
            return (
              <NavLink
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm hover:bg-muted"
                activeClassName="text-foreground"
                exactMatch={link.exactMatch}
              >
                {link.label}
                {isExternal && <ExternalLinkIcon className="size-3" />}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
