import { getProject } from "@/api/projects";
import { redirect } from "next/navigation";
import { PayWebhooksPage } from "./components/webhooks.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const params = await props.params;
  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return <PayWebhooksPage clientId={project.publishableKey} />;
}
