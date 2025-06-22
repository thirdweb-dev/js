"use client";

import {
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, LinkButton } from "chakra/button";
import { Card } from "chakra/card";
import { FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import { format } from "date-fns";
import { InfoIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { eth_getBlockByNumber, getRpcClient } from "thirdweb";
import { shortenAddress as shortenAddressThrows } from "thirdweb/utils";
import { TWTable } from "@/components/blocks/TWTable";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import {
  type EngineContractSubscription,
  useEngineRemoveContractSubscription,
  useEngineSubscriptionsLastBlock,
} from "@/hooks/useEngine";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { ChainIconClient } from "@/icons/ChainIcon";

function shortenAddress(address: string) {
  if (!address) {
    return "";
  }

  try {
    return shortenAddressThrows(address);
  } catch {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}

interface ContractSubscriptionTableProps {
  instanceUrl: string;
  contractSubscriptions: EngineContractSubscription[];
  isPending: boolean;
  isFetched: boolean;
  autoUpdate: boolean;
  authToken: string;
  client: ThirdwebClient;
}

const columnHelper = createColumnHelper<EngineContractSubscription>();

export const ContractSubscriptionTable: React.FC<
  ContractSubscriptionTableProps
> = ({
  instanceUrl,
  contractSubscriptions,
  isPending,
  isFetched,
  autoUpdate,
  authToken,
  client,
}) => {
  const removeDisclosure = useDisclosure();
  const [selectedContractSub, setSelectedContractSub] =
    useState<EngineContractSubscription>();
  const { idToChain } = useAllChainsData();

  const columns = [
    columnHelper.accessor("chainId", {
      cell: (cell) => {
        const chain = idToChain.get(cell.getValue());
        return (
          <Flex align="center" gap={2}>
            <ChainIconClient
              className="size-3"
              client={client}
              src={chain?.icon?.url}
            />
            <Text>{chain?.name ?? "N/A"}</Text>
          </Flex>
        );
      },
      header: "Chain",
    }),
    columnHelper.accessor("contractAddress", {
      cell: (cell) => {
        const { chainId } = cell.row.original;
        const chain = idToChain.get(chainId);
        const explorer = chain?.explorers?.[0];
        if (!explorer) {
          return (
            <CopyAddressButton
              address={cell.getValue()}
              copyIconPosition="right"
            />
          );
        }
        return (
          <LinkButton
            fontFamily="mono"
            href={explorer ? `${explorer.url}/address/${cell.getValue()}` : "#"}
            isExternal
            size="xs"
            variant="ghost"
          >
            {shortenAddress(cell.getValue())}
          </LinkButton>
        );
      },
      header: "Contract Address",
    }),
    columnHelper.accessor("webhook", {
      cell: (cell) => {
        const webhook = cell.getValue();
        const url = webhook?.url ?? "";

        return (
          <Text maxW={200} noOfLines={3} whiteSpace="normal">
            {url}
          </Text>
        );
      },
      header: "Webhook URL",
    }),
    columnHelper.accessor("processEventLogs", {
      cell: (cell) => {
        const {
          processEventLogs,
          filterEvents,
          processTransactionReceipts,
          filterFunctions,
        } = cell.row.original;

        return (
          <Flex flexDirection="column">
            {/* Show logs + events */}
            {processEventLogs && (
              <Flex gap={1}>
                <Text>Logs:</Text>
                {filterEvents.length === 0 ? (
                  <Text>All</Text>
                ) : (
                  <Tooltip
                    bgColor="backgroundCardHighlight"
                    borderRadius="lg"
                    label={
                      <div className="flex flex-col gap-2 p-2 text-sm">
                        {filterEvents.map((name) => (
                          <Text key={name}>{name}</Text>
                        ))}
                      </div>
                    }
                    p={0}
                    shouldWrapChildren
                  >
                    <Text textDecoration="underline dotted">
                      {filterEvents.length} events
                    </Text>
                  </Tooltip>
                )}
              </Flex>
            )}

            {/* Show receipts + functions */}
            {processTransactionReceipts && (
              <Flex gap={1}>
                <Text>Receipts:</Text>
                {filterFunctions.length === 0 ? (
                  <Text>All</Text>
                ) : (
                  <Tooltip
                    bgColor="backgroundCardHighlight"
                    borderRadius="lg"
                    label={
                      <div className="flex flex-col gap-2 p-2 text-sm">
                        {filterFunctions.map((name) => (
                          <Text key={name}>{name}</Text>
                        ))}
                      </div>
                    }
                    p={0}
                    shouldWrapChildren
                  >
                    <Text textDecoration="underline dotted">
                      {filterFunctions.length} functions
                    </Text>
                  </Tooltip>
                )}
              </Flex>
            )}
          </Flex>
        );
      },
      header: "Filters",
    }),
    columnHelper.accessor("lastIndexedBlock", {
      cell: (cell) => {
        const { chainId } = cell.row.original;
        return (
          <ChainLastBlock
            authToken={authToken}
            autoUpdate={autoUpdate}
            chainId={chainId}
            client={client}
            instanceUrl={instanceUrl}
          />
        );
      },
      header: "Latest Block",
    }),
  ];

  return (
    <>
      <TWTable
        columns={columns}
        data={contractSubscriptions}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (contractSub) => {
              setSelectedContractSub(contractSub);
              removeDisclosure.onOpen();
            },
            text: "Remove",
          },
        ]}
        title="contract subscriptions"
      />

      {selectedContractSub && removeDisclosure.isOpen && (
        <RemoveModal
          authToken={authToken}
          client={client}
          contractSubscription={selectedContractSub}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
};

const ChainLastBlockTimestamp = ({
  chainId,
  blockNumber,
  client,
}: {
  chainId: number;
  blockNumber: bigint;
  client: ThirdwebClient;
}) => {
  const chain = useV5DashboardChain(chainId);
  // Get the block timestamp to display how delayed the last processed block is.
  const ethBlockQuery = useQuery({
    // keep the previous data while fetching new data
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const rpcRequest = getRpcClient({
        chain,
        client,
      });
      const block = await eth_getBlockByNumber(rpcRequest, {
        blockNumber,
        includeTransactions: false,
      });
      return new Date(Number(block.timestamp) * 1000);
    },
    queryKey: ["block_timestamp", chainId, Number(blockNumber)],
  });

  if (!ethBlockQuery.data) {
    return null;
  }

  return (
    <Card bgColor="backgroundHighlight">
      <Text>{format(ethBlockQuery.data, "PP pp z")}</Text>
    </Card>
  );
};

const ChainLastBlock = ({
  instanceUrl,
  chainId,
  autoUpdate,
  authToken,
  client,
}: {
  instanceUrl: string;
  chainId: number;
  autoUpdate: boolean;
  authToken: string;
  client: ThirdwebClient;
}) => {
  const lastBlockQuery = useEngineSubscriptionsLastBlock({
    authToken,
    autoUpdate,
    chainId,
    instanceUrl,
  });
  if (!lastBlockQuery.data) {
    return null;
  }

  return (
    <Flex align="center" gap={2}>
      <Text>{lastBlockQuery.data}</Text>
      <Tooltip
        bg="transparent"
        borderRadius="md"
        boxShadow="none"
        label={
          <ChainLastBlockTimestamp
            blockNumber={BigInt(lastBlockQuery.data)}
            chainId={chainId}
            client={client}
          />
        }
        placement="auto"
        shouldWrapChildren
      >
        <InfoIcon className="size-4" />
      </Tooltip>
    </Flex>
  );
};

const RemoveModal = ({
  contractSubscription,
  disclosure,
  instanceUrl,
  authToken,
  client,
}: {
  contractSubscription: EngineContractSubscription;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) => {
  const { mutate: removeContractSubscription } =
    useEngineRemoveContractSubscription({
      authToken,
      instanceUrl,
    });

  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed contract subscription.",
    "Failed to remove contract subscription.",
  );
  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(contractSubscription.chainId);

  const onClick = () => {
    removeContractSubscription(
      {
        contractSubscriptionId: contractSubscription.id,
      },
      {
        onError: (error) => {
          onError(error);
          console.error(error);
        },
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
        },
      },
    );
  };

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Remove Contract Subscription</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Text>
              This action will delete all stored data for this contract
              subscription.
            </Text>

            <Card as={Flex} flexDir="column" gap={4}>
              <FormControl>
                <FormLabel>Chain</FormLabel>
                <Flex align="center" gap={2}>
                  <ChainIconClient
                    className="size-3"
                    client={client}
                    src={chain?.icon?.url}
                  />
                  <Text>{chain?.name ?? "N/A"}</Text>
                </Flex>
              </FormControl>

              <FormControl>
                <FormLabel>Contract Address</FormLabel>
                <Text fontFamily="mono">
                  {contractSubscription.contractAddress}
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Webhook</FormLabel>
                {contractSubscription.webhook ? (
                  <Text>{contractSubscription.webhook.url}</Text>
                ) : (
                  <Text fontStyle="italic">N/A</Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Filters</FormLabel>
                {contractSubscription.processEventLogs && (
                  <Text>
                    Logs:{" "}
                    {contractSubscription.filterEvents.length === 0
                      ? "All"
                      : contractSubscription.filterEvents.join(", ")}
                  </Text>
                )}
                {contractSubscription.processTransactionReceipts && (
                  <Text>
                    Receipts:{" "}
                    {contractSubscription.filterFunctions.length === 0
                      ? "All"
                      : contractSubscription.filterFunctions.join(", ")}
                  </Text>
                )}
              </FormControl>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter as={Flex} gap={3}>
          <Button onClick={disclosure.onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onClick} type="submit">
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
