"use client";

import { getSDKTheme } from "app/components/sdk-component-theme";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useTheme } from "next-themes";
import type { ThirdwebClient } from "thirdweb";
import { PayEmbed } from "thirdweb/react";

export function UniversalBridgeEmbed({
  chainId,
  client,
}: { chainId?: number; client: ThirdwebClient }) {
  const { theme } = useTheme();
  const chain = useV5DashboardChain(chainId || 1);

  return (
    <PayEmbed
      client={client}
      payOptions={{
        mode: "fund_wallet",
        prefillBuy: {
          chain,
          amount: "0.01",
        },
      }}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
    />
  );
}
