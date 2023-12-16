import { useEngineWebhooks } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { Heading, Link, Text } from "tw-components";
import { WebhooksTable } from "./webhooks-table";
import { AddWebhookButton } from "./add-webhook-button";

interface EngineWebhooksProps {
  instance: string;
}

export const EngineWebhooks: React.FC<EngineWebhooksProps> = ({ instance }) => {
  const webhooks = useEngineWebhooks(instance);

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Webhooks</Heading>
        <Text>
          Notify your app backend when transaction and backend wallet events
          occur.{" "}
          <Link
            href="https://portal.thirdweb.com/engine/webhooks"
            color="primary.500"
            isExternal
          >
            Learn more about webhooks
          </Link>
          .
        </Text>
      </Flex>
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
