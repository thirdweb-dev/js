import { TW_WC_PROJECT_ID } from "../../constants/walletConnect";
import { formatWalletConnectDisplayUri } from "../../utils/uri";
import type {
  WalletConnectOptions,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import { WalletConnect as WalletConnectV2Wallets } from "@thirdweb-dev/wallets";
import { Linking } from "react-native";
import { WCMeta } from "../types/wc";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";

export type WC2Options = {
  /**
   * The WalletConnectV2 projectId.
   *
   * We provide a default projectId but recommend you get your own
   * when launching your app in production.
   */
  projectId?: string;
} & Omit<
  WalletOptions<WalletConnectOptions>,
  "projectId" | "qrcode" | "qrModalOptions" | "clientId" | "secretKey"
> & {
    walletId: NonNullable<WalletOptions["walletId"]>;
  };

export abstract class WalletConnectV2 extends WalletConnectV2Wallets {
  constructor(options: WC2Options) {
    super({
      ...options,
      walletId: options.walletId,
      qrcode: false,
      projectId: options.projectId ? options.projectId : TW_WC_PROJECT_ID,
      walletStorage:
        options.walletStorage || createAsyncLocalStorage(options.walletId),
    });

    this.on("open_wallet", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("open_wallet", this._onWCOpenWallet);
    });
  }

  abstract getMeta(): WCMeta;

  _onWCOpenWallet(uri?: string) {
    const links = this.getMeta().links;

    if (uri) {
      const fullUrl = formatWalletConnectDisplayUri(uri, links);

      Linking.openURL(fullUrl);
    } else {
      const fullUrl = formatWalletConnectDisplayUri("", links);

      Linking.openURL(fullUrl);
    }
  }
}
