"use client";

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
  buyTab: BuyAndSwapEmbedProps["buyTab"];
  swapTab: BuyAndSwapEmbedProps["swapTab"];
  pageType: "bridge" | "bridge-iframe";
}) {
  return (
    <BuyAndSwapEmbed
      buyTab={props.buyTab}
      swapTab={props.swapTab}
      pageType={props.pageType}
      wallets={bridgeWallets}
    />
  );
}
