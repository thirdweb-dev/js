import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default async function Layout(props: {
  children?: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const layoutPath = `/team/${params.team_slug}/${params.project_slug}/contracts`;

  return (
    <SidebarLayout
      sidebarLinks={[
        {
          href: layoutPath,
          label: "Deployed contracts",
          exactMatch: true,
        },
        {
          href: `${layoutPath}/published`,
          label: "Published contracts",
          exactMatch: true,
        },
      ]}
    >
      {props.children}
    </SidebarLayout>
  );
}
