"use client";

import { useTheme } from "next-themes";
import { PayEmbed } from "thirdweb/react";
import { getSDKTheme } from "../../../(app)/components/sdk-component-theme";
import { useV5DashboardChain } from "../../../../lib/v5-adapter";
import { bridgeAppThirdwebClient } from "../../constants";

export function UniversalBridgeEmbed({ chainId }: { chainId?: number }) {
  const { theme } = useTheme();
  const chain = useV5DashboardChain(chainId || 1);

  return (
    <PayEmbed
      client={bridgeAppThirdwebClient}
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
