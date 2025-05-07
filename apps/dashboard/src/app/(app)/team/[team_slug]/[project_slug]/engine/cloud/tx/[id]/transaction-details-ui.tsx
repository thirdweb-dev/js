"use client";

import type { Project } from "@/api/projects";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeClient } from "@/components/ui/code/code.client";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useAllChainsData } from "hooks/chains/allChains";
import { ExternalLinkIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { toEther } from "thirdweb";
import { ChainIconClient } from "../../../../../../../../../components/icons/ChainIcon";
import { statusDetails } from "../../analytics/tx-table/tx-table-ui";
import type { Transaction } from "../../analytics/tx-table/types";

export function TransactionDetailsUI({
  transaction,
}: {
  transaction: Transaction;
  teamSlug: string;
  project: Project;
}) {
  const thirdwebClient = useThirdwebClient();
  const { idToChain } = useAllChainsData();

  // Extract relevant data from transaction
  const {
    id,
    chainId,
    from,
    transactionHash,
    confirmedAt,
    createdAt,
    errorMessage,
    executionParams,
    executionResult,
  } = transaction;

  const status = executionResult?.status as keyof typeof statusDetails;

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
      ? `${executionResult.actualGasUsed}`
      : "N/A";

  const gasCost =
    executionResult && "actualGasCost" in executionResult
      ? `${toEther(BigInt(executionResult.actualGasCost || "0"))} ${chain?.nativeCurrency.symbol || ""}`
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
                      variant={statusDetails[status].type}
                      className="gap-2"
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
                  textToCopy={id}
                  copyIconPosition="left"
                  textToShow={`${id.slice(0, 8)}...${id.slice(-6)}`}
                  variant="ghost"
                  tooltip="Copy transaction ID"
                  className="font-mono text-muted-foreground text-sm"
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
                        variant="ghost"
                        asChild
                        className="-translate-x-2 gap-2 font-mono"
                        size="sm"
                      >
                        <Link
                          href={`${explorer.url}/tx/${transactionHash}`}
                          target="_blank"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {`${transactionHash.slice(0, 8)}...${transactionHash.slice(-6)}`}{" "}
                          <ExternalLinkIcon className="size-4 text-muted-foreground" />
                        </Link>
                      </Button>
                    ) : (
                      <CopyTextButton
                        textToCopy={transactionHash}
                        copyIconPosition="left"
                        textToShow={`${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`}
                        variant="ghost"
                        tooltip="Copy transaction hash"
                        className="font-mono text-muted-foreground text-sm"
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
                      client={thirdwebClient}
                      src={chain.icon?.url}
                    />
                    <span className="text-sm">{chain.name}</span>
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
                <WalletAddress address={senderAddress} />
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0">
              <div className="w-full text-muted-foreground text-sm md:w-1/3">
                Signer Address
              </div>
              <div className="md:w-2/3">
                <WalletAddress address={signerAddress} />
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
              <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                {errorMessage}
              </div>
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
                  {transaction.confirmedAtBlockNumber}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
