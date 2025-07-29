"use client";

import type { ThirdwebClient } from "thirdweb";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useEngineRelayer } from "@/hooks/useEngine";
import { AddRelayerButton } from "./add-relayer-button";
import { RelayersTable } from "./relayers-table";

export function EngineRelayer({
  instanceUrl,
  authToken,
  client,
}: {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const relayers = useEngineRelayer({
    authToken,
    instanceUrl,
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-1">Relayers</h2>
      <p className="text-muted-foreground text-sm">
        Use relayers to submit transactions from your backend wallets on behalf
        of your users.{" "}
        <UnderlineLink
          href="https://portal.thirdweb.com/engine/features/relayers"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about relayers
        </UnderlineLink>
        .
      </p>

      <div className="h-4" />

      <RelayersTable
        authToken={authToken}
        client={client}
        instanceUrl={instanceUrl}
        isFetched={relayers.isFetched}
        isPending={relayers.isPending}
        relayers={relayers.data || []}
      />

      <div className="h-4" />

      <div className="flex justify-end">
        <AddRelayerButton
          authToken={authToken}
          client={client}
          instanceUrl={instanceUrl}
        />
      </div>
    </div>
  );
}
