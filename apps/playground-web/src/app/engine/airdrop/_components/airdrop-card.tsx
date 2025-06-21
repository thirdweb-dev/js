"use client";

import { formatDate } from "date-fns";
import { CheckIcon, ExternalLinkIcon, SendIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "../../../../components/ui/Spinner/Spinner";
import { cn } from "../../../../lib/utils";
import type { EngineTxStatus } from "../../types";
import { airdropExample } from "../constants";

export function EngineAirdropCard(props: {
  txStatus: EngineTxStatus | undefined;
  isAirdropping: boolean;
  onStartAirdrop: () => void;
}) {
  const [hasSentTxRequest, setHasSentTxRequest] = useState(false);
  const getProgressPercentage = () => {
    if (!props.txStatus && !props.isAirdropping) {
      return 0;
    } else if (props.txStatus?.status === "queued") {
      return 25;
    } else if (props.txStatus?.status === "sent") {
      return 75;
    } else if (props.txStatus?.status === "mined") {
      return 100;
    }
  };

  const progressPercentage = getProgressPercentage();

  const getProgressMessage = () => {
    if (!props.txStatus && !props.isAirdropping) {
      return "Start the airdrop to distribute tokens to recipients";
    } else if (props.txStatus?.status === "mined") {
      return "Airdrop complete! Tokens have been successfully distributed.";
    } else {
      return "Processing your airdrop. This may take a few moments.";
    }
  };

  const airdropState = getAirdropState(props.txStatus, props.isAirdropping);

  const Icon = !airdropState
    ? SendIcon
    : airdropState?.status === "pending"
      ? Spinner
      : airdropState?.status === "success"
        ? CheckIcon
        : XIcon;

  return (
    <Card className="w-full max-w-lg bg-background">
      <CardHeader className="space-y-1">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full border bg-card">
          <Icon
            className={cn(
              "size-5",
              !airdropState && "text-muted-foreground",
              airdropState?.status === "error" && "text-red-500",
              airdropState?.status === "success" && "text-green-500",
            )}
          />
        </div>

        <CardTitle className="font-semibold text-2xl tracking-tight">
          Airdrop
        </CardTitle>
        <p className="text-muted-foreground text-sm">{getProgressMessage()}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress className="h-2" value={progressPercentage} />
          {airdropState && (
            <AirdropStateInfo
              isAirdropping={props.isAirdropping}
              state={airdropState}
              txStatus={props.txStatus}
            />
          )}
        </div>
      </CardContent>

      {!hasSentTxRequest && (
        <CardFooter className="border-t px-6 py-6">
          <Button
            className="w-full gap-2"
            onClick={() => {
              setHasSentTxRequest(true);
              props.onStartAirdrop();
            }}
          >
            Start Airdrop
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

type AirdropState = {
  title: string;
  status: "pending" | "success" | "error";
  timestamp?: {
    prefix: string;
    value: string;
  };
};

function getAirdropState(
  txStatus: EngineTxStatus | undefined,
  isAirdropping: boolean,
): AirdropState | undefined {
  if (!txStatus) {
    if (isAirdropping) {
      return {
        status: "pending",
        timestamp: {
          prefix: "Started at",
          value: new Date().toISOString(),
        },
        title: "Sending Transaction Request",
      };
    }
    return undefined;
  }

  if (txStatus.status === "queued") {
    return {
      status: "pending",
      timestamp: {
        prefix: "Queued at",
        value: txStatus.queuedAt as string,
      },
      title: "Transaction queued",
    };
  }

  if (txStatus.status === "sent") {
    return {
      status: "pending",
      timestamp: {
        prefix: "Sent at",
        value: txStatus.sentAt as string,
      },
      title: "Transaction sent",
    };
  }

  if (txStatus.status === "mined") {
    return {
      status: "success",
      timestamp: {
        prefix: "Mined at",
        value: txStatus.minedAt as string,
      },
      title: "Transaction mined",
    };
  }

  if (txStatus.status === "cancelled" || txStatus.status === "errored") {
    return {
      status: "error",
      title: "Transaction failed",
    };
  }

  return;
}

function AirdropStateInfo(props: {
  txStatus: EngineTxStatus | undefined;
  isAirdropping: boolean;
  state: AirdropState;
}) {
  const state = props.state;

  return (
    <div className="flex items-start gap-3">
      <div className="space-y-1">
        <p className="font-medium capitalize">{state.title}</p>
        {state.timestamp && (
          <p className="text-muted-foreground text-sm">
            {state.timestamp?.prefix}{" "}
            {formatDate(
              new Date(state.timestamp.value),
              "dd MMM yyyy HH:mm:ss",
            )}
          </p>
        )}

        {/* Simplified transaction hash display */}
        {props.txStatus?.transactionHash && (
          <div className="flex items-center text-sm">
            <span className="mr-1 text-muted-foreground">Transaction Hash</span>
            <a
              className="flex items-center gap-1 font-mono text-muted-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground"
              href={`${airdropExample.chainExplorer}/tx/${props.txStatus.transactionHash}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {props.txStatus.transactionHash.slice(0, 6)}...
              {props.txStatus.transactionHash.slice(-4)}
              <ExternalLinkIcon className="size-3 opacity-70" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
