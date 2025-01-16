import { ExternalLinkIcon } from "lucide-react";
import type React from "react";
import { cn } from "../../lib/utils";
import { NavLink } from "../ui/NavLink";

export type SidebarBaseLink = {
  href: string;
  label: React.ReactNode;
  exactMatch?: boolean;
  tracking?: {
    category: string;
    action: string;
    label: string;
  };
};

export type SidebarLink =
  | SidebarBaseLink
  | {
      group: string;
      links: SidebarBaseLink[];
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
      <div className="py-7">
        {props.header}
        <div className="flex flex-col gap-1">
          <RenderSidebarLinks links={props.links} />
        </div>
      </div>
    </aside>
  );
}

export function RenderSidebarLinks(props: { links: SidebarLink[] }) {
  return (
    <div className="flex flex-col gap-1">
      {props.links.map((link, i) => {
        if ("group" in link) {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: items won't be reordered
            <div className={cn({ "mt-6": i !== 0 })} key={i}>
              <p className={cn("px-3 py-2 font-medium text-foreground")}>
                {link.group}
              </p>
              <RenderSidebarLinks links={link.links} />
            </div>
          );
        }

        const isExternal = link.href.startsWith("http");
        return (
          <NavLink
            // biome-ignore lint/suspicious/noArrayIndexKey: items won't be reordered
            key={i}
            href={link.href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm hover:bg-accent"
            activeClassName="text-foreground"
            exactMatch={link.exactMatch}
          >
            {link.label}
            {isExternal && <ExternalLinkIcon className="size-3" />}
          </NavLink>
        );
      })}
    </div>
  );
}
