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
  /**
   * @deprecated only for legacy pages where we still need internal tabs for the moment, currently:
   * - /webhooks
   */
  tabs?: TabPathLink[];
};

export function ProjectPage(props: React.PropsWithChildren<ProjectPageProps>) {
  return (
    <div className={cn("flex flex-col pb-20", props.footer && "pb-0")}>
      <div className={cn(!props.tabs && "border-b")}>
        <ProjectPageHeader {...props.header} />
        {props.tabs && (
          <TabPathLinks
            scrollableClassName="container max-w-7xl"
            links={props.tabs}
          />
        )}
      </div>

      <main className="container max-w-7xl pt-6">{props.children}</main>
      {props.footer && (
        <div className="border-t mt-20">
          <ProjectPageFooter {...props.footer} />
        </div>
      )}
    </div>
  );
}
