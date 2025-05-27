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
      payOptions={{
        mode: "fund_wallet",
        metadata: {
          name: `Buy ${props.tokenSymbol}`,
        },
        prefillBuy: {
          chain: props.chain,
          token: {
            name: props.tokenName,
            symbol: props.tokenSymbol,
            address: props.tokenAddress,
          },
          amount: "1",
          allowEdits: {
            token: false,
            chain: false,
            amount: true,
          },
        },
      }}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
      connectOptions={{
        autoConnect: false,
      }}
    />
  );
}
