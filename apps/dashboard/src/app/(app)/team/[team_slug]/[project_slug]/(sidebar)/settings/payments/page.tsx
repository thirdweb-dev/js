import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { getFees } from "@/api/universal-bridge/developer";
import { getProjectWallet } from "@/lib/server/project-wallet";
import { loginRedirect } from "@/utils/redirects";
import { ProjectSettingsBreadcrumb } from "../_components/project-settings-breadcrumb";
import { PayConfig } from "./PayConfig";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [team, project, authToken] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),

    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${team_slug}/${project_slug}/settings/payments`);
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const projectWallet = await getProjectWallet(project);

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

  return (
    <div className="flex flex-col gap-5">
      <ProjectSettingsBreadcrumb
        teamSlug={team_slug}
        projectSlug={project_slug}
        page="Payments"
      />

      <PayConfig
        fees={fees}
        project={project}
        teamId={team.id}
        projectWalletAddress={projectWallet?.address}
        teamSlug={team_slug}
      />
    </div>
  );
}
