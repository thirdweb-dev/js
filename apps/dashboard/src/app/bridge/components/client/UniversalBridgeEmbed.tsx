"use client";

import { useTheme } from "next-themes";
import { PayEmbed, type TokenInfo } from "thirdweb/react";
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
    <PayEmbed
      client={bridgeAppThirdwebClient}
      payOptions={{
        mode: "fund_wallet",
        prefillBuy:
          chainId && token
            ? {
                amount,
                chain,
                token,
              }
            : undefined,
      }}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
    />
  );
}
