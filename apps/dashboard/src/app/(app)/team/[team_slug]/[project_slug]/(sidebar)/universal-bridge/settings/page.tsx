import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { getFees } from "@/api/universal-bridge/developer";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "@app/api/lib/getAuthToken";
import { loginRedirect } from "@app/login/loginRedirect";
import { PayConfig } from "components/pay/PayConfig";
import { RouteDiscovery } from "components/pay/RouteDiscovery";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [project, team, authToken] = await Promise.all([
    getProject(team_slug, project_slug),
    getTeamBySlug(team_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${team_slug}/${project_slug}/universal-bridge/settings`,
    );
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  let fees = await getFees({
    clientId: project.publishableKey,
    teamId: team.id,
  }).catch(() => {
    return {
      feeRecipient: "",
      feeBps: 0,
      createdAt: "",
      updatedAt: "",
    };
  });

  if (!fees) {
    fees = {
      feeRecipient: "",
      feeBps: 0,
      createdAt: "",
      updatedAt: "",
    };
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex flex-col">
      <PayConfig
        project={project}
        teamId={team.id}
        teamSlug={team_slug}
        fees={fees}
      />

      <div className="flex pt-5">
        <RouteDiscovery project={project} client={client} />
      </div>
    </div>
  );
}
