import { getProject } from "@/api/projects";
import { TabPathLinks } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { InAppWalletFooterSection } from "./_components/footer";
import { InAppWalletsHeader } from "./_components/header";
import { TRACKING_CATEGORY } from "./_constants";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const { team_slug, project_slug } = params;

  return (
    <div>
      <InAppWalletsHeader />
      <TabPathLinks
        links={[
          {
            name: "Analytics",
            path: `/team/${team_slug}/${project_slug}/connect/in-app-wallets`,
            exactMatch: true,
          },
          {
            name: "Users",
            path: `/team/${team_slug}/${project_slug}/connect/in-app-wallets/users`,
            exactMatch: true,
          },
          {
            name: "Settings",
            path: `/team/${team_slug}/${project_slug}/connect/in-app-wallets/settings`,
            exactMatch: true,
          },
        ]}
      />

      <div className="h-8" />
      {props.children}
      <div className="h-8" />
      <InAppWalletFooterSection trackingCategory={TRACKING_CATEGORY} />
    </div>
  );
}
