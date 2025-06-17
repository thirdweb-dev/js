import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { getSDKTheme } from "@/config/sdk-component-theme";
import { useAllChainsData } from "@/hooks/chains";
import { cn } from "@/lib/utils";
// import { useTrack } from "hooks/analytics/useTrack";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";
import { ExternalLinkIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useState } from "react";
import { type PreparedTransaction, waitForReceipt } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

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

export function TxStatusRow(props: {
  status: TxStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-medium text-muted-foreground">Status</span>
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "flex items-center gap-2 font-medium",
            props.status.type === "sending" &&
              "text-blue-700 dark:text-blue-500",
            props.status.type === "confirming" &&
              "text-yellow-600 dark:text-yellow-500",
            props.status.type === "confirmed" &&
              "text-green-700 dark:text-green-500",
            props.status.type === "failed" && "text-red-700 dark:text-red-500",
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

          {props.status.type === "failed" && <CircleXIcon className="size-4" />}

          {/* text */}
          <span>
            {props.status.type === "sending" && "Sending Transaction"}
            {props.status.type === "confirming" && "Waiting for Confirmation"}
            {props.status.type === "confirmed" && "Transaction Confirmed"}
            {props.status.type === "failed" && "Transaction Failed"}
          </span>
        </span>
      </div>
    </div>
  );
}

export function TxHashRow(props: {
  chainId: number;
  txHash: string;
}) {
  const { idToChain } = useAllChainsData();
  const chainMetadata = idToChain.get(props.chainId);
  const explorer = chainMetadata?.explorers?.[0]?.url;

  return (
    <div className="flex items-center justify-between gap-1">
      <span className="font-medium text-muted-foreground">
        Transaction Hash
      </span>
      <div className="flex justify-end gap-2.5">
        {explorer ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 font-mono"
          >
            <Link href={`${explorer}/tx/${props.txHash}`} target="_blank">
              {`${props.txHash.slice(0, 6)}...${props.txHash.slice(-4)}`}
              <ExternalLinkIcon className="size-3" />
            </Link>
          </Button>
        ) : (
          <CopyTextButton
            textToCopy={props.txHash}
            textToShow={`${props.txHash.slice(0, 6)}...${props.txHash.slice(-4)}`}
            variant="ghost"
            className="font-mono"
            copyIconPosition="right"
            tooltip="Copy Transaction Hash"
          />
        )}
      </div>
    </div>
  );
}

export function useTxSetup() {
  const [status, setStatus] = useState<TxStatus>({ type: "idle" });
  const { theme } = useTheme();

  const sendTransaction = useSendTransaction({
    payModal: {
      theme: getSDKTheme(theme === "light" ? "light" : "dark"),
    },
  });

  // const trackEvent = useTrack();

  const sendTx = useCallback(
    async (
      tx: PreparedTransaction,
      onTxSettled: ((txHash: string) => void) | undefined,
    ) => {
      let txHash: string | undefined;

      // trackEvent({
      //   category: "nebula",
      //   action: "execute_transaction",
      //   label: "attempt",
      // });

      try {
        // submit transaction
        setStatus({ type: "sending" });
        const submittedReceipt = await sendTransaction.mutateAsync(tx);
        txHash = submittedReceipt.transactionHash;

        // trackEvent({
        //   category: "nebula",
        //   action: "execute_transaction",
        //   label: "sent",
        // });

        // wait for receipt
        setStatus({
          type: "confirming",
          txHash: submittedReceipt.transactionHash,
        });

        const confirmReceipt = await waitForReceipt(submittedReceipt);
        txHash = confirmReceipt.transactionHash;
        setStatus({
          type: "confirmed",
          txHash: confirmReceipt.transactionHash,
        });

        onTxSettled?.(txHash);

        // trackEvent({
        //   category: "nebula",
        //   action: "execute_transaction",
        //   label: "confirmed",
        // });
      } catch (e) {
        console.error(e);
        if (txHash) {
          onTxSettled?.(txHash);
        }
        setStatus({
          type: "failed",
          txHash: txHash,
        });
      }
    },
    [sendTransaction],
  );

  return {
    status,
    setStatus,
    sendTx,
  };
}
