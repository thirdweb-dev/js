import type { ThirdwebClient } from "thirdweb";
import type { Topic } from "@/api/webhook-configs";
import { WebhookConfigModal } from "./webhook-config-modal";

interface CreateWebhookConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  teamSlug: string;
  projectSlug: string;
  topics: Topic[];
  client?: ThirdwebClient;
  supportedChainIds?: Array<number>;
}

export function CreateWebhookConfigModal(props: CreateWebhookConfigModalProps) {
  return (
    <WebhookConfigModal
      client={props.client}
      mode="create"
      onOpenChange={props.onOpenChange}
      open={props.open}
      onSuccess={props.onSuccess}
      projectSlug={props.projectSlug}
      supportedChainIds={props.supportedChainIds}
      teamSlug={props.teamSlug}
      topics={props.topics}
    />
  );
}
