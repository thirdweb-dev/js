import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WCMeta } from "../types/wc";
import { WalletConnectBase } from "./wallet-connect/WalletConnectBase";
import { WalletConnectConfig } from "./wallet-connect/wallet-connect";
import { TRUST_ICON } from "../../assets/svgs";

export class TrustWallet extends WalletConnectBase {
  static id = "trust" as const;
  static meta = {
    name: "Trust Wallet",
    iconURL: TRUST_ICON,
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
