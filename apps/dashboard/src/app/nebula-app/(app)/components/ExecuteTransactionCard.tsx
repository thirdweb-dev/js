import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import type { Account as TWAccount } from "@3rdweb-sdk/react/hooks/useApi";
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
  waitForReceipt,
} from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { TransactionButton } from "../../../../components/buttons/TransactionButton";
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
  twAccount: TWAccount;
  client: ThirdwebClient;
}) {
  const [status, setStatus] = useState<TxStatus>({ type: "idle" });
  return (
    <ExecuteTransactionCardLayout
      txData={props.txData}
      twAccount={props.twAccount}
      client={props.client}
      status={status}
      setStatus={setStatus}
    />
  );
}

export function ExecuteTransactionCardLayout(props: {
  txData: NebulaTxData;
  twAccount: TWAccount;
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
  const isTransactionSent =
    props.status.type === "confirming" || props.status.type === "confirmed";

  const explorer = chain.blockExplorers?.[0]?.url;

  return (
    <div>
      <div className="rounded-xl border bg-muted/50">
        <div className="flex flex-col gap-4 p-4 pb-6">
          <h3 className="font-semibold text-foreground text-lg tracking-tight">
            Transaction
          </h3>

          <CodeClient code={JSON.stringify(txData, null, 2)} lang="json" />
        </div>

        <div className="flex items-center justify-end border-t p-4">
          <TransactionButton
            isPending={sendTransaction.isPending}
            transactionCount={undefined}
            txChainID={txData.chainId}
            variant="default"
            onClick={async () => {
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
              } catch {
                props.setStatus({
                  type: "failed",
                  txHash: txHash,
                });
              }
            }}
            className="gap-2"
            twAccount={props.twAccount}
          >
            <ArrowRightLeftIcon className="size-4" />
            Execute Transaction
          </TransactionButton>
        </div>
      </div>

      {/* Tx Status */}
      {props.status.type !== "idle" && (
        <div className="mt-5 rounded-lg border bg-muted/50">
          <div className="flex flex-col gap-1.5 p-4">
            {props.status.type === "sending" && (
              <div className="flex items-center gap-2 text-link-foreground">
                <Spinner className="size-4" />
                <p> Sending Transaction </p>
              </div>
            )}

            {isTransactionSent && (
              <div className="flex items-center gap-2 text-success-text">
                <CircleCheckIcon className="size-4" />
                <p> Transaction Sent </p>
              </div>
            )}

            {props.status.type === "confirming" && (
              <div className="flex items-center gap-2 text-link-foreground">
                <Spinner className="size-4" />
                <p> Confirming Transaction </p>
              </div>
            )}

            {props.status.type === "confirmed" && (
              <div className="flex items-center gap-2 text-success-text">
                <CircleCheckIcon className="size-4" />
                <p> Transaction Confirmed </p>
              </div>
            )}

            {props.status.type === "failed" && (
              <div className="flex items-center gap-2 text-destructive-text">
                <CircleXIcon className="size-4" />
                <p> Transaction Failed </p>
              </div>
            )}
          </div>

          {"txHash" in props.status && props.status.txHash && (
            <div className="flex justify-end gap-2.5 border-t p-4">
              {explorer && (
                <Button asChild variant="outline" size="sm" className="gap-2 ">
                  <Link
                    href={`${explorer}/tx/${props.status.txHash}`}
                    target="_blank"
                  >
                    View on Explorer
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                </Button>
              )}
              <CopyTextButton
                textToCopy={props.status.txHash}
                className=""
                textToShow="Transaction Hash"
                variant="outline"
                copyIconPosition="right"
                tooltip="Copy Transaction Hash"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
