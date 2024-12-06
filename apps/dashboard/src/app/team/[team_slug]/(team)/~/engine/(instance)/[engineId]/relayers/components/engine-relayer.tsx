"use client";

import { useEngineRelayer } from "@3rdweb-sdk/react/hooks/useEngine";
import { Heading, Link, Text } from "tw-components";
import { AddRelayerButton } from "./add-relayer-button";
import { RelayersTable } from "./relayers-table";

interface EngineRelayerProps {
  instanceUrl: string;
}

export const EngineRelayer: React.FC<EngineRelayerProps> = ({
  instanceUrl,
}) => {
  const relayers = useEngineRelayer(instanceUrl);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Heading size="title.md">Relayers</Heading>
        <Text>
          Use relayers to submit transactions from your backend wallets on
          behalf of your users.{" "}
          <Link
            href="https://portal.thirdweb.com/engine/features/relayers"
            color="primary.500"
            isExternal
          >
            Learn more about relayers
          </Link>
          .
        </Text>
      </div>

      <RelayersTable
        instanceUrl={instanceUrl}
        relayers={relayers.data || []}
        isPending={relayers.isPending}
        isFetched={relayers.isFetched}
      />
      <AddRelayerButton instanceUrl={instanceUrl} />
    </div>
  );
};
