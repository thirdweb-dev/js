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

  return (
    <div className="flex grow flex-col">
      {/* header */}
      <div>
        <h1 className="mb-0.5 font-semibold text-3xl tracking-tight">
          Insight
        </h1>
        <p className="text-muted-foreground">
          APIs to retrieve blockchain data from any EVM chain, enrich it with
          metadata, and transform it using custom logic
        </p>
      </div>

      <div className="h-6" />

      {showFTUX ? (
        <InsightFTUX clientId={project.publishableKey} />
      ) : (
        <BlueprintCard />
      )}
    </div>
  );
}
