import { DeployedContractsPageHeader } from "@app/account/contracts/DeployedContractsPageHeader";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  const [authToken, team, project] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/contracts`);
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  const layoutPath = `/team/${params.team_slug}/${params.project_slug}/contracts`;

  return (
    <div className="flex grow flex-col">
      <DeployedContractsPageHeader
        client={client}
        projectId={project.id}
        projectSlug={params.project_slug}
        teamId={team.id}
        teamSlug={params.team_slug}
      />
      <TabPathLinks
        links={[
          {
            exactMatch: true,
            name: "Contracts",
            path: layoutPath,
          },
          {
            name: "Webhooks",
            path: `${layoutPath}/webhooks`,
          },
        ]}
        scrollableClassName="container max-w-7xl"
      />
      <div className="h-6" />
      {props.children}
    </div>
  );
}
