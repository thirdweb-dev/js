import type { Topic, WebhookConfig } from "@/api/webhook-configs";
import { WebhookConfigModal } from "./webhook-config-modal";

interface EditWebhookConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamSlug: string;
  projectSlug: string;
  topics: Topic[];
  webhookConfig: WebhookConfig;
}

export function EditWebhookConfigModal(props: EditWebhookConfigModalProps) {
  return (
    <WebhookConfigModal
      mode="edit"
      onOpenChange={props.onOpenChange}
      open={props.open}
      projectSlug={props.projectSlug}
      teamSlug={props.teamSlug}
      topics={props.topics}
      webhookConfig={props.webhookConfig}
    />
  );
}
