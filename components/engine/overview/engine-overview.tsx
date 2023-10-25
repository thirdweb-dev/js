import {
  useEngineBackendWallets,
  useEngineTransactions,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { BackendWalletsTable } from "./backend-wallets-table";
import { TransactionsTable } from "./transactions-table";
import { Heading, Text } from "tw-components";
import { CreateBackendWalletButton } from "./create-backend-wallet-button";
import { ImportBackendWalletButton } from "./import-backend-wallet-button";
import { NetworkDropdown } from "components/contract-components/contract-publish-form/NetworkDropdown";
import { useChainId } from "@thirdweb-dev/react";
import { useState } from "react";

interface EngineOverviewProps {
  instance: string;
}

export const EngineOverview: React.FC<EngineOverviewProps> = ({ instance }) => {
  const backendWallets = useEngineBackendWallets(instance);
  const transactionsQuery = useEngineTransactions(instance);
  const chainId = useChainId();
  const [selectedChainId, setSelectedChainId] = useState(chainId || 1);

  const filteredTransactions = (
    transactionsQuery.data?.transactions || []
  )?.filter((tx) => tx.chainId === selectedChainId.toString());

  return (
    <Flex flexDir="column" gap={12}>
      <Flex gap={4} alignItems="center">
        <Text w="25%">Seeing analytics for:</Text>
        <Flex w="full">
          <NetworkDropdown
            value={selectedChainId}
            onSingleChange={(val) => setSelectedChainId(val)}
          />
        </Flex>
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Flex justify="space-between" alignItems="center">
          <Heading size="title.sm">Backend Wallets</Heading>
          <Flex gap={2}>
            <ImportBackendWalletButton instance={instance} />
            <CreateBackendWalletButton instance={instance} />
          </Flex>
        </Flex>
        <BackendWalletsTable
          chainId={selectedChainId}
          instance={instance}
          wallets={backendWallets.data ?? []}
          isLoading={backendWallets.isLoading}
          isFetched={backendWallets.isFetched}
        />
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Heading size="title.sm">Transactions (last 24hs)</Heading>
        <TransactionsTable
          transactions={filteredTransactions ?? []}
          isLoading={transactionsQuery.isLoading}
          isFetched={transactionsQuery.isFetched}
        />
      </Flex>
    </Flex>
  );
};
