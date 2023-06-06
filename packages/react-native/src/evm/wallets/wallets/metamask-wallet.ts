import { walletIds } from "@thirdweb-dev/wallets";
import {
  WalletOptions as WalletOptionsRC,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WC1Options, WalletConnectV1 } from "./WalletConnectV1";
import { WCMeta } from "../types/wc";

export class MetaMaskWallet extends WalletConnectV1 {
  static id = walletIds.metamask;
  static meta = {
    id: walletIds.metamask,
    name: "MetaMask",
    iconURL:
      "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/metamask.svg",
    links: {
      native: "metamask:",
      universal: "https://metamask.app.link",
    },
  };

  constructor(options: WC1Options) {
    super(options);
  }

  getMeta(): WCMeta {
    return MetaMaskWallet.meta;
  }
}

export const metamaskWallet = () => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptionsRC) =>
      new MetaMaskWallet({ ...options, walletId: walletIds.metamask }),
  } satisfies WalletConfig;
};
