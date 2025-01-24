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
          href: `/team/${params.team_slug}/~/test`,
          label: "Client",
          exactMatch: true,
        },
        {
          href: `/team/${params.team_slug}/~/test/server`,
          label: "RSC",
        },
        {
          href: `/team/${params.team_slug}/~/test/cache-client`,
          label: "RSC + Client",
        },
        {
          href: `/team/${params.team_slug}/~/test/client-persist`,
          label: "Client + Persister",
        },
        {
          href: `/team/${params.team_slug}/~/test/responsive-rsc`,
          label: "Responsive RSC",
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
}
