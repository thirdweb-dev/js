import { SidebarLayout } from "@/components/blocks/SidebarLayout";

export default function Layout(props: {
  children: React.ReactNode;
  params: {
    team_slug: string;
    project_slug: string;
  };
}) {
  const { project_slug, team_slug } = props.params;
  const layoutPath = `/team/${team_slug}/${project_slug}/settings`;

  return (
    <div className="grow flex flex-col">
      <div className="py-10 border-b border-border">
        <div className="container">
          <h1 className="text-3xl tracking-tight font-semibold">
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
