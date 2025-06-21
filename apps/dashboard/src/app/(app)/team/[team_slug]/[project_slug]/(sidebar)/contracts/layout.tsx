import { DeployedContractsPageHeader } from "@app/account/contracts/DeployedContractsPageHeader";
import { getAuthToken } from "@app/api/lib/getAuthToken";
import { loginRedirect } from "@app/login/loginRedirect";
import { redirect } from "next/navigation";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { TabPathLinks } from "@/components/ui/tabs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";

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
        teamId={team.id}
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
