import {
  WalletOptions,
  WalletConnectV1Options,
  WalletConnectV1 as WalletConnectV1Wallets,
} from "@thirdweb-dev/wallets";
import { formatWalletConnectDisplayUri } from "../../utils/uri";
import { Linking } from "react-native";
import { ExtraCoreWalletOptions } from "@thirdweb-dev/react-core";
import { WCMeta } from "../types/wc";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";

export type WC1Options = Omit<
  WalletOptions<WalletConnectV1Options>,
  "qrcode" | "walletId"
> &
  ExtraCoreWalletOptions & {
    walletId: NonNullable<WalletOptions["walletId"]>;
  };

export abstract class WalletConnectV1 extends WalletConnectV1Wallets {
  constructor(options: WC1Options) {
    super({
      ...options,
      walletId: options.walletId,
      walletStorage:
        options.walletStorage || createAsyncLocalStorage(options.walletId),
      qrcode: false,
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
