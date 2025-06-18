import {
  type WebhookResponse,
  getSupportedWebhookChains,
  getWebhooks,
} from "@/api/insight/webhooks";
import { getProject } from "@/api/projects";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { notFound } from "next/navigation";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { CreateWebhookModal } from "./components/CreateWebhookModal";
import { WebhooksTable } from "./components/WebhooksTable";

export default async function WebhooksPage({
  params,
}: { params: Promise<{ team_slug: string; project_slug: string }> }) {
  let webhooks: WebhookResponse[] = [];
  let errorMessage = "";
  let supportedChainIds: number[] = [];

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

  const projectClientId = project.publishableKey;

  try {
    const webhooksRes = await getWebhooks(projectClientId);
    if (webhooksRes.error) {
      errorMessage = webhooksRes.error;
    } else if (webhooksRes.data) {
      webhooks = webhooksRes.data;
    }

    const supportedChainsRes = await getSupportedWebhookChains();
    if ("chains" in supportedChainsRes) {
      supportedChainIds = supportedChainsRes.chains;
    } else {
      errorMessage = supportedChainsRes.error;
    }
  } catch (error) {
    errorMessage = "Failed to load webhooks. Please try again later.";
    console.error("Error loading project or webhooks", error);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

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
        {errorMessage ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
            <div>
              <h3 className="mb-1 font-medium text-destructive text-lg">
                Unable to load webhooks
              </h3>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>
          </div>
        ) : webhooks.length > 0 ? (
          <WebhooksTable
            webhooks={webhooks}
            projectClientId={projectClientId}
            client={client}
            supportedChainIds={supportedChainIds}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border p-12 text-center">
            <div>
              <h3 className="mb-1 font-medium text-lg">No webhooks found</h3>
              <p className="text-muted-foreground">
                Create a webhook to get started.
              </p>
            </div>
            <CreateWebhookModal
              client={client}
              projectClientId={projectClientId}
              supportedChainIds={supportedChainIds}
            />
          </div>
        )}
      </div>
      <div className="h-20" />
    </div>
  );
}
