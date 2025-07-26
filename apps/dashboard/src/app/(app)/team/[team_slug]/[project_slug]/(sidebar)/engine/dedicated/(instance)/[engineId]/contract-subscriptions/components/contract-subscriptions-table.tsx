"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { InfoIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { eth_getBlockByNumber, getRpcClient } from "thirdweb";
import { shortenAddress as shortenAddressThrows } from "thirdweb/utils";
import { TWTable } from "@/components/blocks/TWTable";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import {
  type EngineContractSubscription,
  useEngineRemoveContractSubscription,
  useEngineSubscriptionsLastBlock,
} from "@/hooks/useEngine";
import { ChainIconClient } from "@/icons/ChainIcon";
import { parseError } from "@/utils/errorParser";

const columnHelper = createColumnHelper<EngineContractSubscription>();

export function ContractSubscriptionTable({
  instanceUrl,
  contractSubscriptions,
  isPending,
  isFetched,
  autoUpdate,
  authToken,
  client,
}: {
  instanceUrl: string;
  contractSubscriptions: EngineContractSubscription[];
  isPending: boolean;
  isFetched: boolean;
  autoUpdate: boolean;
  authToken: string;
  client: ThirdwebClient;
}) {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedContractSub, setSelectedContractSub] =
    useState<EngineContractSubscription>();
  const { idToChain } = useAllChainsData();

  const columns = [
    columnHelper.accessor("chainId", {
      cell: (cell) => {
        const chain = idToChain.get(cell.getValue());
        return (
          <div className="flex items-center gap-2">
            <ChainIconClient
              className="size-3"
              client={client}
              src={chain?.icon?.url}
            />
            <span>{chain?.name ?? "N/A"}</span>
          </div>
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
          <Button className="font-mono" variant="ghost" size="sm" asChild>
            <a
              href={
                explorer ? `${explorer.url}/address/${cell.getValue()}` : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortenAddress(cell.getValue())}
            </a>
          </Button>
        );
      },
      header: "Contract Address",
    }),
    columnHelper.accessor("webhook", {
      cell: (cell) => {
        const webhook = cell.getValue();
        const url = webhook?.url ?? "";

        return <span className="max-w-[200px] truncate block">{url}</span>;
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
          <div className="flex flex-col">
            {/* Show logs + events */}
            {processEventLogs && (
              <div className="flex gap-1">
                <span>Logs:</span>
                {filterEvents.length === 0 ? (
                  <span>All</span>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="underline decoration-dotted cursor-help">
                          {filterEvents.length} events
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="p-2">
                        <div className="flex flex-col gap-2 text-sm">
                          {filterEvents.map((name) => (
                            <span key={name}>{name}</span>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}

            {/* Show receipts + functions */}
            {processTransactionReceipts && (
              <div className="flex gap-1">
                <span>Receipts:</span>
                {filterFunctions.length === 0 ? (
                  <span>All</span>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="underline decoration-dotted cursor-help">
                          {filterFunctions.length} functions
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="p-2">
                        <div className="flex flex-col gap-2 text-sm">
                          {filterFunctions.map((name) => (
                            <span key={name}>{name}</span>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
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
              setIsRemoveModalOpen(true);
            },
            text: "Remove",
          },
        ]}
        title="contract subscriptions"
      />

      {selectedContractSub && (
        <RemoveModal
          authToken={authToken}
          client={client}
          contractSubscription={selectedContractSub}
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
}

function ChainLastBlockTimestamp({
  chainId,
  blockNumber,
  client,
}: {
  chainId: number;
  blockNumber: bigint;
  client: ThirdwebClient;
}) {
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
    <Card className="bg-muted">
      <CardContent className="p-2">
        <span>{format(ethBlockQuery.data, "PP pp z")}</span>
      </CardContent>
    </Card>
  );
}

function ChainLastBlock({
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
}) {
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
    <div className="flex items-center gap-2">
      <span>{lastBlockQuery.data}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="size-4 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <ChainLastBlockTimestamp
              blockNumber={BigInt(lastBlockQuery.data)}
              chainId={chainId}
              client={client}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function RemoveModal({
  contractSubscription,
  isOpen,
  onClose,
  instanceUrl,
  authToken,
  client,
}: {
  contractSubscription: EngineContractSubscription;
  isOpen: boolean;
  onClose: () => void;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const removeContractSubscription = useEngineRemoveContractSubscription({
    authToken,
    instanceUrl,
  });

  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(contractSubscription.chainId);

  const onClick = () => {
    removeContractSubscription.mutate(
      {
        contractSubscriptionId: contractSubscription.id,
      },
      {
        onError: (error) => {
          toast.error("Failed to remove contract subscription.", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Successfully removed contract subscription.");
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Remove Contract Subscription</DialogTitle>
          <DialogDescription>
            This action will delete all stored data for this contract
            subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 lg:px-6 pb-6 space-y-5">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Chain</h3>
            <div className="flex items-center gap-2">
              <ChainIconClient
                className="size-3"
                client={client}
                src={chain?.icon?.url}
              />
              <span className="text-sm text-foreground">
                {chain?.name ?? "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Contract Address</h3>
            <span className="font-mono text-sm">
              {contractSubscription.contractAddress}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Webhook</h3>
            {contractSubscription.webhook ? (
              <span className="text-sm">
                {contractSubscription.webhook.url}
              </span>
            ) : (
              <span className="italic text-sm">N/A</span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Filters</h3>
            {contractSubscription.processEventLogs && (
              <span className="text-sm">
                Logs:{" "}
                {contractSubscription.filterEvents.length === 0
                  ? "All"
                  : contractSubscription.filterEvents.join(", ")}
              </span>
            )}
            {contractSubscription.processTransactionReceipts && (
              <span className="text-sm">
                Receipts:{" "}
                {contractSubscription.filterFunctions.length === 0
                  ? "All"
                  : contractSubscription.filterFunctions.join(", ")}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end border-t p-4 lg:p-6 bg-card">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onClick} variant="destructive" className="gap-2">
            Remove
            {removeContractSubscription.isPending && (
              <Spinner className="size-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
