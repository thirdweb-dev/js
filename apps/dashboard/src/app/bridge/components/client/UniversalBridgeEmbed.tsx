"use client";

import type { TokenInfo } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { BuyAndSwapEmbed } from "@/components/blocks/BuyAndSwapEmbed";
import { appMetadata } from "@/constants/connect";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";

export const bridgeWallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    appMetadata,
  }),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

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
    <BuyAndSwapEmbed
      chain={chain}
      wallets={bridgeWallets}
      buyAmount={amount}
      tokenAddress={token?.address}
      pageType="bridge"
      isTestnet={chain.testnet}
    />
  );
}
