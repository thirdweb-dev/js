import { getProjects } from "@/api/projects";
import { TeamOverviewPage } from "./TeamOverviewPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const projects = await getProjects((await props.params).team_slug);

  return (
    <TeamOverviewPage
      projects={projects}
      team_slug={(await props.params).team_slug}
    />
  );
}
