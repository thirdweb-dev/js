import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  return (
    <SidebarLayout
      sidebarLinks={[
        {
          href: `/team/${params.team_slug}/~/usage`,
          exactMatch: true,
          label: "Overview",
        },
        {
          href: `/team/${params.team_slug}/~/usage/storage`,
          exactMatch: true,
          label: "Storage",
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
}
