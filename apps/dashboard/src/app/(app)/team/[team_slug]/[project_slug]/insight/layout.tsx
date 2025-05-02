import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { InsightPageLayout } from "./InsightPageLayout";

export default async function Layout(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  children: React.ReactNode;
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
    <InsightPageLayout
      projectSlug={project.slug}
      teamSlug={team_slug}
      projectId={project.id}
    >
      {props.children}
    </InsightPageLayout>
  );
}
