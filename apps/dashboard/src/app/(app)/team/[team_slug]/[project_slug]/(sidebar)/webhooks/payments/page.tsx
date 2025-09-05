import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { PayWebhooksPage } from "../../payments/webhooks/components/webhooks.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const [authToken, params] = await Promise.all([getAuthToken(), props.params]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project || !authToken) {
    notFound();
  }

  return (
    <PayWebhooksPage
      clientId={project.publishableKey}
      teamId={project.teamId}
    />
  );
}
