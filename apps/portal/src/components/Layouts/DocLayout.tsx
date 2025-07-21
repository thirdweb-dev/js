import clsx from "clsx";
import { PageFooter } from "../Document/PageFooter";
import {
  DocSidebar,
  DocSidebarMobile,
  type SidebarLink,
} from "../others/Sidebar";
import { TableOfContentsSideBar } from "../others/TableOfContents";

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
      className={`container text-muted-foreground relative flex flex-col gap-12 xl:grid p-4 ${
        props.showTableOfContents !== false
          ? "xl:grid-cols-[220px_720px_1fr]"
          : "xl:grid-cols-[220px_1160px]"
      }`}
      style={{
        minHeight: "calc(100vh - var(--sticky-top-height))",
      }}
    >
      <aside
        className={clsx(
          "sticky top-sticky-top-height h-sidebar-height flex-col overflow-y-scroll no-scrollbar",
          "hidden xl:flex",
        )}
      >
        <DocSidebar {...props.sideBar} header={props.sidebarHeader} />
      </aside>
      <div className="sticky top-sticky-top-height z-stickyMobileSidebar border-b bg-background py-4 xl:hidden">
        <DocSidebarMobile {...props.sideBar} header={props.sidebarHeader} />
      </div>
      <main
        className="relative flex w-full flex-col overflow-hidden"
        data-no-llm={props.noLLM}
        data-noindex={props.noIndex}
      >
        <div className="grow xl:mt-6">
          <h5 className="mb-2 text-sm font-semibold text-violet-500">
            {props.sideBar.name}
          </h5>
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
