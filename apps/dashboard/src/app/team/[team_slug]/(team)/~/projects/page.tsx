import { getProjects } from "@/api/projects";
import { TeamProjectsPage } from "./TeamProjectsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const projects = await getProjects((await props.params).team_slug);

  return (
    <TeamProjectsPage
      projects={projects}
      team_slug={(await props.params).team_slug}
    />
  );
}
