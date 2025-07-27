import { useMutation } from "@tanstack/react-query";
import { format, formatDate } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Transaction } from "@/hooks/useEngine";
import { cn } from "@/lib/utils";

interface TimelineStep {
  step: string;
  isLatest?: boolean;
  date?: string | null;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  cta?: any;
}

export function TransactionTimeline({
  transaction,
  instanceUrl,
  authToken,
  client,
}: {
  transaction: Transaction;
  instanceUrl: string;
  client: ThirdwebClient;
  authToken: string;
}) {
  let timeline: TimelineStep[];
  switch (transaction?.status) {
    case "queued":
      // Queued: [ queued, _sent, _mined ]
      timeline = [
        {
          cta: (
            <CancelTransactionButton
              authToken={authToken}
              client={client}
              instanceUrl={instanceUrl}
              transaction={transaction}
            />
          ),
          date: transaction.queuedAt,
          isLatest: true,
          step: "Queued",
        },
        { step: "Sent" },
        { step: "Mined" },
      ];
      break;
    case "sent":
      // Sent: [ queued, sent, _mined ]
      timeline = [
        { date: transaction.queuedAt, step: "Queued" },
        {
          cta: (
            <CancelTransactionButton
              authToken={authToken}
              client={client}
              instanceUrl={instanceUrl}
              transaction={transaction}
            />
          ),
          date: transaction.sentAt,
          isLatest: true,
          step: "Sent",
        },
        { step: "Mined" },
      ];
      break;
    case "mined":
      // Mined: [ queued, sent, mined ]
      timeline = [
        { date: transaction.queuedAt, step: "Queued" },
        { date: transaction.sentAt, step: "Sent" },
        { date: transaction.minedAt, isLatest: true, step: "Mined" },
      ];
      break;
    case "cancelled":
      // Mined: [ queued, sent, cancelled, _mined ]
      timeline = [
        { date: transaction.queuedAt, step: "Queued" },
        { date: transaction.sentAt, step: "Sent" },
        { date: transaction.cancelledAt, isLatest: true, step: "Cancelled" },
        { step: "Mined" },
      ];
      break;
    case "errored":
      if (transaction.sentAt) {
        // Errored with sentAt: [ queued, sent, errored, _mined ]
        timeline = [
          { date: transaction.queuedAt, step: "Queued" },
          { date: transaction.sentAt, step: "Sent" },
          { isLatest: true, step: "Failed" },
          { step: "Mined" },
        ];
      } else {
        // Errored without sentAt: [ queued, errored, _sent, _mined ]
        timeline = [
          { date: transaction.queuedAt, step: "Queued" },
          { isLatest: true, step: "Failed" },
          { step: "Sent" },
          { step: "Mined" },
        ];
      }
      break;
    default:
      return null;
  }

  const activeIdx = timeline.findIndex((s) => !!s.isLatest);

  return (
    <div className="flex flex-col gap-0">
      {timeline.map((step, index) => {
        const isFilled = index <= activeIdx;
        const isLast = index === timeline.length - 1;

        return (
          <div
            key={step.step}
            className={cn(
              "flex items-start gap-3 relative min-h-10",
              isLast && "min-h-0",
            )}
          >
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              {/* circle */}
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border-2",
                  isFilled
                    ? "border-inverted bg-inverted text-inverted-foreground"
                    : "border-muted-foreground/30 bg-card text-muted-foreground",
                )}
              >
                {isFilled && (
                  <CheckIcon
                    className="size-4"
                    style={{
                      strokeWidth: "3px",
                    }}
                  />
                )}
              </div>

              {/* line */}
              {!isLast && (
                <div
                  className={`absolute top-0 bottom-0 left-3 w-0.5 -z-10 -translate-x-1/2 ${
                    isFilled ? "bg-foreground/20" : "bg-muted-foreground/30"
                  }`}
                />
              )}
            </div>

            {/* Step content */}
            <div className={cn("space-y-3", !isLast && "pb-4")}>
              <div className="space-y-0.5">
                <div
                  className={`text-sm font-medium ${
                    isFilled ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.step}
                </div>

                {step.date && (
                  <div className="text-sm text-muted-foreground">
                    {formatDate(new Date(step.date), "PP pp z")}
                  </div>
                )}
              </div>
              {step.cta}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CancelTransactionButton({
  transaction,
  instanceUrl,
  authToken,
  client,
}: {
  transaction: Transaction;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelTransactionMutation = useMutation({
    mutationFn: async () => {
      const resp = await fetch(`${instanceUrl}transaction/cancel`, {
        body: JSON.stringify({ queueId: transaction.queueId }),
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "x-backend-wallet-address": transaction.fromAddress ?? "",
        },
        method: "POST",
      });

      if (!resp.ok) {
        const json = await resp.json();
        throw json.error?.message;
      }
    },
  });

  const cancelTransactions = async () => {
    const promise = cancelTransactionMutation.mutateAsync();
    toast.promise(promise, {
      error: "Failed to cancel transaction",
      success: "Transaction cancelled successfully",
    });

    promise.then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-2 bg-card"
        >
          <XIcon className="size-4 text-muted-foreground" />
          Cancel transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Cancel Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this transaction?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-4 lg:px-6 pb-6">
          <div className="space-y-1">
            <Label>Queue ID</Label>
            <p className="font-mono text-sm">{transaction.queueId}</p>
          </div>

          <div className="space-y-1">
            <Label>Submitted at</Label>
            <p className="text-sm">
              {format(new Date(transaction.queuedAt ?? ""), "PP pp z")}
            </p>
          </div>

          <div className="space-y-1">
            <Label>From</Label>
            <WalletAddress
              address={transaction.fromAddress ?? ""}
              client={client}
              shortenAddress={false}
              className="h-auto py-1"
              iconClassName="size-4"
            />
          </div>

          <div className="space-y-1">
            <Label>To</Label>
            <CopyAddressButton
              address={transaction.toAddress ?? ""}
              copyIconPosition="right"
              variant="ghost"
              className="-translate-x-1"
            />
          </div>

          {transaction.functionName && (
            <div className="space-y-1">
              <Label>Function</Label>
              <p className="font-mono text-sm">{transaction.functionName}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            If this transaction is already submitted, it may complete before the
            cancellation is submitted.
          </p>
        </div>

        <div className="flex justify-end bg-card gap-3 border-border border-t pt-4 p-4 lg:p-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            variant="destructive"
            disabled={cancelTransactionMutation.isPending}
            onClick={cancelTransactions}
          >
            {cancelTransactionMutation.isPending
              ? "Cancelling..."
              : "Cancel transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
