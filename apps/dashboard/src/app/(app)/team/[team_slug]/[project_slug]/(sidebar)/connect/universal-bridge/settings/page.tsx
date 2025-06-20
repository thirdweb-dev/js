import { PayConfig } from "components/pay/PayConfig";
import { RouteDiscovery } from "components/pay/RouteDiscovery";
import { redirect } from "next/navigation";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { getFees } from "@/api/universal-bridge/developer";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../login/loginRedirect";

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
      `/team/${team_slug}/${project_slug}/connect/universal-bridge/settings`,
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
      createdAt: "",
      feeBps: 0,
      feeRecipient: "",
      updatedAt: "",
    };
  });

  if (!fees) {
    fees = {
      createdAt: "",
      feeBps: 0,
      feeRecipient: "",
      updatedAt: "",
    };
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex flex-col p-5">
      <PayConfig
        fees={fees}
        project={project}
        teamId={team.id}
        teamSlug={team_slug}
      />

      <div className="flex pt-5">
        <RouteDiscovery client={client} project={project} />
      </div>
    </div>
  );
}
