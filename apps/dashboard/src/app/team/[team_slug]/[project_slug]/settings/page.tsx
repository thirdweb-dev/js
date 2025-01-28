import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { notFound, redirect } from "next/navigation";
import { getAPIKeyForProjectId } from "../../../../api/lib/getAPIKeys";
import { ProjectGeneralSettingsPageForTeams } from "./ProjectGeneralSettingsPageForTeams";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const team = await getTeamBySlug(team_slug);

  if (!team) {
    redirect("/team");
  }

  const project = await getProject(team_slug, project_slug);

  if (!project) {
    notFound();
  }

  const apiKey = await getAPIKeyForProjectId(project.id);

  if (!apiKey) {
    notFound();
  }

  return (
    <ProjectGeneralSettingsPageForTeams
      apiKey={apiKey}
      project_slug={project_slug}
      projectId={project.id}
      team={team}
    />
  );
}
