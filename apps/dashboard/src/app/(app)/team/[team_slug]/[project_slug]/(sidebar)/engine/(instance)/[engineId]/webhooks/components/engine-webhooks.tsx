"use client";

import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useEngineWebhooks } from "@/hooks/useEngine";
import { AddWebhookButton } from "./add-webhook-button";
import { WebhooksTable } from "./webhooks-table";

export function EngineWebhooks({
  instanceUrl,
  authToken,
}: {
  instanceUrl: string;
  authToken: string;
}) {
  const webhooks = useEngineWebhooks({
    authToken,
    instanceUrl,
  });

  return (
    <div>
      <h2 className="text-2xl tracking-tight font-semibold mb-1">Webhooks</h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Notify your app backend when transaction and backend wallet events
        occur.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/infrastructure/engine/features/webhooks"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more about webhooks
        </UnderlineLink>
        .
      </p>

      <WebhooksTable
        authToken={authToken}
        instanceUrl={instanceUrl}
        isFetched={webhooks.isFetched}
        isPending={webhooks.isPending}
        webhooks={webhooks.data || []}
      />

      <div className="mt-4 flex justify-end">
        <AddWebhookButton authToken={authToken} instanceUrl={instanceUrl} />
      </div>
    </div>
  );
}
