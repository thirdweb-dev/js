import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/projects";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { ContractsWebhooksPageContent } from "../contract-webhooks/contract-webhooks-page";

export default async function Page({
  params,
}: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
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
    <div>
      <h2 className="mb-0.5 font-semibold text-xl tracking-tight">
        Contract Webhooks
      </h2>
      <p className="text-muted-foreground text-sm">
        Get notified about blockchain events, transactions and more.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/insight/webhooks"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </UnderlineLink>
      </p>
      <div className="h-4" />
      <ContractsWebhooksPageContent authToken={authToken} project={project} />
    </div>
  );
}
