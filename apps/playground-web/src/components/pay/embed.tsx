"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import {
  arbitrum,
  arbitrumNova,
  base,
  defineChain,
  treasure,
} from "thirdweb/chains";
import { PayEmbed } from "thirdweb/react";
import { StyledConnectButton } from "../styled-connect-button";

export function StyledPayEmbedPreview() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center">
      <StyledConnectButton
        chains={[base, defineChain(466), arbitrum, treasure, arbitrumNova]}
      />
      <div className="h-10" />
      <PayEmbed
        client={THIRDWEB_CLIENT}
        theme={theme === "light" ? "light" : "dark"}
        payOptions={{
          mode: "fund_wallet",
          metadata: {
            name: "Get funds",
          },
          prefillBuy: {
            chain: base,
            amount: "0.01",
          },
        }}
      />
    </div>
  );
}
