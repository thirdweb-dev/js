"use client";

import { format, formatDistanceToNowStrict } from "date-fns";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { stringify } from "thirdweb/utils";
import type { Project } from "@/api/project/projects";
import { Badge } from "@/components/ui/badge";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeClient } from "@/components/ui/code/code.client";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import type { SolanaTransaction } from "../../analytics/solana-tx-table/types";
import type { ActivityLogEntry } from "../../lib/analytics";
import { getSolanaNetworkName, getSolscanUrl } from "../../lib/solana-utils";

const solanaStatusDetails = {
  CONFIRMED: { name: "Confirmed", variant: "success" as const },
  FAILED: { name: "Failed", variant: "destructive" as const },
  QUEUED: { name: "Queued", variant: "warning" as const },
  SUBMITTED: { name: "Submitted", variant: "warning" as const },
};

export function SolanaTransactionDetailsUI({
  transaction,
  activityLogs,
}: {
  transaction: SolanaTransaction;
  teamSlug: string;
  client: ThirdwebClient;
  project: Project;
  activityLogs: ActivityLogEntry[];
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "logs" | "raw">(
    "overview",
  );

  // Extract relevant data from transaction
  const {
    id,
    chainId,
    signerAddress,
    signature,
    confirmedAt,
    createdAt,
    executionResult,
    errorMessage,
  } = transaction;

  const status = (executionResult?.status ||
    transaction.status ||
    "QUEUED") as keyof typeof solanaStatusDetails;

  // Parse network from chainId
  const network = getSolanaNetworkName(chainId);
  const networkDisplay = network.charAt(0).toUpperCase() + network.slice(1);

  // Calculate time difference between creation and confirmation
  const confirmationTime =
    confirmedAt && createdAt
      ? new Date(confirmedAt).getTime() -
        (createdAt instanceof Date ? createdAt : new Date(createdAt)).getTime()
      : null;

  // Get signature from executionResult if available
  const txSignature =
    (executionResult && "signature" in executionResult
      ? executionResult.signature
      : signature) || null;

  // Get slot and blockTime
  const slot =
    executionResult && "slot" in executionResult
      ? executionResult.slot
      : transaction.confirmedAtSlot;
  const blockTime =
    executionResult && "blockTime" in executionResult
      ? executionResult.blockTime
      : transaction.blockTime;

  return (
    <>
      {/* Transaction ID Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl tracking-tight">
            Transaction Details
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Queue ID:</span>
            <CopyTextButton
              className="font-mono"
              copyIconPosition="left"
              textToCopy={id}
              textToShow={id}
              tooltip="Copy Queue ID"
              variant="ghost"
            />
          </div>
        </div>
        <Badge
          className="gap-2 text-base"
          variant={solanaStatusDetails[status].variant}
        >
          {solanaStatusDetails[status].name}
        </Badge>
      </div>

      {/* Tabs */}
      <TabButtons
        tabs={[
          {
            name: "Overview",
            onClick: () => setActiveTab("overview"),
            isActive: activeTab === "overview",
          },
          {
            name: "Activity Logs",
            onClick: () => setActiveTab("logs"),
            isActive: activeTab === "logs",
          },
          {
            name: "Raw Data",
            onClick: () => setActiveTab("raw"),
            isActive: activeTab === "raw",
          },
        ]}
      />

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Transaction Information */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Network" value={`Solana ${networkDisplay}`} />
              <InfoRow
                label="Status"
                value={solanaStatusDetails[status].name}
              />
              <InfoRow label="Signer Address">
                <code className="text-xs font-mono break-all">
                  {signerAddress}
                </code>
              </InfoRow>
              {txSignature && (
                <InfoRow label="Signature">
                  <Link
                    href={getSolscanUrl(txSignature, chainId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-link-foreground hover:underline text-sm"
                  >
                    <code className="font-mono">
                      {txSignature.slice(0, 12)}...{txSignature.slice(-12)}
                    </code>
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                </InfoRow>
              )}
              {slot && <InfoRow label="Slot" value={slot.toString()} />}
              {errorMessage && (
                <InfoRow label="Error">
                  <span className="text-destructive text-sm">
                    {errorMessage}
                  </span>
                </InfoRow>
              )}
            </CardContent>
          </Card>

          {/* Timing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Timing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Queued At">
                <ToolTipLabel
                  label={format(
                    createdAt instanceof Date ? createdAt : new Date(createdAt),
                    "PP pp z",
                  )}
                >
                  <span className="text-sm">
                    {formatDistanceToNowStrict(
                      createdAt instanceof Date
                        ? createdAt
                        : new Date(createdAt),
                      { addSuffix: true },
                    )}
                  </span>
                </ToolTipLabel>
              </InfoRow>
              {confirmedAt && (
                <>
                  <InfoRow label="Confirmed At">
                    <ToolTipLabel
                      label={format(new Date(confirmedAt), "PP pp z")}
                    >
                      <span className="text-sm">
                        {formatDistanceToNowStrict(new Date(confirmedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </ToolTipLabel>
                  </InfoRow>
                  {confirmationTime && (
                    <InfoRow
                      label="Confirmation Time"
                      value={`${(confirmationTime / 1000).toFixed(2)}s`}
                    />
                  )}
                </>
              )}
              {blockTime && (
                <InfoRow
                  label="Block Time"
                  value={format(new Date(blockTime * 1000), "PP pp z")}
                />
              )}
            </CardContent>
          </Card>

          {/* Transaction Instructions */}
          {transaction.transactionParams &&
            transaction.transactionParams.instructions.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transaction.transactionParams.instructions.map(
                      (instruction, index) => (
                        <InstructionCard
                          key={`instruction-${instruction.programId}-${index}`}
                          index={index}
                          instruction={instruction}
                        />
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Execution Details */}
          {executionResult && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Execution Details</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeClient
                  code={stringify(executionResult, null, 2)}
                  lang="json"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === "logs" && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLogs.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No activity logs available
              </p>
            ) : (
              <div className="space-y-2">
                {activityLogs.map((log) => (
                  <ActivityLogItem key={log.id} log={log} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Raw Data Tab */}
      {activeTab === "raw" && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Transaction Data</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeClient code={stringify(transaction, null, 2)} lang="json" />
          </CardContent>
        </Card>
      )}
    </>
  );
}

function InfoRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-muted-foreground text-sm font-medium">{label}</dt>
      <dd className="text-sm">
        {children || <span className="break-all">{value || "N/A"}</span>}
      </dd>
    </div>
  );
}

function InstructionCard({
  instruction,
  index,
}: {
  instruction: {
    programId: string;
    keys: Array<{
      pubkey: string;
      isSigner: boolean;
      isWritable: boolean;
    }>;
    data: string;
  };
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <button
        type="button"
        className="flex w-full items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium text-sm">Instruction {index + 1}</span>
        {isExpanded ? (
          <ChevronDownIcon className="size-4" />
        ) : (
          <ChevronRightIcon className="size-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">
              Program ID
            </p>
            <code className="text-xs font-mono break-all">
              {instruction.programId}
            </code>
          </div>

          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">
              Accounts ({instruction.keys.length})
            </p>
            <div className="space-y-2">
              {instruction.keys.map((key, idx) => (
                <div
                  key={`${key.pubkey}-${idx}`}
                  className="rounded border border-border bg-background p-2"
                >
                  <code className="text-xs font-mono break-all">
                    {key.pubkey}
                  </code>
                  <div className="mt-1 flex gap-2">
                    {key.isSigner && (
                      <Badge variant="outline" className="text-xs">
                        Signer
                      </Badge>
                    )}
                    {key.isWritable && (
                      <Badge variant="outline" className="text-xs">
                        Writable
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">
              Data
            </p>
            <code className="text-xs font-mono break-all block bg-background p-2 rounded border border-border">
              {instruction.data || "No data"}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityLogItem({ log }: { log: ActivityLogEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {log.eventType}
          </Badge>
          <span className="text-sm">{log.stageName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {format(new Date(log.timestamp), "PP pp")}
          </span>
          {isExpanded ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
        </div>
      </button>

      {isExpanded && log.payload && (
        <div className="mt-3">
          <CodeClient
            code={
              typeof log.payload === "string"
                ? log.payload
                : stringify(log.payload, null, 2)
            }
            lang="json"
          />
        </div>
      )}
    </div>
  );
}
