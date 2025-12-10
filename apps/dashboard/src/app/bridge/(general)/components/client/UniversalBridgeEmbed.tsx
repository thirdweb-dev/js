"use client";

import type { SupportedFiatCurrency } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import {
  BuyAndSwapEmbed,
  type BuyAndSwapEmbedProps,
} from "@/components/blocks/BuyAndSwapEmbed";
import { appMetadata } from "@/constants/connect";

export const bridgeWallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    appMetadata,
  }),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("com.okex.wallet"),
];

export function UniversalBridgeEmbed(props: {
  persistTokenSelections?: boolean;
  buyTab: BuyAndSwapEmbedProps["buyTab"];
  swapTab: BuyAndSwapEmbedProps["swapTab"];
  pageType: "bridge" | "bridge-iframe";
  currency?: SupportedFiatCurrency;
}) {
  return (
    <BuyAndSwapEmbed
      persistTokenSelections={props.persistTokenSelections}
      currency={props.currency}
      buyTab={props.buyTab}
      swapTab={props.swapTab}
      pageType={props.pageType}
      wallets={bridgeWallets}
    />
  );
}
