"use client";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { AppFooter } from "@/components/footers/app-footer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { NavLink } from "@/components/ui/NavLink";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type ShadcnSidebarBaseLink = {
  href: string;
  label: React.ReactNode;
  exactMatch?: boolean;
  icon?: React.FC<{ className?: string }>;
  isActive?: (pathname: string) => boolean;
};

type ShadcnSidebarLink =
  | ShadcnSidebarBaseLink
  | {
      group: string;
      links: ShadcnSidebarBaseLink[];
    }
  | {
      separator: true;
    }
  | {
      subMenu: Omit<ShadcnSidebarBaseLink, "href" | "exactMatch">;
      links: Omit<ShadcnSidebarBaseLink, "icon">[];
    };

export function FullWidthSidebarLayout(props: {
  contentSidebarLinks: ShadcnSidebarLink[];
  footerSidebarLinks?: ShadcnSidebarLink[];
  children: React.ReactNode;
  className?: string;
}) {
  const { contentSidebarLinks, children, footerSidebarLinks } = props;
  return (
    <div
      className={cn(
        "relative flex w-full flex-1 overflow-y-hidden",
        props.className,
      )}
    >
      {/* left - sidebar */}
      <Sidebar className="pt-2" collapsible="icon" side="left">
        <SidebarContent className="p-2">
          <RenderSidebarMenu links={contentSidebarLinks} />
        </SidebarContent>

        {footerSidebarLinks && (
          <SidebarFooter className="pb-3">
            <RenderSidebarMenu links={footerSidebarLinks} />
          </SidebarFooter>
        )}

        <SidebarRail />
      </Sidebar>

      {/* right - content */}
      <div className="flex h-full flex-grow flex-col overflow-y-auto">
        <MobileSidebarTrigger
          links={[...contentSidebarLinks, ...(footerSidebarLinks || [])]}
        />

        <main className="flex min-w-0 grow flex-col max-sm:w-full">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  );
}

function MobileSidebarTrigger(props: { links: ShadcnSidebarLink[] }) {
  const activeLink = useActiveShadcnSidebarLink(props.links);
  const parentSubNav = props.links.find(
    (link) =>
      "subMenu" in link && link.links.some((l) => l.href === activeLink?.href),
  );

  return (
    <div className="flex items-center gap-3 border-b px-4 py-4 lg:hidden">
      <SidebarTrigger className="size-4" />
      <Separator
        className="h-4 bg-muted-foreground/50"
        orientation="vertical"
      />
      {parentSubNav && "subMenu" in parentSubNav && (
        <>
          <span className="text-sm">{parentSubNav.subMenu.label}</span>
          <ChevronRightIcon className="size-4 text-muted-foreground/50 -mx-1.5" />
        </>
      )}
      {activeLink && <span className="text-sm">{activeLink.label}</span>}
    </div>
  );
}

function useActiveShadcnSidebarLink(links: ShadcnSidebarLink[]) {
  const pathname = usePathname();

  const activeLink = useMemo(() => {
    function isActive(link: ShadcnSidebarBaseLink) {
      if (link.exactMatch) {
        return link.href === pathname;
      }
      return pathname?.startsWith(link.href);
    }

    for (const link of links) {
      if ("links" in link) {
        for (const subLink of link.links) {
          if (isActive(subLink)) {
            return subLink;
          }
        }
      } else if ("href" in link) {
        if (isActive(link)) {
          return link;
        }
      }
    }
  }, [links, pathname]);

  return activeLink;
}

function useIsSubnavActive(links: ShadcnSidebarBaseLink[]) {
  const pathname = usePathname();

  const isSubnavActive = useMemo(() => {
    function isActive(link: ShadcnSidebarBaseLink) {
      if (link.exactMatch) {
        return link.href === pathname;
      }
      return pathname?.startsWith(link.href);
    }

    return links.some(isActive);
  }, [links, pathname]);

  return isSubnavActive;
}

function RenderSidebarGroup(props: {
  sidebarLinks: ShadcnSidebarLink[];
  groupName: string;
}) {
  return (
    <SidebarGroup className="p-0">
      <SidebarMenuItem>
        <SidebarGroupLabel> {props.groupName}</SidebarGroupLabel>
        <SidebarGroupContent>
          <RenderSidebarMenu links={props.sidebarLinks} />
        </SidebarGroupContent>
      </SidebarMenuItem>
    </SidebarGroup>
  );
}

function RenderSidebarSubmenu(props: {
  links: ShadcnSidebarBaseLink[];
  subMenu: Omit<ShadcnSidebarBaseLink, "href" | "exactMatch">;
}) {
  const sidebar = useSidebar();
  const isSubnavActive = useIsSubnavActive(props.links);
  return (
    <SidebarMenu>
      <DynamicHeight transition="height 200ms ease">
        <Collapsible className="group/collapsible" defaultOpen={isSubnavActive}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="text-sm text-muted-foreground whitespace-nowrap">
                {props.subMenu.icon && (
                  <props.subMenu.icon className="size-4" />
                )}
                <span>{props.subMenu.label}</span>
                <ChevronDownIcon className="ml-auto group-[[data-state=open]]/collapsible:rotate-180 transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-0.5">
              <SidebarMenuSub className="pr-0 pl-2">
                {props.links.map((link) => {
                  return (
                    <SidebarMenuSubItem key={link.href}>
                      <NavLink
                        activeClassName="text-foreground bg-accent "
                        className="flex items-center gap-2 text-muted-foreground text-sm hover:bg-accent hover:text-foreground px-2 py-1.5 rounded-lg w-full"
                        exactMatch={link.exactMatch}
                        href={link.href}
                        isActive={link.isActive}
                        onClick={() => {
                          sidebar.setOpenMobile(false);
                        }}
                      >
                        {link.icon && <link.icon className="size-4" />}
                        <span className="whitespace-nowrap">{link.label}</span>
                      </NavLink>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </DynamicHeight>
    </SidebarMenu>
  );
}

function RenderSidebarMenu(props: { links: ShadcnSidebarLink[] }) {
  const sidebar = useSidebar();
  return (
    <SidebarMenu className="gap-1.5">
      {props.links.map((link, idx) => {
        // link
        if ("href" in link) {
          return (
            <SidebarMenuSubItem key={link.href}>
              <SidebarMenuButton asChild>
                <NavLink
                  activeClassName="text-foreground bg-accent"
                  className="flex items-center gap-2 text-muted-foreground text-sm hover:bg-accent"
                  exactMatch={link.exactMatch}
                  href={link.href}
                  isActive={link.isActive}
                  onClick={() => {
                    sidebar.setOpenMobile(false);
                  }}
                >
                  {link.icon && <link.icon className="size-4" />}
                  <span>{link.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuSubItem>
          );
        }

        // separator
        if ("separator" in link) {
          return (
            <SidebarSeparator
              className="my-1"
              key={`separator-${
                // biome-ignore lint/suspicious/noArrayIndexKey: index is fine here
                idx
              }`}
            />
          );
        }

        // subnav
        if ("subMenu" in link) {
          return (
            <RenderSidebarSubmenu
              key={`submenu_$${
                // biome-ignore lint/suspicious/noArrayIndexKey:  index is fine here
                idx
              }`}
              links={link.links}
              subMenu={link.subMenu}
            />
          );
        }

        // group
        return (
          <RenderSidebarGroup
            groupName={link.group}
            key={link.group}
            sidebarLinks={link.links}
          />
        );
      })}
    </SidebarMenu>
  );
}
