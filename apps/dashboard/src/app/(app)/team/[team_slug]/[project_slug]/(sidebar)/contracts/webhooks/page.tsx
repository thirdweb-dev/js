import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { getAuthToken } from "@app/api/lib/getAuthToken";
import { loginRedirect } from "@app/login/loginRedirect";
import { redirect } from "next/navigation";
import { ContractsWebhooksPageContent } from "../../webhooks/contract-webhooks/contract-webhooks-page";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;

  const [authToken, team, project] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/contracts/webhooks`,
    );
  }

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <div className="container flex max-w-7xl grow flex-col">
      <ContractsWebhooksPageContent project={project} authToken={authToken} />
    </div>
  );
}
