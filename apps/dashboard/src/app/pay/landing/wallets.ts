import { createWallet } from "thirdweb/wallets";
import { appMetadata } from "@/constants/connect";

export const payLandingWallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    appMetadata,
  }),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("com.okex.wallet"),
];
