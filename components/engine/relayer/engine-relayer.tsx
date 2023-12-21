import { useEngineRelayer } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { Heading, Link, Text } from "tw-components";
import { RelayersTable } from "./relayers-table";
import { AddRelayerButton } from "./add-relayer-button";

interface EngineRelayerProps {
  instanceUrl: string;
}

export const EngineRelayer: React.FC<EngineRelayerProps> = ({
  instanceUrl,
}) => {
  const relayers = useEngineRelayer(instanceUrl);

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Relayers</Heading>
        <Text>
          Use relayers to submit transactions from your backend wallets on
          behalf of your users.
          <Link
            href="https://portal.thirdweb.com/guides/engine/relayer"
            color="primary.500"
            isExternal
          >
            {" "}
            Learn more about relayers
          </Link>
          .
        </Text>

        <Text>This feature is enabled on v0.0.8 and above.</Text>
      </Flex>

      <RelayersTable
        instanceUrl={instanceUrl}
        relayers={relayers.data || []}
        isLoading={relayers.isLoading}
        isFetched={relayers.isFetched}
      />
      <AddRelayerButton instanceUrl={instanceUrl} />
    </Flex>
  );
};
