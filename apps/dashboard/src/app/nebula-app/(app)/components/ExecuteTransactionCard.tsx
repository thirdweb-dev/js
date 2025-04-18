import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRightLeftIcon,
  CircleCheckIcon,
  CircleXIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import {
  type ThirdwebClient,
  prepareTransaction,
  toEther,
  waitForReceipt,
} from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { TransactionButton } from "../../../../components/buttons/TransactionButton";
import { ChainIconClient } from "../../../../components/icons/ChainIcon";
import { useTrack } from "../../../../hooks/analytics/useTrack";
import { useV5DashboardChain } from "../../../../lib/v5-adapter";
import { getSDKTheme } from "../../../components/sdk-component-theme";
import type { NebulaTxData } from "./Chats";

export type TxStatus =
  | {
      type: "idle";
    }
  | {
      type: "sending";
    }
  | {
      type: "confirming";
      txHash: string;
    }
  | {
      type: "confirmed";
      txHash: string;
    }
  | {
      type: "failed";
      txHash: string | undefined;
    };

export function ExecuteTransactionCard(props: {
  txData: NebulaTxData;
  client: ThirdwebClient;
}) {
  const [status, setStatus] = useState<TxStatus>({ type: "idle" });
  return (
    <ExecuteTransactionCardLayout
      txData={props.txData}
      client={props.client}
      status={status}
      setStatus={setStatus}
    />
  );
}

export function ExecuteTransactionCardLayout(props: {
  txData: NebulaTxData;
  client: ThirdwebClient;
  status: TxStatus;
  setStatus: (status: TxStatus) => void;
}) {
  const { theme } = useTheme();
  const { txData } = props;
  const sendTransaction = useSendTransaction({
    payModal: {
      theme: getSDKTheme(theme === "light" ? "light" : "dark"),
    },
  });
  const chain = useV5DashboardChain(txData.chainId);
  const trackEvent = useTrack();
  const account = useActiveAccount();

  const explorer = chain.blockExplorers?.[0]?.url;

  const isTransactionPending =
    props.status.type === "sending" || props.status.type === "confirming";

  return (
    <div>
      <div className="rounded-xl border bg-card">
        {/* header */}
        <h3 className="border-b p-4 py-4 font-semibold text-foreground text-lg tracking-tight lg:px-6 lg:text-xl">
          Transaction
        </h3>

        {/* content */}
        <div className="px-4 text-sm lg:px-6 [&>*]:h-12 [&>*]:border-b lg:[&>*]:h-14">
          {/* From */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">From</span>
            {account ? (
              <WalletAddress
                address={account.address}
                className="h-auto py-0"
                iconClassName="size-5"
              />
            ) : (
              <span className="text-muted-foreground">Your Wallet</span>
            )}
          </div>

          {/* To */}
          {txData.to && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">To</span>

              <WalletAddress
                address={txData.to}
                className="h-auto py-0"
                iconClassName="size-5"
              />
            </div>
          )}

          {/* Value */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Value</span>
            {toEther(BigInt(txData.value))} {chain.nativeCurrency?.symbol}
          </div>

          {/* Network */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
              <ChainIconClient
                className="size-5 rounded-full"
                src={chain.icon?.url}
              />
              <span className="text-foreground">
                {chain.name || `Chain ID: ${txData.chainId}`}
              </span>
            </div>
          </div>

          {/* Status */}
          {props.status.type !== "idle" && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-2 font-medium",
                    props.status.type === "sending" && "text-blue-500",
                    props.status.type === "confirming" && "text-yellow-500",
                    props.status.type === "confirmed" && "text-green-500",
                    props.status.type === "failed" && "text-red-500",
                  )}
                >
                  {/* icon */}
                  {(props.status.type === "sending" ||
                    props.status.type === "confirming") && (
                    <Spinner className="size-4" />
                  )}

                  {props.status.type === "confirmed" && (
                    <CircleCheckIcon className="size-4" />
                  )}

                  {props.status.type === "failed" && (
                    <CircleXIcon className="size-4" />
                  )}

                  {/* text */}
                  <span>
                    {props.status.type === "sending" && "Sending Transaction"}
                    {props.status.type === "confirming" &&
                      "Waiting for Confirmation"}
                    {props.status.type === "confirmed" &&
                      "Transaction Confirmed"}
                    {props.status.type === "failed" && "Transaction Failed"}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Transaction Hash */}
          {"txHash" in props.status && props.status.txHash && (
            <div className="flex items-center justify-between gap-1">
              <span className="text-muted-foreground">Transaction Hash</span>
              <div className="flex justify-end gap-2.5">
                {explorer ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 font-mono"
                  >
                    <Link
                      href={`${explorer}/tx/${props.status.txHash}`}
                      target="_blank"
                    >
                      {`${props.status.txHash.slice(0, 6)}...${props.status.txHash.slice(-4)}`}
                      <ExternalLinkIcon className="size-3" />
                    </Link>
                  </Button>
                ) : (
                  <CopyTextButton
                    textToCopy={props.status.txHash}
                    textToShow={`${props.status.txHash.slice(0, 6)}...${props.status.txHash.slice(-4)}`}
                    variant="ghost"
                    className="font-mono"
                    copyIconPosition="right"
                    tooltip="Copy Transaction Hash"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-end px-4 py-6 lg:px-6">
          <TransactionButton
            isPending={sendTransaction.isPending}
            transactionCount={undefined}
            txChainID={txData.chainId}
            variant="default"
            disabled={isTransactionPending}
            size="sm"
            onClick={async () => {
              trackEvent({
                category: "nebula",
                action: "execute_transaction",
                label: "attempt",
                chainId: txData.chainId,
              });

              const tx = prepareTransaction({
                chain: chain,
                client: props.client,
                data: txData.data,
                to: txData.to,
                value: BigInt(txData.value),
              });

              let txHash: string | undefined;

              try {
                // submit transaction
                props.setStatus({ type: "sending" });
                const submittedReceipt = await sendTransaction.mutateAsync(tx);
                txHash = submittedReceipt.transactionHash;

                trackEvent({
                  category: "nebula",
                  action: "execute_transaction",
                  label: "sent",
                  chainId: txData.chainId,
                });

                // wait for receipt
                props.setStatus({
                  type: "confirming",
                  txHash: submittedReceipt.transactionHash,
                });

                const confirmReceipt = await waitForReceipt(submittedReceipt);
                txHash = confirmReceipt.transactionHash;
                props.setStatus({
                  type: "confirmed",
                  txHash: confirmReceipt.transactionHash,
                });

                trackEvent({
                  category: "nebula",
                  action: "execute_transaction",
                  label: "confirmed",
                  chainId: txData.chainId,
                });
              } catch {
                props.setStatus({
                  type: "failed",
                  txHash: txHash,
                });
              }
            }}
            className="gap-2"
            isLoggedIn={true}
          >
            <ArrowRightLeftIcon className="size-4" />
            Execute Transaction
          </TransactionButton>
        </div>
      </div>
    </div>
  );
}
