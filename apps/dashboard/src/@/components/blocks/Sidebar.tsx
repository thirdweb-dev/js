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

export type SidebarContentProps = {
  header?: React.ReactNode;
  links: SidebarLink[];
  className?: string;
};

export function Sidebar(props: SidebarContentProps) {
  return (
    <aside
      className={cn(
        "w-[230px] flex-shrink-0 hidden lg:block self-start sticky top-0",
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
                className="py-2 hover:bg-muted rounded-md px-3 text-muted-foreground text-sm flex items-center gap-2"
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
