import { getProject } from "@/api/projects";
import { getSMSCountryTiers } from "@/api/sms";
import { getTeamBySlug } from "@/api/team";
import { InAppWalletSettingsPage } from "components/embedded-wallets/Configure";
import { redirect } from "next/navigation";
import { getValidTeamPlan } from "../../../../../../components/TeamHeader/getValidTeamPlan";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project, smsCountryTiers] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),
    getSMSCountryTiers(),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  return (
    <InAppWalletSettingsPage
      project={project}
      teamId={team.id}
      trackingCategory="in-app-wallet-project-settings"
      teamSlug={team_slug}
      teamPlan={getValidTeamPlan(team)}
      smsCountryTiers={smsCountryTiers}
    />
  );
}
