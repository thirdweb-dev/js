import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WalletConnectV2 } from "./WalletConnectV2";
import { WCMeta } from "../types/wc";

export class TrustWallet extends WalletConnectV2 {
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

type TrustWalletConfig = { projectId?: string };

export const trustWallet = (config?: TrustWalletConfig) => {
  return {
    id: TrustWallet.id,
    meta: TrustWallet.meta,
    create: (options: WalletOptions) =>
      new TrustWallet({
        ...options,
        walletId: "trust",
        projectId: config?.projectId,
      }),
  } satisfies WalletConfig<WalletConnectV2>;
};
