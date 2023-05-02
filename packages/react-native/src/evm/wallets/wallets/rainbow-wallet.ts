import {
  WalletOptions,
  WalletConnectV1Options,
  WalletConnectV1,
} from "@thirdweb-dev/wallets";
import { formatDisplayUri } from "../../utils/uri";
import { Linking } from "react-native";
import {
  WalletOptions as WalletOptionsRC,
  Wallet,
  ExtraCoreWalletOptions,
} from "@thirdweb-dev/react-core";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";

type WC1Options = Omit<
  WalletOptions<WalletConnectV1Options>,
  "qrcode" | "walletStorage"
> &
  ExtraCoreWalletOptions;

export class RainbowWallet extends WalletConnectV1 {
  static id = "rainbow" as const;
  static meta = {
    id: "rainbow",
    name: "Rainbow",
    iconURL:
      "https://registry.walletconnect.org/v2/logo/md/7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500",
    links: {
      native: "rainbow:",
      universal: "https://rnbwapp.com",
    },
  };

  constructor(options: WC1Options) {
    const storage = createAsyncLocalStorage("rainbow");
    super({
      ...options,
      walletId: "rainbow",
      walletStorage: storage,
      qrcode: false,
    });
    this.on("open_wallet", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("open_wallet", this._onWCOpenWallet);
    });
  }

  _onWCOpenWallet(uri?: string) {
    const links = RainbowWallet.meta.links;

    if (uri) {
      const fullUrl = formatDisplayUri(uri, links);

      Linking.openURL(fullUrl);
    } else {
      const fullUrl = formatDisplayUri("", links);

      Linking.openURL(fullUrl);
    }
  }
}

export const rainbowWallet = () => {
  return {
    id: RainbowWallet.id,
    meta: RainbowWallet.meta,
    create: (options: WalletOptionsRC) => new RainbowWallet(options),
  } satisfies Wallet;
};
