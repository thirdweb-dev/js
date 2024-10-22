import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default async function Layout(
  props: {
    params: Promise<{
      team_slug: string;
      project_slug: string;
      engineId: string;
    }>;
    children: React.ReactNode;
  }
) {
  const linkPrefix = `/team/${(await props.params).team_slug}/${(await props.params).project_slug}/engine`;
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
