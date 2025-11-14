import { cn } from "@/lib/utils";
import { type TabPathLink, TabPathLinks } from "../../ui/tabs";
import {
  ProjectPageFooter,
  type ProjectPageFooterProps,
} from "./project-page-footer";
import {
  ProjectPageHeader,
  type ProjectPageHeaderProps,
} from "./project-page-header";

type ProjectPageProps = {
  header: ProjectPageHeaderProps;
  footer?: ProjectPageFooterProps;
  tabs?: TabPathLink[];
  containerClassName?: string;
};

export function ProjectPage(props: React.PropsWithChildren<ProjectPageProps>) {
  return (
    <div className="flex flex-col grow">
      <div className={cn(!props.tabs && "border-b")}>
        <ProjectPageHeader
          {...props.header}
          className={cn(
            props.tabs && props.tabs.length > 0 ? "pt-8 pb-6" : "py-8",
          )}
        />
        {props.tabs && (
          <TabPathLinks
            scrollableClassName="container max-w-7xl"
            links={props.tabs}
          />
        )}
      </div>

      <main
        className={cn("container max-w-7xl pt-6", props.containerClassName)}
      >
        {props.children}
      </main>
      <div className="h-20" />
      {props.footer && (
        <div className="border-t mt-auto">
          <ProjectPageFooter {...props.footer} />
        </div>
      )}
    </div>
  );
}
