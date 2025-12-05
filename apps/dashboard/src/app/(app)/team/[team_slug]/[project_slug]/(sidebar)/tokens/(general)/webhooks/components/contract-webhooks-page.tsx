import { XIcon } from "lucide-react";
import { getWebhooks, type WebhookResponse } from "@/api/insight/webhooks";
import type { Project } from "@/api/project/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { CreateContractWebhookButton } from "./CreateWebhookModal";
import { ContractsWebhooksTable } from "./WebhooksTable";

export async function ContractsWebhooksPageContent(props: {
  project: Project;
  authToken: string;
  supportedChainIds: number[];
}) {
  let webhooks: WebhookResponse[] = [];
  let errorMessage = "";

  const projectClientId = props.project.publishableKey;

  try {
    const webhooksRes = await getWebhooks(projectClientId);
    if (webhooksRes.error) {
      errorMessage = webhooksRes.error;
    } else if (webhooksRes.data) {
      webhooks = webhooksRes.data;
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
          supportedChainIds={props.supportedChainIds}
          webhooks={webhooks}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border py-14 px-6 text-center">
          <div>
            <div className="rounded-full p-2 border bg-background inline-flex mb-3">
              <XIcon className="size-4 text-muted-foreground" />
            </div>
            <h3 className="mb-1 font-semibold text-base">No webhooks found</h3>
            <p className="text-muted-foreground text-sm">
              Create a webhook to get started
            </p>
          </div>
          <CreateContractWebhookButton
            client={client}
            projectClientId={projectClientId}
            supportedChainIds={props.supportedChainIds}
          />
        </div>
      )}
    </div>
  );
}
