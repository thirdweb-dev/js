"use client";

import { useTheme } from "next-themes";
import { BuyWidget, PayEmbed, type TokenInfo } from "thirdweb/react";
import { getSDKTheme } from "../../../(app)/components/sdk-component-theme";
import { useV5DashboardChain } from "../../../../lib/v5-adapter";
import { bridgeAppThirdwebClient } from "../../constants";
import type { Address } from "thirdweb";

export function UniversalBridgeEmbed({
  chainId,
  token,
  amount,
}: { chainId?: number; token: TokenInfo | undefined; amount?: string }) {
  const { theme } = useTheme();
  const chain = useV5DashboardChain(chainId || 1);

  if (chainId && token) {
    return (
      <BuyWidget
        client={bridgeAppThirdwebClient}
        chain={chain}
        tokenAddress={token.address as Address}
        amount={amount ?? "1"}
      />
    );
  }

  return (
    <PayEmbed
      client={bridgeAppThirdwebClient}
      payOptions={{
        mode: "fund_wallet",
        prefillBuy: {
          chain,
          token,
          amount,
        },
      }}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
    />
  );
}
