import { getProjects } from "@/api/projects";
import { notFound } from "next/navigation";
import { EmptyState } from "./components/EmptyState";
import { ProjectOverviewHeader } from "./components/ProjectOverviewHeader";

export default async function ProjectOverviewPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const projects = await getProjects(params.team_slug);

  const project = projects.find((p) => p.slug === params.project_slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="">
      <div className="w-full border-border-800 border-b px-6 dark:bg-muted/50">
        <div className="container">
          <ProjectOverviewHeader project={project} />
        </div>
      </div>
      <EmptyState />
    </div>
  );
}
