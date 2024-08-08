import type React from "react";
import { cn } from "../../lib/utils";
import { NavLink } from "../ui/NavLink";

export type SidebarContentProps = {
  header?: React.ReactNode;
  links?: { href: string; label: React.ReactNode }[];
  className?: string;
};

export function Sidebar(props: SidebarContentProps) {
  return (
    <aside
      className={cn("w-[240px] flex-shrink-0 hidden lg:block", props.className)}
    >
      <div className="sticky top-0 pt-8">
        {props.header}
        <div className="flex flex-col border-l-2 border-border">
          {props.links?.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="text-sm py-1.5 pl-4 text-muted-foreground hover:text-foreground border-l-2 ml-[-2px] border-transparent hover:border-foreground transition-colors"
              activeClassName="text-foreground border-link-foreground"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
