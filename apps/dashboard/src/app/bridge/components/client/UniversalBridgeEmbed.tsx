"use client";

import { useTheme } from "next-themes";
import type { Address } from "thirdweb";
import { BuyWidget, type TokenInfo } from "thirdweb/react";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { getSDKTheme } from "@/utils/sdk-component-theme";
import { bridgeAppThirdwebClient } from "../../constants";

export function UniversalBridgeEmbed({
  chainId,
  token,
  amount,
}: {
  chainId?: number;
  token: TokenInfo | undefined;
  amount?: string;
}) {
  const { theme } = useTheme();
  const chain = useV5DashboardChain(chainId || 1);

  return (
    <BuyWidget
      client={bridgeAppThirdwebClient}
      amount={amount || "0"}
      chain={chain}
      tokenAddress={token?.address as Address | undefined}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
    />
  );
}
