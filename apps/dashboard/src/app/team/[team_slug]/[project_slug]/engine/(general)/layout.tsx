import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default function Layout(props: {
  params: {
    team_slug: string;
    project_slug: string;
    engineId: string;
  };
  children: React.ReactNode;
}) {
  const linkPrefix = `/team/${props.params.team_slug}/${props.params.project_slug}/engine`;
  const sidebarLinks: SidebarLink[] = [
    {
      label: "Overview",
      href: `${linkPrefix}`,
      exactMatch: true,
    },
    {
      label: "Create",
      href: `${linkPrefix}/create`,
    },
    {
      label: "Import",
      href: `${linkPrefix}/import`,
    },
  ];

  return (
    <SidebarLayout sidebarLinks={sidebarLinks}>{props.children}</SidebarLayout>
  );
}
