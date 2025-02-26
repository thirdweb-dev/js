import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { InAppWalletSettingsPage } from "../../../../../../../components/embedded-wallets/Configure";
import { getValidTeamPlan } from "../../../../../components/TeamHeader/getValidTeamPlan";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),
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
      validTeamPlan={getValidTeamPlan(team)}
    />
  );
}
