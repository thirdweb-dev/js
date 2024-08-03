"use client";

import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { isProd } from "constants/rpc";
import { thirdwebClient } from "lib/thirdweb-client";
import { CircleCheck, XIcon } from "lucide-react";
import { useState } from "react";
import { hostnameEndsWith } from "utils/url";
import { PrimaryInfoItem } from "../server/primary-info-item";

function useChainStatswithRPC(_rpcUrl: string) {
  const [shouldRefetch, setShouldRefetch] = useState(true);

  let rpcUrl = _rpcUrl.replace(
    // eslint-disable-next-line no-template-curly-in-string
    "${THIRDWEB_API_KEY}",
    thirdwebClient.clientId,
  );

  // based on the environment hit dev or production
  if (hostnameEndsWith(rpcUrl, "rpc.thirdweb.com")) {
    if (!isProd) {
      rpcUrl = rpcUrl.replace("rpc.thirdweb.com", "rpc.thirdweb-dev.com");
    }
  }

  return useQuery({
    queryKey: ["chain-stats", { rpcUrl }],
    queryFn: async () => {
      const startTimeStamp = performance.now();
      const res = await fetch(rpcUrl, {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
      });

      const json = await res.json();
      const latency = (performance.now() - startTimeStamp).toFixed(0);

      return {
        latency,
        blockNumber: Number.parseInt(json.result, 16),
      };
    },
    refetchInterval: shouldRefetch ? 5 * 1000 : undefined,
    enabled: !!rpcUrl,
    refetchOnWindowFocus: false,
    onError: () => {
      setShouldRefetch(false);
    },
  });
}

export function ChainLiveStats(props: { rpc: string }) {
  const stats = useChainStatswithRPC(props.rpc);

  return (
    <>
      {/* RPC URL */}
      <PrimaryInfoItem
        title="RPC"
        titleIcon={
          stats.isSuccess ? (
            <ToolTipLabel label="Working">
              <CircleCheck className="size-4 text-success-text" />
            </ToolTipLabel>
          ) : stats.isError ? (
            <ToolTipLabel label="Not Working">
              <XIcon className="size-4 text-destructive-text" />
            </ToolTipLabel>
          ) : null
        }
      >
        <div className="flex items-center gap-1">
          <CopyTextButton
            tooltip="Copy RPC URL"
            textToShow={new URL(props.rpc).origin}
            textToCopy={props.rpc}
            copyIconPosition="right"
            variant="ghost"
            className="px-2 py-1 -translate-x-2 text-base"
            iconClassName="size-4"
          />
        </div>
      </PrimaryInfoItem>

      {/* Latency */}
      <PrimaryInfoItem title="RPC Latency" titleIcon={<PulseDot />}>
        {stats.isError ? (
          <p className="fade-in-0 animate-in text-destructive-text">N/A</p>
        ) : stats.data ? (
          <p className="fade-in-0 animate-in">{stats.data.latency}ms</p>
        ) : (
          <div className="flex py-1 h-[28px] w-[70px]">
            <Skeleton className="h-full w-full" />
          </div>
        )}
      </PrimaryInfoItem>

      {/* Block Height */}
      <PrimaryInfoItem title="Block Height" titleIcon={<PulseDot />}>
        {stats.isError ? (
          <p className="fade-in-0 animate-in text-destructive-text">N/A</p>
        ) : stats.data ? (
          <p className="fade-in-0 animate-in">{stats.data.blockNumber}</p>
        ) : (
          <div className="flex py-1 h-[28px] w-[140px]">
            <Skeleton className="h-full w-full" />
          </div>
        )}
      </PrimaryInfoItem>
    </>
  );
}

function PulseDot() {
  return (
    <ToolTipLabel label={"Live Data"}>
      <span className="relative flex size-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex rounded-full size-2 bg-primary" />
      </span>
    </ToolTipLabel>
  );
}
