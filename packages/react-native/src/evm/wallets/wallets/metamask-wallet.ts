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

export class MetaMaskWallet extends WalletConnectV1 {
  static id = "metamask" as const;
  static meta = {
    id: "metamask",
    name: "MetaMask",
    iconURL:
      "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/metamask.svg",
    links: {
      native: "metamask:",
      universal: "https://metamask.app.link",
    },
  };

  constructor(options: WC1Options) {
    const storage = createAsyncLocalStorage("metamask");
    super({
      ...options,
      walletId: "metamask",
      walletStorage: storage,
      qrcode: false,
    });

    this.on("open_wallet", this._onWCOpenWallet);

    this.on("disconnect", () => {
      this.removeListener("open_wallet", this._onWCOpenWallet);
    });
  }

  _onWCOpenWallet(uri?: string) {
    const links = MetaMaskWallet.meta.links;

    if (uri) {
      const fullUrl = formatDisplayUri(uri, links);

      Linking.openURL(fullUrl);
    } else {
      const fullUrl = formatDisplayUri("", links);

      Linking.openURL(fullUrl);
    }
  }
}

export const metamaskWallet = () => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptionsRC) => new MetaMaskWallet(options),
  } satisfies Wallet;
};
