"use client";

import { useId, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { Switch } from "@/components/ui/switch";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useEngineContractSubscription } from "@/hooks/useEngine";
import { AddContractSubscriptionButton } from "./add-contract-subscription-button";
import { ContractSubscriptionTable } from "./contract-subscriptions-table";

export function EngineContractSubscriptions({
  instanceUrl,
  authToken,
  client,
}: {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const contractSubscriptionsQuery = useEngineContractSubscription({
    authToken,
    instanceUrl,
  });
  const autoUpdateId = useId();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1 tracking-tight">
            Contract Subscriptions
          </h2>
          <p className="text-muted-foreground text-sm">
            Subscribe to event logs and transaction receipts on any contract.{" "}
            <UnderlineLink
              color="primary.500"
              href="https://portal.thirdweb.com/engine/features/contract-subscriptions"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more about contract subscriptions
            </UnderlineLink>
            .
          </p>
        </div>

        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center gap-3">
            <label htmlFor={autoUpdateId} className="text-sm">
              Auto-Update
            </label>
            <Switch
              id={autoUpdateId}
              checked={autoUpdate}
              onCheckedChange={() => setAutoUpdate((val) => !val)}
            />
          </div>
        </div>
      </div>

      <ContractSubscriptionTable
        authToken={authToken}
        autoUpdate={autoUpdate}
        client={client}
        contractSubscriptions={contractSubscriptionsQuery.data ?? []}
        instanceUrl={instanceUrl}
        isFetched={contractSubscriptionsQuery.isFetched}
        isPending={contractSubscriptionsQuery.isPending}
      />

      {/* add */}
      <div className="flex justify-end mt-4">
        <AddContractSubscriptionButton
          authToken={authToken}
          client={client}
          instanceUrl={instanceUrl}
        />
      </div>
    </div>
  );
}
