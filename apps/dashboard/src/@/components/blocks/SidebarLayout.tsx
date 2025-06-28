"use client";

import { cn } from "../../lib/utils";
import { MobileSidebar } from "./MobileSidebar";
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
