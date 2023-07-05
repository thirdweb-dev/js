import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WalletConnectV2 } from "./WalletConnectV2";
import { WCMeta } from "../types/wc";

export class TrustWallet extends WalletConnectV2 {
  static id = "trust" as const;
  static meta = {
    name: "Trust Wallet",
    iconURL:
      "https://registry.walletconnect.org/v2/logo/md/0528ee7e-16d1-4089-21e3-bbfb41933100",
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
