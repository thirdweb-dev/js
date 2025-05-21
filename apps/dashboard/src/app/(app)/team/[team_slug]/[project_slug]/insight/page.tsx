import { isProjectActive } from "@/api/analytics";
import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { BlueprintCard } from "./blueprint-card";
import { InsightFTUX } from "./insight-ftux";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const params = await props.params;

  const [team, project] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!team || !project) {
    notFound();
  }

  const activeResponse = await isProjectActive({
    teamId: team.id,
    projectId: project.id,
  });

  const showFTUX = !activeResponse.insight;

  if (showFTUX) {
    return <InsightFTUX clientId={project.publishableKey} />;
  }

  return <BlueprintCard />;
}
