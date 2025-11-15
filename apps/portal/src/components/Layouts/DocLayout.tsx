import { cn } from "@/lib/utils";
import { PageFooter } from "../Document/PageFooter";
import {
  DocSidebar,
  DocSidebarMobile,
  type SidebarLink,
} from "../others/Sidebar";
import { TableOfContentsSideBar } from "../others/TableOfContents";
import { CopyPageButton } from "../others/CopyPageButton";

export type SideBar = {
  name: string;
  links: SidebarLink[];
};

type DocLayoutProps = {
  sideBar: SideBar;
  children?: React.ReactNode;
  editPageButton?: true;
  showTableOfContents?: boolean;
  sidebarHeader?: React.ReactNode;
  noIndex?: boolean;
  noLLM?: boolean;
};

export function DocLayout(props: DocLayoutProps) {
  return (
    <div
      className={cn(
        "container relative flex flex-col gap-12 xl:grid",
        props.sideBar.links.length > 0
          ? props.showTableOfContents !== false
            ? "xl:grid-cols-[220px_820px_1fr]"
            : "xl:grid-cols-[220px_1160px]"
          : props.showTableOfContents !== false
            ? "xl:grid-cols-[960px_1fr]"
            : "",
      )}
      style={{
        minHeight: "calc(100vh - var(--sticky-top-height))",
      }}
    >
      {props.sideBar.links.length > 0 && (
        <aside
          className={cn(
            "sticky top-sticky-top-height h-sidebar-height flex-col overflow-y-auto no-scrollbar",
            "hidden xl:flex",
          )}
        >
          <DocSidebar {...props.sideBar} header={props.sidebarHeader} />
        </aside>
      )}
      <div className="sticky top-sticky-top-height z-stickyMobileSidebar border-b bg-card/50 backdrop-blur-xl p-4 xl:hidden -mx-4">
        <DocSidebarMobile {...props.sideBar} header={props.sidebarHeader} />
      </div>
      <main
        className="relative flex w-full flex-col overflow-hidden"
        data-no-llm={props.noLLM}
        data-noindex={props.noIndex}
      >
        <div className="grow xl:mt-6">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm text-muted-foreground">
              {props.sideBar.name}
            </h5>
            <CopyPageButton />
          </div>
          {props.children}
        </div>
        <div className="mt-16 xl:mt-20">
          <PageFooter
            editPageButton={props.editPageButton}
            sidebarLinks={props.sideBar.links}
          />
        </div>
      </main>
      {props.showTableOfContents !== false && <TableOfContentsSideBar />}
    </div>
  );
}
