"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleCheckIcon, XIcon } from "lucide-react";
import { hostnameEndsWith } from "utils/url";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { isProd } from "@/constants/env-utils";
import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";
import { PrimaryInfoItem } from "../server/primary-info-item";

function useChainStatswithRPC(_rpcUrl: string) {
  let rpcUrl = _rpcUrl.replace(
    // eslint-disable-next-line no-template-curly-in-string
    // biome-ignore lint/suspicious/noTemplateCurlyInString: this is expected in this case
    "${THIRDWEB_API_KEY}",
    NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
  );

  // based on the environment hit dev or production
  if (hostnameEndsWith(rpcUrl, "rpc.thirdweb.com")) {
    if (!isProd) {
      rpcUrl = rpcUrl.replace("rpc.thirdweb.com", "rpc.thirdweb-dev.com");
    }
  }

  return useQuery({
    enabled: !!rpcUrl,
    queryFn: async () => {
      const startTimeStamp = performance.now();
      const res = await fetch(rpcUrl, {
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "eth_getBlockByNumber",
          params: ["latest", false],
        }),
        method: "POST",
      });

      const json = await res.json();
      const latency = (performance.now() - startTimeStamp).toFixed(0);

      const blockNumber = Number.parseInt(json.result.number, 16);
      const blockGasLimit = Number.parseInt(json.result.gasLimit, 16);
      return {
        blockGasLimit,
        blockNumber,
        latency,
      };
    },
    queryKey: ["chain-stats", { rpcUrl }],
    refetchInterval: (query) => {
      if (query.state.error) {
        return false;
      }
      return 5 * 1000;
    },
    refetchOnWindowFocus: false,
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
              <CircleCheckIcon className="size-4 text-success-text" />
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
            className="-translate-x-2 px-2 py-1 text-base"
            copyIconPosition="right"
            iconClassName="size-4"
            textToCopy={props.rpc}
            textToShow={new URL(props.rpc).origin}
            tooltip="Copy RPC URL"
            variant="ghost"
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
          <div className="flex h-[28px] w-[70px] py-1">
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
          <div className="flex h-[28px] w-[140px] py-1">
            <Skeleton className="h-full w-full" />
          </div>
        )}
      </PrimaryInfoItem>

      {/* Block Gas Limit */}
      <PrimaryInfoItem title="Block Gas Limit" titleIcon={<PulseDot />}>
        {stats.isError ? (
          <p className="fade-in-0 animate-in text-destructive-text">N/A</p>
        ) : stats.data ? (
          <p className="fade-in-0 animate-in">
            {stats.data.blockGasLimit ?? "N/A"}
          </p>
        ) : (
          <div className="flex h-[28px] w-[140px] py-1">
            <Skeleton className="h-full w-full" />
          </div>
        )}
      </PrimaryInfoItem>
    </>
  );
}

function PulseDot() {
  return (
    <ToolTipLabel label="Live Data">
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
    </ToolTipLabel>
  );
}
