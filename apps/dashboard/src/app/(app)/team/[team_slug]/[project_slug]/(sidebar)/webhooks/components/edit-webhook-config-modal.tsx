import type { ThirdwebClient } from "thirdweb";
import type { Topic, WebhookConfig } from "@/api/project/webhook-configs";
import { WebhookConfigModal } from "./webhook-config-modal";

interface EditWebhookConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  teamSlug: string;
  projectSlug: string;
  topics: Topic[];
  webhookConfig: WebhookConfig;
  client?: ThirdwebClient;
  supportedChainIds?: Array<number>;
}

export function EditWebhookConfigModal(props: EditWebhookConfigModalProps) {
  return (
    <WebhookConfigModal
      client={props.client}
      mode="edit"
      onOpenChange={props.onOpenChange}
      open={props.open}
      onSuccess={props.onSuccess}
      projectSlug={props.projectSlug}
      supportedChainIds={props.supportedChainIds}
      teamSlug={props.teamSlug}
      topics={props.topics}
      webhookConfig={props.webhookConfig}
    />
  );
}
