import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getWebhookById } from "@/api/universal-bridge/developer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { WebhookSends } from "./webhook-sends";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
    id: string;
  }>;
}) {
  const [authToken, params] = await Promise.all([getAuthToken(), props.params]);

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project || !authToken) {
    notFound();
  }

  const webhook = await getWebhookById({
    clientId: project.publishableKey,
    teamId: project.teamId,
    authToken,
    webhookId: params.id,
  });

  if (!webhook) {
    notFound();
  }

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/team/${params.team_slug}/${params.project_slug}/bridge/webhooks`}
              >
                Webhooks
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="h-4" />

      <div className="space-y-0.5 border-b border-dashed pb-6 overflow-hidden ">
        <h1 className="text-xl font-semibold tracking-tight">
          {webhook.label || "Untitled Webhook"}
        </h1>
        <CopyTextButton
          textToCopy={webhook.url}
          textToShow={webhook.url}
          tooltip="Copy URL"
          variant="ghost"
          className="text-muted-foreground text-sm -translate-x-1.5 truncate max-w-full"
          copyIconPosition="right"
        />
      </div>

      <WebhookSends
        webhookId={params.id}
        authToken={authToken}
        projectClientId={project.publishableKey}
        teamId={project.teamId}
      />
    </div>
  );
}
