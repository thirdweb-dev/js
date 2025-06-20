import { getProject } from "@/api/projects";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { getAuthToken } from "@app/api/lib/getAuthToken";
import { notFound } from "next/navigation";
import { ContractsWebhooksPageContent } from "./contract-webhooks/contract-webhooks-page";

export default async function WebhooksPage({
  params,
}: { params: Promise<{ team_slug: string; project_slug: string }> }) {
  const [authToken, resolvedParams] = await Promise.all([
    getAuthToken(),
    params,
  ]);

  const project = await getProject(
    resolvedParams.team_slug,
    resolvedParams.project_slug,
  );

  if (!project || !authToken) {
    notFound();
  }

  return (
    <div className="flex grow flex-col">
      <div className="border-b py-10">
        <div className="container max-w-7xl">
          <h1 className="mb-1 font-semibold text-3xl tracking-tight">
            Webhooks
          </h1>
          <p className="text-muted-foreground text-sm">
            Create and manage webhooks to get notified about blockchain events,
            transactions and more.{" "}
            <UnderlineLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://portal.thirdweb.com/insight/webhooks"
            >
              Learn more about webhooks.
            </UnderlineLink>
          </p>
        </div>
      </div>
      <div className="h-6" />
      <div className="container max-w-7xl">
        <ContractsWebhooksPageContent project={project} authToken={authToken} />
      </div>
      <div className="h-20" />
    </div>
  );
}
