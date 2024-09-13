import { cn } from "../../lib/utils";
import { MobileSidebar } from "./MobileSidebar";
import { Sidebar, type SidebarLink } from "./Sidebar";

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
        "flex flex-col lg:flex-row gap-6 container px-4 w-full grow max-sm:pt-6",
        props.className,
      )}
    >
      <Sidebar links={sidebarLinks} className={props.desktopSidebarClassName} />
      <MobileSidebar
        links={sidebarLinks}
        triggerClassName={props.mobileSidebarClassName}
      />
      {/* min-w-0 is enough to ensure the content inside does not stretch this container */}
      <main className="grow max-sm:w-full flex flex-col lg:pt-8 pb-10 min-w-0">
        {children}
      </main>
    </div>
  );
}
