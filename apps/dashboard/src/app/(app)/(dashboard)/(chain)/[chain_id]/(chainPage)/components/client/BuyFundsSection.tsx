"use client";
import { useTheme } from "next-themes";
import { defineChain, type ThirdwebClient } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { BuyWidget } from "thirdweb/react";
import { getSDKTheme } from "@/utils/sdk-component-theme";

export function BuyFundsSection(props: {
  chain: ChainMetadata;
  client: ThirdwebClient;
}) {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col gap-4 items-center justify-center">
      <BuyWidget
        amount="0"
        // eslint-disable-next-line no-restricted-syntax
        chain={defineChain(props.chain.chainId)}
        client={props.client}
        theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
      />
    </section>
  );
}
