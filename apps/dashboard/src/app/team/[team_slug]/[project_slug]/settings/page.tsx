import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { ProjectGeneralSettingsPage } from "./ProjectGeneralSettingsPage";

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
    <ProjectGeneralSettingsPage
      project={project}
      teamSlug={team_slug}
      showNebulaSettings={team.enabledScopes.includes("nebula")}
    />
  );
}
