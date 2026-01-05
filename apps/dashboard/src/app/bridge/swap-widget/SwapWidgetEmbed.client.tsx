"use client";

import { useMemo } from "react";
import type { Address } from "thirdweb";
import { type SupportedFiatCurrency, SwapWidget } from "thirdweb/react";
import { NEXT_PUBLIC_SWAP_IFRAME_CLIENT_ID } from "@/constants/public-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";

export function SwapWidgetEmbed({
  buyChainId,
  buyTokenAddress,
  buyAmount,
  sellChainId,
  sellTokenAddress,
  sellAmount,
  showThirdwebBranding,
  theme,
  currency,
  persistTokenSelections,
}: {
  buyChainId?: number;
  buyTokenAddress?: Address;
  buyAmount?: string;
  sellChainId?: number;
  sellTokenAddress?: Address;
  sellAmount?: string;
  showThirdwebBranding?: boolean;
  theme: "light" | "dark";
  currency?: SupportedFiatCurrency;
  persistTokenSelections?: boolean;
}) {
  const client = useMemo(
    () =>
      getConfiguredThirdwebClient({
        clientId: NEXT_PUBLIC_SWAP_IFRAME_CLIENT_ID,
        secretKey: undefined,
        teamId: undefined,
      }),
    [],
  );

  const prefill = useMemo(() => {
    const result: {
      buyToken?: { chainId: number; tokenAddress?: string; amount?: string };
      sellToken?: { chainId: number; tokenAddress?: string; amount?: string };
    } = {};

    if (buyChainId) {
      result.buyToken = {
        chainId: buyChainId,
        tokenAddress: buyTokenAddress,
        amount: buyAmount,
      };
    }

    if (sellChainId) {
      result.sellToken = {
        chainId: sellChainId,
        tokenAddress: sellTokenAddress,
        amount: sellAmount,
      };
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }, [
    buyChainId,
    buyTokenAddress,
    buyAmount,
    sellChainId,
    sellTokenAddress,
    sellAmount,
  ]);

  return (
    <SwapWidget
      className="shadow-xl"
      client={client}
      prefill={prefill}
      showThirdwebBranding={showThirdwebBranding}
      theme={theme}
      currency={currency}
      persistTokenSelections={persistTokenSelections}
      onSuccess={() => {
        sendMessageToParent({
          source: "swap-widget",
          type: "success",
        });
      }}
      onError={(error) => {
        sendMessageToParent({
          source: "swap-widget",
          type: "error",
          message: error.message,
        });
      }}
    />
  );
}

function sendMessageToParent(content: object) {
  try {
    window.parent.postMessage(content, "*");
  } catch (error) {
    console.error("Failed to send post message to parent window");
    console.error(error);
  }
}
