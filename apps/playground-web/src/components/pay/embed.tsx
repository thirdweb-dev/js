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
import { PayEmbed, getDefaultToken } from "thirdweb/react";

export function StyledPayEmbedPreview() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center">
      <PayEmbed
        client={THIRDWEB_CLIENT}
        theme={theme === "light" ? "light" : "dark"}
        connectOptions={{
          chains: [base, defineChain(466), arbitrum, treasure, arbitrumNova],
        }}
        supportedTokens={{
          466: [
            {
              address: "0x675C3ce7F43b00045a4Dab954AF36160fb57cB45",
              name: "USDC",
              symbol: "USDC",
              icon: getDefaultToken(base, "USDC")?.icon,
            },
          ],
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          8453: [getDefaultToken(base, "USDC")!],
          42161: [
            {
              address: "0x539bde0d7dbd336b79148aa742883198bbf60342",
              name: "MAGIC",
              symbol: "MAGIC",
            },
          ],
          [arbitrumNova.id]: [
            {
              name: "Godcoin",
              symbol: "GOD",
              address: "0xb5130f4767ab0acc579f25a76e8f9e977cb3f948",
              icon: "https://assets.coingecko.com/coins/images/53848/standard/GodcoinTickerIcon_02.png",
            },
          ],
        }}
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
