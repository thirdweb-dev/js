import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { PayAnalytics } from "../../../../../../components/pay/PayAnalytics/PayAnalytics";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const project = await getProject(
    (await props.params).team_slug,
    (await props.params).project_slug,
  );

  if (!project) {
    notFound();
  }

  return (
    <PayAnalytics
      clientId={project.publishableKey}
      projectId={project.id}
      teamId={project.teamId}
    />
  );
}
