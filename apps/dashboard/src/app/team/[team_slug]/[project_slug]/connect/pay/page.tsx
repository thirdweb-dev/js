import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { PayAnalytics } from "../../../../../../components/pay/PayAnalytics/PayAnalytics";

export default async function Page(props: {
  params: {
    team_slug: string;
    project_slug: string;
  };
}) {
  const project = await getProject(
    props.params.team_slug,
    props.params.project_slug,
  );

  if (!project) {
    notFound();
  }

  return <PayAnalytics clientId={project.publishableKey} />;
}
