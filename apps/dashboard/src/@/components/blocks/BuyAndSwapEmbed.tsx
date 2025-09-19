"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type { Chain, ThirdwebClient } from "thirdweb";
import { BuyWidget, SwapWidget } from "thirdweb/react";
import {
  reportAssetBuyCancelled,
  reportAssetBuyFailed,
  reportAssetBuySuccessful,
  reportSwapWidgetShown,
  reportTokenSwapCancelled,
  reportTokenSwapFailed,
  reportTokenSwapSuccessful,
} from "@/analytics/report";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseError } from "@/utils/errorParser";
import { getSDKTheme } from "@/utils/sdk-component-theme";

export function BuyAndSwapEmbed(props: {
  client: ThirdwebClient;
  chain: Chain;
  tokenAddress: string | undefined;
  buyAmount: string | undefined;
  pageType: "asset" | "bridge" | "chain";
}) {
  const { theme } = useTheme();
  const [tab, setTab] = useState<"buy" | "swap">("swap");
  const themeObj = getSDKTheme(theme === "light" ? "light" : "dark");
  const isMounted = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    isMounted.current = true;
    reportSwapWidgetShown({
      pageType: props.pageType,
    });
  }, [props.pageType]);

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
          amount={props.buyAmount || "1"}
          chain={props.chain}
          className="!rounded-2xl !w-full !border-none"
          title=""
          client={props.client}
          connectOptions={{
            autoConnect: false,
          }}
          onError={(e) => {
            const errorMessage = parseError(e);
            if (props.pageType === "asset") {
              reportAssetBuyFailed({
                assetType: "coin",
                chainId: props.chain.id,
                contractType: "DropERC20",
                error: errorMessage,
              });
            }
          }}
          onCancel={() => {
            if (props.pageType === "asset") {
              reportAssetBuyCancelled({
                assetType: "coin",
                chainId: props.chain.id,
                contractType: "DropERC20",
              });
            }
          }}
          onSuccess={() => {
            if (props.pageType === "asset") {
              reportAssetBuySuccessful({
                assetType: "coin",
                chainId: props.chain.id,
                contractType: "DropERC20",
              });
            }
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
            // buy this token by default
            buyToken: {
              chainId: props.chain.id,
              tokenAddress: props.tokenAddress,
            },
            // sell the native token by default (but if buytoken is a native token, don't set)
            sellToken: props.tokenAddress
              ? {
                  chainId: props.chain.id,
                }
              : undefined,
          }}
          onError={(error, quote) => {
            const errorMessage = parseError(error);
            reportTokenSwapFailed({
              errorMessage: errorMessage,
              buyTokenChainId: quote.intent.destinationChainId,
              buyTokenAddress: quote.intent.destinationTokenAddress,
              sellTokenChainId: quote.intent.originChainId,
              sellTokenAddress: quote.intent.originTokenAddress,
              pageType: props.pageType,
            });
          }}
          onSuccess={(quote) => {
            reportTokenSwapSuccessful({
              buyTokenChainId: quote.intent.destinationChainId,
              buyTokenAddress: quote.intent.destinationTokenAddress,
              sellTokenChainId: quote.intent.originChainId,
              sellTokenAddress: quote.intent.originTokenAddress,
              pageType: props.pageType,
            });
          }}
          onCancel={(quote) => {
            reportTokenSwapCancelled({
              buyTokenChainId: quote.intent.destinationChainId,
              buyTokenAddress: quote.intent.destinationTokenAddress,
              sellTokenChainId: quote.intent.originChainId,
              sellTokenAddress: quote.intent.originTokenAddress,
              pageType: props.pageType,
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
