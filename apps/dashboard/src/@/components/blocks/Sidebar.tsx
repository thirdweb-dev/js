import { ExternalLinkIcon } from "lucide-react";
import type React from "react";
import { cn } from "../../lib/utils";
import { NavLink } from "../ui/NavLink";
import { Separator } from "../ui/separator";

export type SidebarBaseLink = {
  href: string;
  label: React.ReactNode;
  exactMatch?: boolean;
  icon?: React.FC<{ className?: string }>;
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
    }
  | {
      separator: true;
    };

type SidebarContentProps = {
  header?: React.ReactNode;
  links: SidebarLink[];
  className?: string;
};

export function CustomSidebar(props: SidebarContentProps) {
  return (
    <div className={cn("hidden w-[230px] shrink-0 lg:block", props.className)}>
      <aside className="sticky top-0 self-start">
        <div className="py-7">
          {props.header}
          <div className="flex flex-col gap-1">
            <RenderSidebarLinks links={props.links} />
          </div>
        </div>
      </aside>
    </div>
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

        if ("separator" in link) {
          return <Separator className="my-2" />;
        }

        const isExternal = link.href.startsWith("http");
        return (
          <NavLink
            // biome-ignore lint/suspicious/noArrayIndexKey: items won't be reordered
            key={i}
            href={link.href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm hover:bg-accent"
            activeClassName="text-foreground bg-accent"
            exactMatch={link.exactMatch}
          >
            {link.icon && <link.icon className="size-4" />}
            {link.label}
            {isExternal && <ExternalLinkIcon className="size-3" />}
          </NavLink>
        );
      })}
    </div>
  );
}
