"use client";

import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { ThirdwebIcon } from "../../icons/ThirdwebMiniLogo";
import { ThemeToggle } from "../ThemeToggle";
import { FullPathSuspense } from "./full-path-suspense";

type ShadcnSidebarBaseLink = {
  href: string;
  label: React.ReactNode;
  exactMatch?: boolean;
  icon?: React.FC<{ className?: string }>;
};

export type ShadcnSidebarLink =
  | ShadcnSidebarBaseLink
  | {
      group: string;
      links: ShadcnSidebarLink[];
    }
  | {
      separator: true;
      className?: string;
    }
  | {
      subMenu: {
        icon?: React.FC<{ className?: string }>;
        label: string;
      };
      links: ShadcnSidebarLink[];
    };

type FullWidthSidebarLayoutProps = {
  contentSidebarLinks: ShadcnSidebarLink[];
  footerSidebarLinks?: ShadcnSidebarLink[];
  children: React.ReactNode;
  className?: string;
  fullPath: string;
};

export function FullWidthSidebarLayout(
  props: Omit<FullWidthSidebarLayoutProps, "fullPath">,
) {
  return (
    <FullPathSuspense
      render={(fullPath) => (
        <FullWidthSidebarLayoutInner {...props} fullPath={fullPath} />
      )}
    />
  );
}

function FullWidthSidebarLayoutInner(props: FullWidthSidebarLayoutProps) {
  const { contentSidebarLinks, children, footerSidebarLinks } = props;
  const sidebar = useSidebar();

  return (
    <div
      className={cn(
        "relative flex w-full flex-1 overflow-y-hidden",
        props.className,
      )}
    >
      {/* left - sidebar */}
      <Sidebar collapsible="icon" side="left">
        <div
          className={cn("p-5", !sidebar.open && "p-0 py-5 flex justify-center")}
        >
          <Link href="/" className="flex items-center gap-2">
            <ThirdwebIcon
              className="size-5 text-muted-foreground"
              isMonoChrome
            />
            {sidebar.open && (
              <span
                className={cn(
                  "font-semibold text-lg tracking-tight leading-none",
                )}
              >
                Playground
              </span>
            )}
          </Link>
        </div>

        <SidebarSeparator />

        <SidebarContent className="p-2 no-scrollbar">
          <RenderSidebarMenu
            links={contentSidebarLinks}
            fullPath={props.fullPath}
          />
        </SidebarContent>

        {footerSidebarLinks && (
          <SidebarFooter className="pb-3 pt-0">
            <RenderSidebarMenu
              links={footerSidebarLinks}
              fullPath={props.fullPath}
            />
            <SidebarSeparator />
            <ThemeToggle />
          </SidebarFooter>
        )}

        <SidebarRail />
      </Sidebar>

      {/* right - content */}
      <div className="flex h-full flex-grow flex-col overflow-y-auto">
        <div className="border-b p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <ThirdwebIcon
              className="size-6 text-muted-foreground"
              isMonoChrome
            />
            <span className="font-semibold text-lg leading-none tracking-tight">
              Playground
            </span>
          </div>
        </div>

        <MobileSidebarTrigger
          links={[...contentSidebarLinks, ...(footerSidebarLinks || [])]}
          fullPath={props.fullPath}
        />

        <main className="flex min-w-0 grow flex-col max-sm:w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function MobileSidebarTrigger(props: {
  links: ShadcnSidebarLink[];
  fullPath: string;
}) {
  const { links, fullPath } = props;
  const activeLink = useActiveShadcnSidebarLink({ links, fullPath });

  return (
    <div className="flex items-center gap-3 border-b px-4 py-4 lg:hidden">
      <SidebarTrigger className="size-4" />
      <Separator
        className="h-4 bg-muted-foreground/50"
        orientation="vertical"
      />
      {activeLink && "subMenu" in activeLink && (
        <>
          <span className="text-sm">{activeLink.subMenu.label}</span>
          <ChevronRightIcon className="size-4 text-muted-foreground/50 -mx-1.5" />
        </>
      )}
      {activeLink && "label" in activeLink && (
        <span className="text-sm">{activeLink.label}</span>
      )}
    </div>
  );
}

function useActiveShadcnSidebarLink(params: {
  links: ShadcnSidebarLink[];
  fullPath: string;
}) {
  const { links, fullPath } = params;
  const activeLink = useMemo(() => {
    const isActive = (link: ShadcnSidebarLink): boolean => {
      if ("href" in link) {
        // Handle exact match
        if (link.exactMatch) {
          return link.href === fullPath;
        }

        // Handle prefix match (ensure we don't match partial paths)
        return fullPath.startsWith(link.href);
      }

      if ("links" in link) {
        return link.links.some(isActive);
      }

      return false;
    };

    return links.find(isActive);
  }, [links, fullPath]);

  return activeLink;
}

