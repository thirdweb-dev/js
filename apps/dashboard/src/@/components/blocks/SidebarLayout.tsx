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
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "../../lib/utils";
import { AppFooter } from "../footers/app-footer";
import { NavLink } from "../ui/NavLink";
import { Separator } from "../ui/separator";
import { MobileSidebar, useActiveSidebarLink } from "./MobileSidebar";
import { CustomSidebar, type SidebarLink } from "./Sidebar";

export function SidebarLayout(props: {
  sidebarLinks: SidebarLink[];
  children: React.ReactNode;
  desktopSidebarClassName?: string;
  mobileSidebarClassName?: string;
  className?: string;
}) {
  const { sidebarLinks, children } = props;
  return (
    <div
      className={cn(
        "container flex w-full grow flex-col gap-6 px-4 max-sm:pt-6 lg:flex-row",
        props.className,
      )}
    >
      <CustomSidebar
        className={props.desktopSidebarClassName}
        links={sidebarLinks}
      />
      <MobileSidebar
        links={sidebarLinks}
        triggerClassName={props.mobileSidebarClassName}
      />
      {/* min-w-0 is enough to ensure the content inside does not stretch this container */}
      <main className="flex min-w-0 grow flex-col pb-10 max-sm:w-full lg:pt-8">
        {children}
      </main>
    </div>
  );
}

export function FullWidthSidebarLayout(props: {
  contentSidebarLinks: SidebarLink[];
  footerSidebarLinks?: SidebarLink[];
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
        <AppFooter containerClassName="max-w-7xl" />
      </div>
    </div>
  );
}

function RenderSidebarGroup(props: {
  sidebarLinks: SidebarLink[];
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

function RenderSidebarMenu(props: { links: SidebarLink[] }) {
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

function MobileSidebarTrigger(props: { links: SidebarLink[] }) {
  const activeLink = useActiveSidebarLink(props.links);

  return (
    <div className="flex items-center gap-3 border-b px-4 py-4 lg:hidden">
      <SidebarTrigger className="size-4" />
      <Separator className="h-4" orientation="vertical" />
      {activeLink && <span className="text-sm">{activeLink.label}</span>}
    </div>
  );
}
