import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getValidTeamPlan } from "@/utils/getValidTeamPlan";
import { loginRedirect } from "@/utils/redirects";
import { getSMSCountryTiers } from "./api/sms";
import { InAppWalletSettingsPage } from "./components";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project, smsCountryTiers, authToken] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),
    getSMSCountryTiers(),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${team_slug}/${project_slug}/wallets/user-wallets/configuration`,
    );
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex flex-col gap-6">
      <InAppWalletSettingsPage
        isLegacyPlan={team.isLegacyPlan}
        client={client}
        project={project}
        smsCountryTiers={smsCountryTiers}
        teamId={team.id}
        teamPlan={getValidTeamPlan(team)}
        teamSlug={team_slug}
      />
    </div>
  );
}
