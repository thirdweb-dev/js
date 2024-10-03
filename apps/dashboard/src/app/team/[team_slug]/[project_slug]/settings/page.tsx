import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { getAPIKeyForProjectId } from "../../../../api/lib/getAPIKeys";
import { ProjectGeneralSettingsPageForTeams } from "./ProjectGeneralSettingsPageForTeams";

export default async function Page(props: {
  params: { team_slug: string; project_slug: string };
}) {
  const { team_slug, project_slug } = props.params;
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
      team_slug={team_slug}
    />
  );
}
