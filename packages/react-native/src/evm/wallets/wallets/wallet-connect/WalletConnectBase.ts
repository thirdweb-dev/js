import type {
  WalletConnectOptions,
  WalletOptions,
} from "@thirdweb-dev/wallets";
import { WalletConnect as WalletConnectV2Wallets } from "@thirdweb-dev/wallets";
import { Linking } from "react-native";
import { TW_WC_PROJECT_ID } from "../../../constants/walletConnect";
import { createAsyncLocalStorage } from "../../../../core/AsyncStorage";
import { WCMeta } from "../../types/wc";
import { formatWalletConnectDisplayUri } from "../../../utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export abstract class WalletConnectBase extends WalletConnectV2Wallets {
  constructor(options: WC2Options) {
    super({
      ...options,
      walletId: options.walletId,
      qrcode: false,
      projectId: options.projectId ? options.projectId : TW_WC_PROJECT_ID,
      walletStorage:
        options.walletStorage || createAsyncLocalStorage(options.walletId),
    });

    this.on("display_uri", this._onWCOpenWallet);
    this.on("wc_session_request_sent", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("display_uri", this._onWCOpenWallet);
      this.removeListener("wc_session_request_sent", this._onWCOpenWallet);
      this.cleanAsyncStorage();
    });
  }

  async cleanAsyncStorage() {
    const allKeys = await AsyncStorage.getAllKeys();
    for (const key of allKeys) {
      if (key.includes("wc@2")) {
        await AsyncStorage.removeItem(key);
      }
    }

    await AsyncStorage.removeItem(".sdk-comm");
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

/**
 * @deprecated There's no longer the need to define V1/V2 for walletConnect.
 *
 * Use WalletConnectBase instead.
 */
export abstract class WalletConnectV2 extends WalletConnectBase {}
