import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { loginRedirect } from "@/utils/redirects";

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
      <div>
        <h2 className="mb-0.5 font-semibold text-xl tracking-tight">
          Webhooks
        </h2>
        <p className="text-muted-foreground text-sm">
          Create and manage webhooks to get notified about blockchain events,
          transactions and more.{" "}
          <UnderlineLink
            href="https://portal.thirdweb.com/insight/webhooks"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more
          </UnderlineLink>
        </p>
      </div>
      <div className="h-4" />
      <ContractsWebhooksPageContent authToken={authToken} project={project} />
    </div>
  );
}
