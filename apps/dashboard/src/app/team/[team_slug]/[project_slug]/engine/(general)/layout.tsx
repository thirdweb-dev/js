import { Sidebar } from "@/components/blocks/Sidebar";
import { getEngineGeneralSidebarLinks } from "./getEngineGeneralSidebarLinks";
import { EngineGeneralPageMobileSidebar } from "./sidebars";

export default function Layout(props: {
  params: {
    team_slug: string;
    project_slug: string;
    engineId: string;
  };
  children: React.ReactNode;
}) {
  const linkPrefix = `/team/${props.params.team_slug}/${props.params.project_slug}/engine`;
  const sidebarLinks = getEngineGeneralSidebarLinks(linkPrefix);

  return (
    <div className="container flex gap-6">
      <Sidebar links={sidebarLinks} />
      <div className="pt-6 grow max-sm:w-full">
        <EngineGeneralPageMobileSidebar links={sidebarLinks} />
        {props.children}
      </div>
    </div>
  );
}
