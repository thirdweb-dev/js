"use client";

import type { TokenInfo } from "thirdweb/react";
import { BuyAndSwapEmbed } from "@/components/blocks/BuyAndSwapEmbed";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
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
  const chain = useV5DashboardChain(chainId || 1);

  return (
    <div className="w-full lg:w-[400px]">
      <BuyAndSwapEmbed
        client={bridgeAppThirdwebClient}
        chain={chain}
        buyAmount={amount}
        tokenAddress={token?.address}
        pageType="bridge"
      />
    </div>
  );
}
