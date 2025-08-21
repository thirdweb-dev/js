import { Separator } from "../../ui/separator";
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
    <section className="flex flex-col gap-4 pb-20">
      <ProjectPageHeader {...props.header} />
      {props.tabs ? (
        <TabPathLinks
          className="-mt-4"
          tabContainerClassName="container"
          links={props.tabs}
        />
      ) : (
        <Separator />
      )}
      <main className="container py-6">{props.children}</main>
      {props.footer && (
        <>
          <Separator />
          <ProjectPageFooter {...props.footer} />
        </>
      )}
    </section>
  );
}
