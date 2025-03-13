import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { PayConfig } from "../../../../../../../components/pay/PayConfig";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const { team_slug, project_slug } = await props.params;

  const [project, team] = await Promise.all([
    getProject(team_slug, project_slug),
    getTeamBySlug(team_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  return <PayConfig project={project} teamId={team.id} teamSlug={team_slug} />;
}
