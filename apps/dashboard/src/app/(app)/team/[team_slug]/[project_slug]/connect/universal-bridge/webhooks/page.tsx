import { getProject } from "@/api/projects";
import { redirect } from "next/navigation";
import { getTeamBySlug } from "../../../../../../../../@/api/team";
import { PayWebhooksPage } from "./components/webhooks.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const params = await props.params;
  const [project, team] = await Promise.all([
    getProject(params.team_slug, params.project_slug),
    getTeamBySlug(params.team_slug),
  ]);

  if (!project || !team) {
    redirect(`/team/${params.team_slug}`);
  }

  return <PayWebhooksPage clientId={project.publishableKey} teamId={team.id} />;
}
