import { createAsyncLocalStorage } from "../../../core/AsyncStorage";
import { TW_WC_PROJECT_ID } from "../../constants/walletConnect";
import { formatWalletConnectDisplayUri } from "../../utils/uri";
import type {
  WalletConnectOptions,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import {
  WalletOptions as WalletOptionsRC,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WalletConnect } from "@thirdweb-dev/wallets";
import { Linking } from "react-native";

type WC2Options = { projectId?: string } & Omit<
  WalletOptions<WalletConnectOptions>,
  "projectId" | "qrcode" | "walletStorage" | "qrModalOptions"
>;

export class TrustWallet extends WalletConnect {
  static id = "trust" as const;
  static meta = {
    id: "trust",
    name: "Trust Wallet",
    iconURL:
      "https://registry.walletconnect.org/v2/logo/md/0528ee7e-16d1-4089-21e3-bbfb41933100",
    links: {
      native: "trust:",
      universal: "https://link.trustwallet.com",
    },
  };

  constructor(options: WC2Options) {
    const storage = createAsyncLocalStorage("trustwallet");
    super({
      ...options,
      walletId: "trust",
      qrcode: false,
      projectId: options.projectId ? options.projectId : TW_WC_PROJECT_ID,
      walletStorage: storage,
    });

    this.on("open_wallet", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("open_wallet", this._onWCOpenWallet);
    });
  }

  _onWCOpenWallet(uri?: string) {
    const links = TrustWallet.meta.links;

    if (uri) {
      const fullUrl = formatWalletConnectDisplayUri(uri, links);

      Linking.openURL(fullUrl);
    } else {
      const fullUrl = formatWalletConnectDisplayUri("", links);

      Linking.openURL(fullUrl);
    }
  }
}

type TrustWalletConfig = { projectId?: string };

export const trustWallet = (config?: TrustWalletConfig) => {
  const projectId = config?.projectId ? config.projectId : TW_WC_PROJECT_ID;
  return {
    id: TrustWallet.id,
    meta: TrustWallet.meta,
    create: (options: WalletOptionsRC) =>
      new TrustWallet({ ...options, projectId: projectId }),
    config: {
      projectId: projectId,
    },
  } satisfies WalletConfig<WalletConnect, TrustWalletConfig>;
};
