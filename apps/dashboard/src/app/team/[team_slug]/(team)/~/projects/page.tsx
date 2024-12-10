import { getProjects } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { TeamProjectsPage } from "./TeamProjectsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  const projects = await getProjects(params.team_slug);

  return <TeamProjectsPage projects={projects} team={team} />;
}
