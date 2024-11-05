import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const { project_slug, team_slug } = await props.params;
  const layoutPath = `/team/${team_slug}/${project_slug}/settings`;

  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container">
          <h1 className="font-semibold text-3xl tracking-tight">
            Project Settings
          </h1>
        </div>
      </div>
      <SidebarLayout
        sidebarLinks={[
          {
            label: "General",
            href: `${layoutPath}`,
            exactMatch: true,
          },
          {
            label: "In-App Wallets",
            href: `${layoutPath}/in-app-wallets`,
          },
          {
            label: "Account Abstraction",
            href: `${layoutPath}/account-abstraction`,
          },
          {
            label: "Pay",
            href: `${layoutPath}/pay`,
          },
        ]}
      >
        {props.children}
      </SidebarLayout>
    </div>
  );
}
