"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import type { Chain, ThirdwebClient } from "thirdweb";
import { BuyWidget, SwapWidget } from "thirdweb/react";
import {
  reportAssetBuyFailed,
  reportAssetBuySuccessful,
  reportTokenSwapCancelled,
  reportTokenSwapFailed,
  reportTokenSwapSuccessful,
} from "@/analytics/report";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseError } from "@/utils/errorParser";
import { getSDKTheme } from "@/utils/sdk-component-theme";

export function BuyTokenEmbed(props: {
  client: ThirdwebClient;
  chain: Chain;
  tokenAddress: string;
}) {
  const { theme } = useTheme();
  const [tab, setTab] = useState<"buy" | "swap">("swap");
  const themeObj = getSDKTheme(theme === "light" ? "light" : "dark");
  return (
    <div className="bg-card rounded-2xl border overflow-hidden flex flex-col">
      <div className="flex gap-2.5 p-4 border-b border-dashed">
        <TabButton
          label="Swap"
          onClick={() => setTab("swap")}
          isActive={tab === "swap"}
        />
        <TabButton
          label="Buy"
          onClick={() => setTab("buy")}
          isActive={tab === "buy"}
        />
      </div>

      {tab === "buy" && (
        <BuyWidget
          amount="1"
          chain={props.chain}
          className="!rounded-2xl !w-full !border-none"
          title=""
          client={props.client}
          connectOptions={{
            autoConnect: false,
          }}
          onError={(e) => {
            const errorMessage = parseError(e);
            reportAssetBuyFailed({
              assetType: "coin",
              chainId: props.chain.id,
              contractType: "DropERC20",
              error: errorMessage,
            });
          }}
          onSuccess={() => {
            reportAssetBuySuccessful({
              assetType: "coin",
              chainId: props.chain.id,
              contractType: "DropERC20",
            });
          }}
          theme={themeObj}
          tokenAddress={props.tokenAddress as `0x${string}`}
          paymentMethods={["card"]}
        />
      )}

      {tab === "swap" && (
        <SwapWidget
          client={props.client}
          theme={themeObj}
          className="!rounded-2xl !border-none !w-full"
          prefill={{
            sellToken: {
              chainId: props.chain.id,
              tokenAddress: props.tokenAddress,
            },
            buyToken: {
              chainId: props.chain.id,
            },
          }}
          onError={(error, quote) => {
            reportTokenSwapFailed({
              errorMessage: error.message,
              buyTokenChainId: quote.intent.destinationChainId,
              buyTokenAddress: quote.intent.destinationTokenAddress,
              sellTokenChainId: quote.intent.originChainId,
              sellTokenAddress: quote.intent.originTokenAddress,
            });
          }}
          onSuccess={(quote) => {
            reportTokenSwapSuccessful({
              buyTokenChainId: quote.intent.destinationChainId,
              buyTokenAddress: quote.intent.destinationTokenAddress,
              sellTokenChainId: quote.intent.originChainId,
              sellTokenAddress: quote.intent.originTokenAddress,
            });
          }}
          onCancel={(quote) => {
            reportTokenSwapCancelled({
              buyTokenChainId: quote.intent.destinationChainId,
              buyTokenAddress: quote.intent.destinationTokenAddress,
              sellTokenChainId: quote.intent.originChainId,
              sellTokenAddress: quote.intent.originTokenAddress,
            });
          }}
        />
      )}
    </div>
  );
}

function TabButton(props: {
  label: string;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <Button
      onClick={props.onClick}
      className={cn(
        "rounded-full text-muted-foreground px-5 text-base bg-accent",
        props.isActive && "text-foreground border-foreground",
      )}
      variant="outline"
    >
      {props.label}
    </Button>
  );
}
