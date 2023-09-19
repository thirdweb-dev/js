import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WCMeta } from "../types/wc";
import { WalletConnectBase } from "./wallet-connect/WalletConnectBase";
import { WalletConnectConfig } from "./wallet-connect/wallet-connect";

export class TrustWallet extends WalletConnectBase {
  static id = "trust" as const;
  static meta = {
    name: "Trust Wallet",
    iconURL:
      "ipfs://QmNigQbXk7wKZwDcgN38Znj1ZZQ3JEG3DD6fUKLBU8SUTP/trust%20wallet.svg",
    links: {
      native: "trust:",
      universal: "https://link.trustwallet.com",
    },
  };

  getMeta(): WCMeta {
    return TrustWallet.meta;
  }
}

export const trustWallet = (config?: WalletConnectConfig) => {
  return {
    id: TrustWallet.id,
    meta: TrustWallet.meta,
    create: (options: WalletOptions) =>
      new TrustWallet({
        ...options,
        walletId: "trust",
        projectId: config?.projectId,
      }),
    recommended: config?.recommended,
  } satisfies WalletConfig<WalletConnectBase>;
};
