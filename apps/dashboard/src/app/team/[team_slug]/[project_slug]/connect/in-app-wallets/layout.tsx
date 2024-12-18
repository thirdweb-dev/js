import { getProject } from "@/api/projects";
import { getAPIKeyForProjectId } from "app/api/lib/getAPIKeys";
import { notFound } from "next/navigation";
import { TabPathLinks } from "../../../../../../@/components/ui/tabs";
import { InAppWaletFooterSection } from "./_components/footer";
import { InAppWalletsHeader } from "./_components/header";
import { TRACKING_CATEGORY } from "./_constants";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const project = await getProject(
    (await props.params).team_slug,
    (await props.params).project_slug,
  );
  if (!project) {
    notFound();
  }

  const apiKey = await getAPIKeyForProjectId(project.id);
  if (!apiKey) {
    notFound();
  }

  const { team_slug, project_slug } = await props.params;

  return (
    <div>
      <InAppWalletsHeader clientId={apiKey.key} />
      <div className="h-8" />

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
        ]}
      />

      <div className="h-8" />
      {props.children}
      <div className="h-8" />
      <InAppWaletFooterSection trackingCategory={TRACKING_CATEGORY} />
    </div>
  );
}
