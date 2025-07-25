"use client";

import { Heading } from "chakra/heading";
import { Link } from "chakra/link";
import { Text } from "chakra/text";
import type { ThirdwebClient } from "thirdweb";
import { useEngineRelayer } from "@/hooks/useEngine";
import { AddRelayerButton } from "./add-relayer-button";
import { RelayersTable } from "./relayers-table";

interface EngineRelayerProps {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}

export const EngineRelayer: React.FC<EngineRelayerProps> = ({
  instanceUrl,
  authToken,
  client,
}) => {
  const relayers = useEngineRelayer({
    authToken,
    instanceUrl,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Heading size="title.md">Relayers</Heading>
        <Text>
          Use relayers to submit transactions from your backend wallets on
          behalf of your users.{" "}
          <Link
            color="primary.500"
            href="https://portal.thirdweb.com/engine/features/relayers"
            isExternal
          >
            Learn more about relayers
          </Link>
          .
        </Text>
      </div>

      <RelayersTable
        authToken={authToken}
        client={client}
        instanceUrl={instanceUrl}
        isFetched={relayers.isFetched}
        isPending={relayers.isPending}
        relayers={relayers.data || []}
      />
      <AddRelayerButton
        authToken={authToken}
        client={client}
        instanceUrl={instanceUrl}
      />
    </div>
  );
};
