import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { DeployedContractsPage } from "../../../../../account/contracts/_components/DeployedContractsPage";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";

export default async function Page(props: {
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

  return (
    <DeployedContractsPage
      teamId={team.id}
      projectId={project.id}
      authToken={authToken}
    />
  );
}
