import { loginRedirect } from "@app/login/loginRedirect";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { getSMSCountryTiers } from "@/api/sms";
import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getValidTeamPlan } from "@/utils/getValidTeamPlan";
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
    loginRedirect(`/team/${team_slug}/wallets/settings`);
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
    <InAppWalletSettingsPage
      client={client}
      project={project}
      smsCountryTiers={smsCountryTiers}
      teamId={team.id}
      teamPlan={getValidTeamPlan(team)}
      teamSlug={team_slug}
    />
  );
}
