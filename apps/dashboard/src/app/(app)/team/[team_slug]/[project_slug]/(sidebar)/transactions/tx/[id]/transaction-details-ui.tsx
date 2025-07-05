"use client";

import { format, formatDistanceToNowStrict } from "date-fns";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { hexToNumber, isHex, type ThirdwebClient, toEther } from "thirdweb";
import type { Project } from "@/api/projects";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeClient } from "@/components/ui/code/code.client";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { ChainIconClient } from "@/icons/ChainIcon";
import { statusDetails } from "../../analytics/tx-table/tx-table-ui";
import type { Transaction } from "../../analytics/tx-table/types";
import type { ActivityLogEntry } from "../../lib/analytics";

export function TransactionDetailsUI({
  transaction,
  client,
  activityLogs,
}: {
  transaction: Transaction;
  teamSlug: string;
  client: ThirdwebClient;
  project: Project;
  activityLogs: ActivityLogEntry[];
}) {
  const { idToChain } = useAllChainsData();

  // Extract relevant data from transaction
  const {
    id,
    chainId,
    from,
    transactionHash,
    confirmedAt,
    createdAt,
    executionParams,
    executionResult,
  } = transaction;

  const status = executionResult?.status as keyof typeof statusDetails;
  const errorMessage =
    executionResult && "error" in executionResult
      ? executionResult.error.message
      : executionResult && "revertData" in executionResult
      ? executionResult.revertData?.revertReason
      : null;
  const errorDetails =
    executionResult && "error" in executionResult
      ? executionResult.error
      : undefined;

  const chain = chainId ? idToChain.get(Number.parseInt(chainId)) : undefined;
  const explorer = chain?.explorers?.[0];

  // Calculate time difference between creation and confirmation
  const confirmationTime =
    confirmedAt && createdAt
      ? new Date(confirmedAt).getTime() - new Date(createdAt).getTime()
      : null;

  // Determine sender and signer addresses
  const senderAddress = executionParams?.smartAccountAddress || from || "";
  const signerAddress = executionParams?.signerAddress || from || "";

  // Gas information
  const gasUsed =
    executionResult && "actualGasUsed" in executionResult
      ? `${
          isHex(executionResult.actualGasUsed)
            ? hexToNumber(executionResult.actualGasUsed)
            : executionResult.actualGasUsed
        }`
      : "N/A";

  const gasCost =
    executionResult && "actualGasCost" in executionResult
      ? `${toEther(BigInt(executionResult.actualGasCost || "0"))} ${
          chain?.nativeCurrency.symbol || ""
        }`
      : "N/A";

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="font-semibold text-2xl tracking-tight">
          Transaction Details
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Transaction Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Status
              </div>
              <div className="md:w-2/3">
                {status && (
                  <ToolTipLabel
                    hoverable
                    label={
                      errorMessage ||
                      (status === "CONFIRMED" && confirmedAt
                        ? `Completed ${format(new Date(confirmedAt), "PP pp")}`
                        : undefined)
                    }
                  >
                    <Badge
                      className="gap-2"
                      variant={statusDetails[status].type}
                    >
                      {statusDetails[status].name}
                      {errorMessage && <InfoIcon className="size-3" />}
                    </Badge>
                  </ToolTipLabel>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Transaction ID
              </div>
              <div className="md:w-2/3">
                <CopyTextButton
                  className="font-mono text-muted-foreground text-sm"
                  copyIconPosition="left"
                  textToCopy={id}
                  textToShow={`${id.slice(0, 8)}...${id.slice(-6)}`}
                  tooltip="Copy transaction ID"
                  variant="ghost"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Transaction Hash
              </div>
              <div className="md:w-2/3">
                {transactionHash ? (
                  <div>
                    {explorer ? (
                      <Button
                        asChild
                        className="-translate-x-2 gap-2 font-mono"
                        size="sm"
                        variant="ghost"
                      >
                        <Link
                          href={`${explorer.url}/tx/${transactionHash}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {`${transactionHash.slice(
                            0,
                            8,
                          )}...${transactionHash.slice(-6)}`}{" "}
                          <ExternalLinkIcon className="size-4 text-muted-foreground" />
                        </Link>
                      </Button>
                    ) : (
                      <CopyTextButton
                        className="font-mono text-muted-foreground text-sm"
                        copyIconPosition="left"
                        textToCopy={transactionHash}
                        textToShow={`${transactionHash.slice(
                          0,
                          6,
                        )}...${transactionHash.slice(-4)}`}
                        tooltip="Copy transaction hash"
                        variant="ghost"
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-sm">Not available yet</div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Network
              </div>
              <div className="md:w-2/3">
                {chain ? (
                  <div className="flex items-center gap-2">
                    <ChainIconClient
                      className="size-4"
                      client={client}
                      src={chain.icon?.url}
                    />
                    <span className="text-sm">{chain.name || "Unknown"}</span>
                  </div>
                ) : (
                  <div>Chain ID: {chainId || "Unknown"}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sender Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Sender Address
              </div>
              <div className="md:w-2/3">
                <WalletAddress address={senderAddress} client={client} />
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Signer Address
              </div>
              <div className="md:w-2/3">
                <WalletAddress address={signerAddress} client={client} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            {transaction.transactionParams &&
            transaction.transactionParams.length > 0 ? (
              <CodeClient
                code={JSON.stringify(transaction.transactionParams, null, 2)}
                lang="json"
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                No transaction parameters available
              </p>
            )}
          </CardContent>
        </Card>
        {errorMessage && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive text-lg">
                Error Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {errorDetails ? (
                <CodeClient
                  code={JSON.stringify(errorDetails, null, 2)}
                  lang="json"
                />
              ) : (
                <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                  {errorMessage}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timing Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Created At
              </div>
              <div className="md:w-2/3">
                {createdAt ? (
                  <p className="text-sm">
                    {formatDistanceToNowStrict(new Date(createdAt), {
                      addSuffix: true,
                    })}{" "}
                    ({format(new Date(createdAt), "PP pp z")})
                  </p>
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Confirmed At
              </div>
              <div className="text-sm md:w-2/3">
                {confirmedAt ? (
                  <p>
                    {formatDistanceToNowStrict(new Date(confirmedAt), {
                      addSuffix: true,
                    })}{" "}
                    ({format(new Date(confirmedAt), "PP pp z")})
                  </p>
                ) : (
                  "Pending"
                )}
              </div>
            </div>

            {confirmationTime && (
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
                <div className="w-full text-muted-foreground text-sm md:w-1/3">
                  Confirmation Time
                </div>
                <div className="text-sm md:w-2/3">
                  {Math.floor(confirmationTime / 1000)} seconds
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gas Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Gas Used
              </div>
              <div className="text-sm md:w-2/3">{gasUsed}</div>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Gas Cost
              </div>
              <div className="text-sm md:w-2/3">{gasCost}</div>
            </div>

            {transaction.confirmedAtBlockNumber && (
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
                <div className="w-full text-muted-foreground text-sm md:w-1/3">
                  Block Number
                </div>
                <div className="text-sm md:w-2/3">
                  {isHex(transaction.confirmedAtBlockNumber)
                    ? hexToNumber(transaction.confirmedAtBlockNumber)
                    : transaction.confirmedAtBlockNumber}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Log Card */}
        <ActivityLogCard activityLogs={activityLogs} />
      </div>
    </>
  );
}

// Activity Log Timeline Component
function ActivityLogCard({
  activityLogs,
}: {
  activityLogs: ActivityLogEntry[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {activityLogs.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No activity logs available for this transaction
          </p>
        ) : (
          <div className="space-y-4">
            {activityLogs
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              )
              .map((log, index, sortedArray) => (
                <ActivityLogEntryItem
                  isLast={index === sortedArray.length - 1}
                  key={log.id}
                  log={log}
                />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityLogEntryItem({
  log,
  isLast,
}: {
  log: ActivityLogEntry;
  isLast: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get colors based on event type
  const getEventTypeColors = (eventType: string) => {
    const type = eventType.toLowerCase();
    if (type.includes("success"))
      return {
        dot: "bg-green-500",
        badge:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      };
    if (type.includes("nack"))
      return {
        dot: "bg-yellow-500",
        badge:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      };
    if (type.includes("failure"))
      return {
        dot: "bg-red-500",
        badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      };
    return {
      dot: "bg-primary",
      badge: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
  };

  const colors = getEventTypeColors(log.eventType);

  return (
    <div className="relative">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-8 h-full w-0.5 bg-border" />
      )}

      <div className="flex items-start gap-4">
        {/* Timeline dot */}
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <div className={`h-3 w-3 rounded-full ${colors.dot}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <button
            className="flex w-full items-center justify-between py-2 text-left hover:bg-muted/50 rounded-md px-2 -ml-2"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{log.stageName}</span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${colors.badge}`}
              >
                {log.eventType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNowStrict(new Date(log.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-3 px-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Executor</div>
                  <div className="font-mono">{log.executorName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Created At</div>
                  <div className="font-mono text-xs">
                    {format(new Date(log.createdAt), "PP pp z")}
                  </div>
                </div>
              </div>

              {log.payload && (
                <div>
                  <div className="text-muted-foreground text-sm mb-2">
                    Payload
                  </div>
                  <CodeClient
                    code={JSON.stringify(log.payload, null, 2)}
                    lang="json"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
