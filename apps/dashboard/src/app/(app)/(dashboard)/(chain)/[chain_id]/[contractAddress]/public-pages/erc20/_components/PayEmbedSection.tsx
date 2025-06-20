"use client";

import { useTheme } from "next-themes";
import type { Chain, ThirdwebClient } from "thirdweb";
import { PayEmbed } from "thirdweb/react";
import { getSDKTheme } from "../../../../../../../components/sdk-component-theme";

export function BuyTokenEmbed(props: {
  client: ThirdwebClient;
  chain: Chain;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
}) {
  const { theme } = useTheme();
  return (
    <PayEmbed
      className="!rounded-xl !w-full"
      client={props.client}
      connectOptions={{
        autoConnect: false,
      }}
      payOptions={{
        metadata: {
          name: `Buy ${props.tokenSymbol}`,
        },
        mode: "fund_wallet",
        prefillBuy: {
          allowEdits: {
            amount: true,
            chain: false,
            token: false,
          },
          amount: "1",
          chain: props.chain,
          token: {
            address: props.tokenAddress,
            name: props.tokenName,
            symbol: props.tokenSymbol,
          },
        },
      }}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
    />
  );
}
