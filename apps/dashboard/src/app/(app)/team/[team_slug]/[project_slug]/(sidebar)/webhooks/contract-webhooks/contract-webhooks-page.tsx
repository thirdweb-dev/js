import {
  getSupportedWebhookChains,
  getWebhooks,
  type WebhookResponse,
} from "@/api/insight/webhooks";
import type { Project } from "@/api/project/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { CreateContractWebhookButton } from "../components/CreateWebhookModal";
import { ContractsWebhooksTable } from "../components/WebhooksTable";

export async function ContractsWebhooksPageContent(props: {
  project: Project;
  authToken: string;
}) {
  let webhooks: WebhookResponse[] = [];
  let errorMessage = "";
  let supportedChainIds: number[] = [];

  const projectClientId = props.project.publishableKey;

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
    jwt: props.authToken,
    teamId: props.project.teamId,
  });

  return (
    <div className="flex grow flex-col">
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
        <ContractsWebhooksTable
          client={client}
          projectClientId={projectClientId}
          supportedChainIds={supportedChainIds}
          webhooks={webhooks}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border p-12 text-center">
          <div>
            <h3 className="mb-1 font-medium text-lg">No webhooks found</h3>
            <p className="text-muted-foreground">
              Create a webhook to get started.
            </p>
          </div>
          <CreateContractWebhookButton
            client={client}
            projectClientId={projectClientId}
            supportedChainIds={supportedChainIds}
          />
        </div>
      )}
    </div>
  );
}
