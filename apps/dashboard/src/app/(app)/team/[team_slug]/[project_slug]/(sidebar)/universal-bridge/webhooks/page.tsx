import { redirect } from "next/navigation";
import { getProject } from "@/api/projects";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
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

  return (
    <div>
      <h2 className="mb-0.5 font-semibold text-xl tracking-tight">Webhooks</h2>
      <p className="text-muted-foreground text-sm">
        Get notified for Bridge, Swap and Onramp events.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/pay/webhooks"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </UnderlineLink>
      </p>
      <div className="h-4" />
      <PayWebhooksPage
        clientId={project.publishableKey}
        teamId={project.teamId}
      />
    </div>
  );
}
