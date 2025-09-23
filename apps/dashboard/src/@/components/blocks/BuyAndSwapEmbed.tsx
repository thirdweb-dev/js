"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Chain } from "thirdweb";
import { BuyWidget, SwapWidget } from "thirdweb/react";
import {
  reportAssetBuyCancelled,
  reportAssetBuyFailed,
  reportAssetBuySuccessful,
  reportSwapWidgetShown,
  reportTokenBuyCancelled,
  reportTokenBuyFailed,
  reportTokenBuySuccessful,
  reportTokenSwapCancelled,
  reportTokenSwapFailed,
  reportTokenSwapSuccessful,
} from "@/analytics/report";
import { Button } from "@/components/ui/button";
import {
  NEXT_PUBLIC_ASSET_PAGE_CLIENT_ID,
  NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID,
  NEXT_PUBLIC_CHAIN_PAGE_CLIENT_ID,
} from "@/constants/public-envs";
import { cn } from "@/lib/utils";
import { parseError } from "@/utils/errorParser";
import { getSDKTheme } from "@/utils/sdk-component-theme";
import { getConfiguredThirdwebClient } from "../../constants/thirdweb.server";

type PageType = "asset" | "bridge" | "chain";

export function BuyAndSwapEmbed(props: {
  chain: Chain;
  tokenAddress: string | undefined;
  buyAmount: string | undefined;
  pageType: PageType;
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

  const client = useMemo(() => {
    return getConfiguredThirdwebClient({
      clientId:
        props.pageType === "asset"
          ? NEXT_PUBLIC_ASSET_PAGE_CLIENT_ID
          : props.pageType === "bridge"
            ? NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID
            : props.pageType === "chain"
              ? NEXT_PUBLIC_CHAIN_PAGE_CLIENT_ID
              : undefined,
      secretKey: undefined,
      teamId: undefined,
    });
  }, [props.pageType]);

  return (
    <div className="bg-card rounded-2xl border overflow-hidden flex flex-col relative z-10 shadow-xl">
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
          client={client}
          connectOptions={{
            autoConnect: false,
          }}
          onError={(e, quote) => {
            const errorMessage = parseError(e);

            reportTokenBuyFailed({
              buyTokenChainId:
                quote?.type === "buy"
                  ? quote.intent.destinationChainId
                  : quote?.type === "onramp"
                    ? quote.intent.chainId
                    : undefined,
              buyTokenAddress:
                quote?.type === "buy"
                  ? quote.intent.destinationTokenAddress
                  : quote?.type === "onramp"
                    ? quote.intent.tokenAddress
                    : undefined,
              pageType: props.pageType,
            });

            if (props.pageType === "asset") {
              reportAssetBuyFailed({
                assetType: "coin",
                chainId: props.chain.id,
                error: errorMessage,
                contractType: undefined,
              });
            }
          }}
          onCancel={(quote) => {
            reportTokenBuyCancelled({
              buyTokenChainId:
                quote?.type === "buy"
                  ? quote.intent.destinationChainId
                  : quote?.type === "onramp"
                    ? quote.intent.chainId
                    : undefined,
              buyTokenAddress:
                quote?.type === "buy"
                  ? quote.intent.destinationTokenAddress
                  : quote?.type === "onramp"
                    ? quote.intent.tokenAddress
                    : undefined,
              pageType: props.pageType,
            });

            if (props.pageType === "asset") {
              reportAssetBuyCancelled({
                assetType: "coin",
                chainId: props.chain.id,
                contractType: undefined,
              });
            }
          }}
          onSuccess={(quote) => {
            reportTokenBuySuccessful({
              buyTokenChainId:
                quote.type === "buy"
                  ? quote.intent.destinationChainId
                  : quote.type === "onramp"
                    ? quote.intent.chainId
                    : undefined,
              buyTokenAddress:
                quote.type === "buy"
                  ? quote.intent.destinationTokenAddress
                  : quote.type === "onramp"
                    ? quote.intent.tokenAddress
                    : undefined,
              pageType: props.pageType,
            });

            if (props.pageType === "asset") {
              reportAssetBuySuccessful({
                assetType: "coin",
                chainId: props.chain.id,
                contractType: undefined,
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
          client={client}
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
