"use client";

import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import {
  type EngineContractSubscription,
  useEngineRemoveContractSubscription,
  useEngineSubscriptionsLastBlock,
} from "@3rdweb-sdk/react/hooks/useEngine";
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
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useV5DashboardChain } from "lib/v5-adapter";
import { InfoIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { eth_getBlockByNumber, getRpcClient } from "thirdweb";
import { shortenAddress as shortenAddressThrows } from "thirdweb/utils";
import { Button, Card, FormLabel, LinkButton, Text } from "tw-components";

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
}) => {
  const removeDisclosure = useDisclosure();
  const [selectedContractSub, setSelectedContractSub] =
    useState<EngineContractSubscription>();
  const { idToChain } = useAllChainsData();

  const columns = [
    columnHelper.accessor("chainId", {
      header: "Chain",
      cell: (cell) => {
        const chain = idToChain.get(cell.getValue());
        return (
          <Flex align="center" gap={2}>
            <ChainIcon className="size-3" ipfsSrc={chain?.icon?.url} />
            <Text>{chain?.name ?? "N/A"}</Text>
          </Flex>
        );
      },
    }),
    columnHelper.accessor("contractAddress", {
      header: "Contract Address",
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
            variant="ghost"
            isExternal
            size="xs"
            href={explorer ? `${explorer.url}/address/${cell.getValue()}` : "#"}
            fontFamily="mono"
          >
            {shortenAddress(cell.getValue())}
          </LinkButton>
        );
      },
    }),
    columnHelper.accessor("webhook", {
      header: "Webhook URL",
      cell: (cell) => {
        const webhook = cell.getValue();
        const url = webhook?.url ?? "";

        return (
          <Text maxW={200} whiteSpace="normal" noOfLines={3}>
            {url}
          </Text>
        );
      },
    }),
    columnHelper.accessor("processEventLogs", {
      header: "Filters",
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
                    p={0}
                    label={
                      <div className="flex flex-col gap-2 p-2 text-sm">
                        {filterEvents.map((name) => (
                          <Text key={name}>{name}</Text>
                        ))}
                      </div>
                    }
                    bgColor="backgroundCardHighlight"
                    borderRadius="lg"
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
                    p={0}
                    label={
                      <div className="flex flex-col gap-2 p-2 text-sm">
                        {filterFunctions.map((name) => (
                          <Text key={name}>{name}</Text>
                        ))}
                      </div>
                    }
                    bgColor="backgroundCardHighlight"
                    borderRadius="lg"
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
    }),
    columnHelper.accessor("lastIndexedBlock", {
      header: "Latest Block",
      cell: (cell) => {
        const { chainId } = cell.row.original;
        return (
          <ChainLastBlock
            instanceUrl={instanceUrl}
            chainId={chainId}
            autoUpdate={autoUpdate}
            authToken={authToken}
          />
        );
      },
    }),
  ];

  return (
    <>
      <TWTable
        title="contract subscriptions"
        data={contractSubscriptions}
        columns={columns}
        isPending={isPending}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: <Trash2Icon className="size-4" />,
            text: "Remove",
            onClick: (contractSub) => {
              setSelectedContractSub(contractSub);
              removeDisclosure.onOpen();
            },
            isDestructive: true,
          },
        ]}
      />

      {selectedContractSub && removeDisclosure.isOpen && (
        <RemoveModal
          contractSubscription={selectedContractSub}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
    </>
  );
};

const ChainLastBlockTimestamp = ({
  chainId,
  blockNumber,
}: {
  chainId: number;
  blockNumber: bigint;
}) => {
  const client = useThirdwebClient();
  const chain = useV5DashboardChain(chainId);
  // Get the block timestamp to display how delayed the last processed block is.
  const ethBlockQuery = useQuery({
    queryKey: ["block_timestamp", chainId, Number(blockNumber)],
    // keep the previous data while fetching new data
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const rpcRequest = getRpcClient({
        client,
        chain,
      });
      const block = await eth_getBlockByNumber(rpcRequest, {
        blockNumber,
        includeTransactions: false,
      });
      return new Date(Number(block.timestamp) * 1000);
    },
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
}: {
  instanceUrl: string;
  chainId: number;
  autoUpdate: boolean;
  authToken: string;
}) => {
  const lastBlockQuery = useEngineSubscriptionsLastBlock({
    instanceUrl,
    chainId,
    autoUpdate,
    authToken,
  });
  if (!lastBlockQuery.data) {
    return null;
  }

  return (
    <Flex gap={2} align="center">
      <Text>{lastBlockQuery.data}</Text>
      <Tooltip
        borderRadius="md"
        bg="transparent"
        boxShadow="none"
        label={
          <ChainLastBlockTimestamp
            chainId={chainId}
            blockNumber={BigInt(lastBlockQuery.data)}
          />
        }
        shouldWrapChildren
        placement="auto"
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
}: {
  contractSubscription: EngineContractSubscription;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: removeContractSubscription } =
    useEngineRemoveContractSubscription({
      instanceUrl,
      authToken,
    });
  const trackEvent = useTrack();
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
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "remove-contract-subscription",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "remove-contract-subscription",
            label: "error",
            instance: instanceUrl,
            error,
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
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
                  <ChainIcon className="size-3" ipfsSrc={chain?.icon?.url} />
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
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Cancel
          </Button>
          <Button type="submit" colorScheme="red" onClick={onClick}>
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
