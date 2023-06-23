import {
  WalletOptions as WalletOptionsRC,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WalletConnectV1 } from "./WalletConnectV1";

export class RainbowWallet extends WalletConnectV1 {
  static id = "rainbow" as const;
  static meta = {
    name: "Rainbow",
    iconURL:
      "https://registry.walletconnect.org/v2/logo/md/7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500",
    links: {
      native: "rainbow:",
      universal: "https://rnbwapp.com",
    },
  };

  getMeta() {
    return RainbowWallet.meta;
  }
}

export const rainbowWallet = () => {
  return {
    id: RainbowWallet.id,
    meta: RainbowWallet.meta,
    create: (options: WalletOptionsRC) =>
      new RainbowWallet({ ...options, walletId: RainbowWallet.id }),
  } satisfies WalletConfig;
};
