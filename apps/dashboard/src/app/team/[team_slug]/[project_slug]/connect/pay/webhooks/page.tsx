import { getProject } from "@/api/projects";
import { notFound } from "next/navigation";
import { PayWebhooksPage } from "../../../../../../(dashboard)/dashboard/connect/pay/components/webhooks.client";

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

  return <PayWebhooksPage clientId={project.publishableKey} />;
}