function useIsSubnavActive(params: {
  links: ShadcnSidebarLink[];
  fullPath: string;
}) {
  const { links, fullPath } = params;
  const isSubnavActive = useMemo(() => {
    const isActive = (link: ShadcnSidebarLink): boolean => {
      if ("href" in link) {
        // Handle exact match
        if (link.exactMatch) {
          return link.href === fullPath;
        }

        return fullPath.startsWith(link.href);
      }

      if ("links" in link) {
        return link.links.some(isActive);
      }

      return false;
    };

    return links.some(isActive);
  }, [links, fullPath]);

  return isSubnavActive;
}

function RenderSidebarGroup(props: {
  sidebarLinks: ShadcnSidebarLink[];
  groupName: string;
  fullPath: string;
}) {
  return (
    <SidebarGroup className="p-0">
      <SidebarMenuItem>
        <SidebarGroupLabel> {props.groupName}</SidebarGroupLabel>
        <SidebarGroupContent>
          <RenderSidebarMenu
            links={props.sidebarLinks}
            fullPath={props.fullPath}
          />
        </SidebarGroupContent>
      </SidebarMenuItem>
    </SidebarGroup>
  );
}

function RenderSidebarSubmenu(props: {
  links: ShadcnSidebarLink[];
  subMenu: Omit<ShadcnSidebarBaseLink, "href" | "exactMatch">;
  fullPath: string;
}) {
  const isSubnavActive = useIsSubnavActive({
    links: props.links,
    fullPath: props.fullPath,
  });
  const sidebar = useSidebar();
  const [_open, setOpen] = useState<boolean | undefined>(undefined);
  const open = _open === undefined ? isSubnavActive : _open;

  // Add null check for links
  if (!props.links || props.links.length === 0) {
    return null;
  }

  return (
    <SidebarMenu>
      <DynamicHeight transition="height 200ms ease">
        <SidebarMenuItem>
          <Collapsible
            className="group/collapsible [&[data-state=open]>button>svg[data-chevron]]:rotate-90"
            defaultOpen={open}
            open={open}
            onOpenChange={setOpen}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className={cn(
                  "text-sm text-muted-foreground whitespace-nowrap hover:bg-accent hover:text-foreground",
                  isSubnavActive && "text-foreground",
                )}
              >
                {props.subMenu.icon && (
                  <props.subMenu.icon className="size-4" />
                )}
                <span>{props.subMenu.label}</span>

                {sidebar.open && (
                  <ChevronRightIcon
                    data-chevron
                    className="transition-transform ml-auto text-foreground"
                  />
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-0.5 [&>ul]:mr-0">
              <SidebarMenuSub className="pr-0 pl-2">
                {props.links.map((link, index) => {
                  if ("href" in link) {
                    return (
                      <SidebarMenuSubItem key={link.href}>
                        <NavLink
                          key={link.href}
                          activeClassName="text-foreground bg-accent "
                          className="flex items-center gap-2 text-muted-foreground text-sm hover:bg-accent hover:text-foreground px-2 py-1.5 rounded-lg w-full"
                          exactMatch={link.exactMatch}
                          href={link.href}
                          fullPath={props.fullPath}
                          onClick={() => {
                            sidebar.setOpenMobile(false);
                          }}
                        >
                          {link.icon && <link.icon className="size-4" />}
                          <span>{link.label}</span>
                        </NavLink>
                      </SidebarMenuSubItem>
                    );
                  }

                  if ("subMenu" in link) {
                    return (
                      <RenderSidebarSubmenu
                        key={`submenu_${link.subMenu.label}_${index}`}
                        links={link.links}
                        fullPath={props.fullPath}
                        subMenu={link.subMenu}
                      />
                    );
                  }

                  if ("group" in link) {
                    return (
                      <RenderSidebarGroup
                        key={`group_${link.group}_${index}`}
                        groupName={link.group}
                        sidebarLinks={link.links}
                        fullPath={props.fullPath}
                      />
                    );
                  }

                  return null;
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      </DynamicHeight>
    </SidebarMenu>
  );
}

function RenderSidebarMenu(props: {
  links: ShadcnSidebarLink[];
  fullPath: string;
}) {
  const sidebar = useSidebar();

  // Add null check for links
  if (!props.links || props.links.length === 0) {
    return null;
  }

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
                  fullPath={props.fullPath}
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
              className={cn("my-1", link.className)}
              // biome-ignore lint/suspicious/noArrayIndexKey:ok
              key={idx}
            />
          );
        }

        // subnav
        if ("subMenu" in link) {
          return (
            <RenderSidebarSubmenu
              key={`submenu_${link.subMenu.label}_${idx}`}
              links={link.links}
              subMenu={link.subMenu}
              fullPath={props.fullPath}
            />
          );
        }

        // group
        if ("group" in link) {
          return (
            <RenderSidebarGroup
              groupName={link.group}
              sidebarLinks={link.links}
              key={`group_${link.group}_${idx}`}
              fullPath={props.fullPath}
            />
          );
        }

        return null;
      })}
    </SidebarMenu>
  );
}
