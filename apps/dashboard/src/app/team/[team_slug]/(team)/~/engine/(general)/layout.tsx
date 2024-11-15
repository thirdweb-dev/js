import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const linkPrefix = `/team/${params.team_slug}/~/engine`;
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
