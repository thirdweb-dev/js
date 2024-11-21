import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container">
          <h1 className="font-semibold text-3xl tracking-tight lg:px-2">
            Usage
          </h1>
        </div>
      </div>
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
    </div>
  );
}
