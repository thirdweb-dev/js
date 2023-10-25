import { useEngineWebhooks } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { Heading } from "tw-components";
import { WebhooksTable } from "./webhooks-table";
import { AddWebhookButton } from "./add-webhook-button";

interface EngineWebhooksProps {
  instance: string;
}

export const EngineWebhooks: React.FC<EngineWebhooksProps> = ({ instance }) => {
  const webhooks = useEngineWebhooks(instance);

  return (
    <Flex flexDir="column" gap={4}>
      <Heading size="title.md">Webhooks</Heading>
      <WebhooksTable
        instance={instance}
        webhooks={webhooks.data || []}
        isLoading={webhooks.isLoading}
        isFetched={webhooks.isFetched}
      />
      <AddWebhookButton instance={instance} />
    </Flex>
  );
};
