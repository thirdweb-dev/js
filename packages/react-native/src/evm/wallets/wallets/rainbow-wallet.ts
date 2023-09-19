import {
  WalletOptions as WalletOptionsRC,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WalletConnectBase } from "./wallet-connect/WalletConnectBase";
import { WalletConnectConfig } from "./wallet-connect/wallet-connect";

export class RainbowWallet extends WalletConnectBase {
  static id = "rainbow" as const;
  static meta = {
    name: "Rainbow",
    iconURL:
      "ipfs://QmSZn47p4DVVBfzvg9BAX2EqwnPxkT1YAE7rUnrtd9CybQ/rainbow-logo.png",
    links: {
      native: "rainbow:",
      universal: "https://rnbwapp.com",
    },
  };

  getMeta() {
    return RainbowWallet.meta;
  }
}

export const rainbowWallet = (config?: WalletConnectConfig) => {
  return {
    id: RainbowWallet.id,
    meta: RainbowWallet.meta,
    create: (options: WalletOptionsRC) =>
      new RainbowWallet({
        ...options,
        walletId: RainbowWallet.id,
        projectId: config?.projectId,
      }),
    recommended: config?.recommended,
  } satisfies WalletConfig;
};
