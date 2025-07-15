import type { Topic } from "@/api/webhook-configs";
import { WebhookConfigModal } from "./webhook-config-modal";

interface CreateWebhookConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamSlug: string;
  projectSlug: string;
  topics: Topic[];
}

export function CreateWebhookConfigModal(props: CreateWebhookConfigModalProps) {
  return (
    <WebhookConfigModal
      mode="create"
      onOpenChange={props.onOpenChange}
      open={props.open}
      projectSlug={props.projectSlug}
      teamSlug={props.teamSlug}
      topics={props.topics}
    />
  );
}
