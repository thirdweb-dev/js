"use client";

import { useEngineWebhooks } from "@3rdweb-sdk/react/hooks/useEngine";
import { Heading, Link, Text } from "tw-components";
import { AddWebhookButton } from "./add-webhook-button";
import { WebhooksTable } from "./webhooks-table";

interface EngineWebhooksProps {
  instanceUrl: string;
}

export const EngineWebhooks: React.FC<EngineWebhooksProps> = ({
  instanceUrl,
}) => {
  const webhooks = useEngineWebhooks(instanceUrl);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Heading size="title.md">Webhooks</Heading>
        <Text>
          Notify your app backend when transaction and backend wallet events
          occur.{" "}
          <Link
            href="https://portal.thirdweb.com/infrastructure/engine/features/webhooks"
            color="primary.500"
            isExternal
          >
            Learn more about webhooks
          </Link>
          .
        </Text>
      </div>
      <WebhooksTable
        instanceUrl={instanceUrl}
        webhooks={webhooks.data || []}
        isLoading={webhooks.isLoading}
        isFetched={webhooks.isFetched}
      />
      <AddWebhookButton instanceUrl={instanceUrl} />
    </div>
  );
};
