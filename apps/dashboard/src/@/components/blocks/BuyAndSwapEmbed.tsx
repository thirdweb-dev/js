/* eslint-disable no-restricted-syntax */
"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import { BridgeWidget, type SupportedFiatCurrency } from "thirdweb/react";
import type { Wallet } from "thirdweb/wallets";
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
import {
  NEXT_PUBLIC_ASSET_PAGE_CLIENT_ID,
  NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID,
  NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID,
  NEXT_PUBLIC_CHAIN_PAGE_CLIENT_ID,
} from "@/constants/public-envs";
import { parseError } from "@/utils/errorParser";
import { getSDKTheme } from "@/utils/sdk-component-theme";
import { appMetadata } from "../../constants/connect";
import { getConfiguredThirdwebClient } from "../../constants/thirdweb.server";

type PageType = "asset" | "bridge" | "chain" | "bridge-iframe";

export type BuyAndSwapEmbedProps = {
  persistTokenSelections?: boolean;
  buyTab:
    | {
        buyToken:
          | {
              tokenAddress: string;
              chainId: number;
              amount?: string;
            }
          | undefined;
      }
    | undefined;
  swapTab:
    | {
        sellToken:
          | {
              chainId: number;
              tokenAddress: string;
              amount?: string;
            }
          | undefined;
        buyToken:
          | {
              chainId: number;
              tokenAddress: string;
              amount?: string;
            }
          | undefined;
      }
    | undefined;
  pageType: PageType;
  wallets?: Wallet[];
  currency?: SupportedFiatCurrency;
  showThirdwebBranding?: boolean;
};

export function BuyAndSwapEmbed(props: BuyAndSwapEmbedProps) {
  const { theme } = useTheme();
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
              : props.pageType === "bridge-iframe"
                ? NEXT_PUBLIC_BRIDGE_IFRAME_CLIENT_ID
                : undefined,
      secretKey: undefined,
      teamId: undefined,
    });
  }, [props.pageType]);

  return (
    <BridgeWidget
      client={client}
      theme={themeObj}
      className="z-10 min-w-0 shadow-xl"
      connectOptions={{
        autoConnect: false,
        wallets: props.wallets,
        appMetadata: appMetadata,
      }}
      buy={
        props.buyTab
          ? {
              amount: props.buyTab.buyToken?.amount,
              chainId: props.buyTab.buyToken?.chainId,
              tokenAddress: props.buyTab.buyToken?.tokenAddress,
              onError: (e, quote) => {
                const errorMessage = parseError(e);

                const buyChainId =
                  quote?.type === "buy"
                    ? quote.intent.destinationChainId
                    : quote?.type === "onramp"
                      ? quote.intent.chainId
                      : undefined;

                if (!buyChainId) {
                  return;
                }

                reportTokenBuyFailed({
                  buyTokenChainId: buyChainId,
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
                    chainId: buyChainId,
                    error: errorMessage,
                    contractType: undefined,
                    is_testnet: false,
                  });
                }
              },
              onCancel: (quote) => {
                const buyChainId =
                  quote?.type === "buy"
                    ? quote.intent.destinationChainId
                    : quote?.type === "onramp"
                      ? quote.intent.chainId
                      : undefined;

                if (!buyChainId) {
                  return;
                }

                reportTokenBuyCancelled({
                  buyTokenChainId: buyChainId,
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
                    chainId: buyChainId,
                    contractType: undefined,
                    is_testnet: false,
                  });
                }
              },
              onSuccess: ({ quote }) => {
                const buyChainId =
                  quote?.type === "buy"
                    ? quote.intent.destinationChainId
                    : quote?.type === "onramp"
                      ? quote.intent.chainId
                      : undefined;

                if (!buyChainId) {
                  return;
                }

                reportTokenBuySuccessful({
                  buyTokenChainId: buyChainId,
                  buyTokenAddress:
                    quote?.type === "buy"
                      ? quote.intent.destinationTokenAddress
                      : quote?.type === "onramp"
                        ? quote.intent.tokenAddress
                        : undefined,
                  pageType: props.pageType,
                });

                if (props.pageType === "asset") {
                  reportAssetBuySuccessful({
                    assetType: "coin",
                    chainId: buyChainId,
                    contractType: undefined,
                    is_testnet: false,
                  });
                }
              },
            }
          : undefined
      }
      swap={{
        persistTokenSelections: props.persistTokenSelections,
        prefill: {
          buyToken: props.swapTab?.buyToken,
          sellToken: props.swapTab?.sellToken,
        },
        onError: (error, quote) => {
          const errorMessage = parseError(error);
          reportTokenSwapFailed({
            errorMessage: errorMessage,
            buyTokenChainId: quote.intent.destinationChainId,
            buyTokenAddress: quote.intent.destinationTokenAddress,
            sellTokenChainId: quote.intent.originChainId,
            sellTokenAddress: quote.intent.originTokenAddress,
            pageType: props.pageType,
          });
        },
        onSuccess: ({ quote }) => {
          reportTokenSwapSuccessful({
            buyTokenChainId: quote.intent.destinationChainId,
            buyTokenAddress: quote.intent.destinationTokenAddress,
            sellTokenChainId: quote.intent.originChainId,
            sellTokenAddress: quote.intent.originTokenAddress,
            pageType: props.pageType,
          });
        },
        onCancel: (quote) => {
          reportTokenSwapCancelled({
            buyTokenChainId: quote.intent.destinationChainId,
            buyTokenAddress: quote.intent.destinationTokenAddress,
            sellTokenChainId: quote.intent.originChainId,
            sellTokenAddress: quote.intent.originTokenAddress,
            pageType: props.pageType,
          });
        },
      }}
      currency={props.currency}
      showThirdwebBranding={props.showThirdwebBranding}
    />
  );
}
